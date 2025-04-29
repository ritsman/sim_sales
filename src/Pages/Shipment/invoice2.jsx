import { useEffect, useState, useRef } from "react";
import axios from "axios";
import config from "../../config";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  // All your existing state variables and other code...
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [deliveryDestination, setDeliveryDestination] = useState("");
  const [parties, setParties] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [invoiceTotal, setInvoiceTotal] = useState({
    subtotal: 0,
    gstAmount: 0,
    total: 0,
  });
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [selectedPartyDetails, setSelectedPartyDetails] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: "Vardhaman Texttiles",
    address: "102 Anand Nagar, Indore, Madhya Pradesh - 451212",
    gstin: "27AAAXX0000X1Z5",
    phone: "+91 9876543210",
    email: "info@vardhaman.com",
  });

  const invoiceRef = useRef();

  // Your existing fetchData function and other functions...
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch orders and parties data
      const [ordersResponse, partiesResponse] = await Promise.all([
        axios.get(`${config.API_URL}/api/sales/getSales`),
        axios.get(`${config.API_URL}/api/master/getParty`),
      ]);

      setAllOrders(ordersResponse.data || []);
      setParties(partiesResponse.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load orders or parties data.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = async (orderNo) => {
    setSelectedOrder(orderNo);

    if (!orderNo) {
      setInvoiceItems([]);
      setOrderData(null);
      return;
    }

    try {
      // Fetch detailed order data
      const orderResponse = await axios.get(
        `${config.API_URL}/api/sales/getOrder/${orderNo}`
      );
      const order = orderResponse.data;
      setOrderData(order);

      // Fetch dispatched data for this order
      const dispatchedResponse = await axios.get(
        `${config.API_URL}/api/shipment/getDispatchedByOrderNo/${orderNo}`
      );
      const dispatchedData = dispatchedResponse.data;

      // Process order products and dispatched quantities
      const items = [];
      if (order && order.products && Array.isArray(order.products)) {
        order.products.forEach((product) => {
          // Find dispatched data for this product
          const dispatched = dispatchedData.find((d) =>
            d.products.some((p) => p.productId === product._id)
          );

          // Process each size for the product
          const sizes = product.sizes2 || {};

          Object.entries(sizes).forEach(([size, orderedQty]) => {
            // Find dispatched quantity for this product and size
            const dispatchedQty =
              dispatched?.products.find(
                (p) => p.productId === product._id && p.size === size
              )?.dispatched_quantity || 0;

            if (dispatchedQty > 0) {
              // Only add items that have been dispatched
              const price = product.price || 0;
              const gstRate = product.gstRate || 18; // Default GST rate of 18%
              const gstAmount = (price * dispatchedQty * gstRate) / 100;
              const totalPrice = price * dispatchedQty + gstAmount;

              items.push({
                productId: product._id,
                styleName: product.styleName || "Unknown Style",
                color: product.selectedColor.name || "N/A",
                size,
                orderedQty,
                dispatchedQty,
                price,
                gstRate,
                gstAmount,
                totalPrice,
              });
            }
          });
        });
      }

      setInvoiceItems(items);
      calculateTotals(items);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details.");
    }
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.dispatchedQty,
      0
    );
    const gstAmount = items.reduce((sum, item) => sum + item.gstAmount, 0);
    const total = subtotal + gstAmount;

    setInvoiceTotal({
      subtotal,
      gstAmount,
      total,
    });
  };

  const updateItemPrice = (index, newPrice) => {
    const updatedItems = [...invoiceItems];

    // Update price
    updatedItems[index].price = Number(newPrice);

    // Recalculate GST and total price
    const dispatchedQty = updatedItems[index].dispatchedQty;
    const gstRate = updatedItems[index].gstRate;
    updatedItems[index].gstAmount = (newPrice * dispatchedQty * gstRate) / 100;
    updatedItems[index].totalPrice =
      newPrice * dispatchedQty + updatedItems[index].gstAmount;

    setInvoiceItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const updateItemGst = (index, newGstRate) => {
    const updatedItems = [...invoiceItems];

    // Update GST rate
    updatedItems[index].gstRate = Number(newGstRate);

    // Recalculate GST amount and total price
    const price = updatedItems[index].price;
    const dispatchedQty = updatedItems[index].dispatchedQty;
    updatedItems[index].gstAmount = (price * dispatchedQty * newGstRate) / 100;
    updatedItems[index].totalPrice =
      price * dispatchedQty + updatedItems[index].gstAmount;

    setInvoiceItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const generateInvoice = async () => {
    if (
      !selectedParty ||
      !deliveryDestination ||
      !selectedOrder ||
      invoiceItems.length === 0
    ) {
      alert(
        "Please fill in all required fields and select an order with dispatched items."
      );
      return;
    }

    try {
      const invoiceData = {
        orderNo: selectedOrder,
        partyId: selectedParty,
        deliveryDestination,
        items: invoiceItems,
        subtotal: invoiceTotal.subtotal,
        gstAmount: invoiceTotal.gstAmount,
        totalAmount: invoiceTotal.total,
        invoiceDate: new Date().toISOString(),
        status: "CREATED",
      };

      // Send invoice data to backend
      const response = await axios.post(
        `${config.API_URL}/api/shipment/createInvoice`,
        invoiceData
      );

      // Set invoice number from response
      setInvoiceNumber(response.data.invoiceNumber || `INV-${Date.now()}`);

      // Get party details for the invoice
      const partyDetails = parties.find((party) => party._id === selectedParty);
      setSelectedPartyDetails(partyDetails);

      // Show print preview
      setShowPrintPreview(true);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    }
  };

  const handlePartySelect = (partyId) => {
    setSelectedParty(partyId);
    setSelectedOrder("");
    setInvoiceItems([]);
    setOrderData(null);
  };

  useEffect(() => {
    if (selectedParty) {
      const partyOrders = allOrders.filter(
        (order) => order.buyerId === selectedParty
      );
      setFilteredOrders(partyOrders);
      // Reset selected order when party changes
      setSelectedOrder("");
      setInvoiceItems([]);
    } else {
      setFilteredOrders([]);
    }
  }, [selectedParty, allOrders]);

  // This is the original print function using useReactToPrint
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${invoiceNumber}`,
    onAfterPrint: () => {
      setShowPrintPreview(false);

      // Reset form after printing
      setSelectedOrder("");
      setSelectedParty("");
      setDeliveryDestination("");
      setInvoiceItems([]);
      setInvoiceNumber("");
    },
  });

  // NEW FUNCTION: Direct PDF download function using html2canvas and jsPDF
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    
    try {
      // Show loading state if needed
      // setIsGeneratingPdf(true);
      
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions - using A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if the content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
      
      // Hide loading state
      // setIsGeneratingPdf(false);
      
      // Clean up after download
      setShowPrintPreview(false);
      
      // Reset form after printing
      setSelectedOrder("");
      setSelectedParty("");
      setDeliveryDestination("");
      setInvoiceItems([]);
      setInvoiceNumber("");
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      // setIsGeneratingPdf(false);
    }
  };

  const convertNumberToWords = (num) => {
    const single = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const double = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const formatTns = (num) => {
      if (num < 10) return single[num];
      else if (num < 20) return double[num - 10];
      else
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + single[num % 10] : "")
        );
    };

    const formatHnd = (num) => {
      if (num > 99)
        return (
          single[Math.floor(num / 100)] +
          " Hundred " +
          (num % 100 !== 0 ? "and " + formatTns(num % 100) : "")
        );
      else return formatTns(num);
    };

    if (num === 0) return "Zero";

    let total = Math.round(num);
    let inrValue = Math.floor(total);
    let paiseValue = Math.round((total - inrValue) * 100);

    let result = "";

    if (inrValue > 0) {
      if (inrValue > 9999999) {
        result += formatHnd(Math.floor(inrValue / 10000000)) + " Crore ";
        inrValue %= 10000000;
      }

      if (inrValue > 99999) {
        result += formatHnd(Math.floor(inrValue / 100000)) + " Lakh ";
        inrValue %= 100000;
      }

      if (inrValue > 999) {
        result += formatHnd(Math.floor(inrValue / 1000)) + " Thousand ";
        inrValue %= 1000;
      }

      if (inrValue > 0) {
        result += formatHnd(inrValue);
      }

      result += " Rupees";
    }

    if (paiseValue > 0) {
      result += " and " + formatTns(paiseValue) + " Paise";
    }

    return result;
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading data...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto p-6 text-red-500">{error}</div>;
  }

  if (showPrintPreview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Invoice Preview</h2>
            <div>
              <button
                onClick={handleDownloadPdf} // Changed from handlePrint to handleDownloadPdf
                className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
              >
                Print/Download PDF
              </button>
              <button
                onClick={() => setShowPrintPreview(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>

          <div className="border border-gray-300 p-6" ref={invoiceRef}>
            {/* Invoice Template for PDF */}
            <div className="mb-6 border-b-2 border-gray-300 pb-4">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
                  <p>{companyInfo.address}</p>
                  <p>GSTIN: {companyInfo.gstin}</p>
                  <p>Phone: {companyInfo.phone}</p>
                  <p>Email: {companyInfo.email}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold mb-2">TAX INVOICE</h2>
                  <p>Invoice No: {invoiceNumber}</p>
                  <p>
                    Date: {new Date(invoiceDate).toLocaleDateString("en-IN")}
                  </p>
                  <p>Order No: {selectedOrder}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-300 p-3">
                <h3 className="font-bold mb-1">Bill To:</h3>
                <p>{selectedPartyDetails?.companyName || "Client Name"}</p>
                <p>{selectedPartyDetails?.address || "Client Address"}</p>
                <p>GSTIN: {selectedPartyDetails?.gstin || "GSTIN Number"}</p>
                <p>
                  Contact: {selectedPartyDetails?.mobile || "Contact Number"}
                </p>
              </div>
              <div className="border border-gray-300 p-3">
                <h3 className="font-bold mb-1">Ship To:</h3>
                <p>{deliveryDestination}</p>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">S.No</th>
                  <th className="border px-3 py-2 text-left">Style No</th>
                  <th className="border px-3 py-2 text-left">Description</th>
                  <th className="border px-3 py-2 text-center">Size</th>
                  <th className="border px-3 py-2 text-right">Qty</th>
                  <th className="border px-3 py-2 text-right">Price (₹)</th>
                  <th className="border px-3 py-2 text-right">Amount (₹)</th>
                  <th className="border px-3 py-2 text-right">GST % </th>
                  <th className="border px-3 py-2 text-right">GST Amt (₹)</th>
                  <th className="border px-3 py-2 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => (
                  <tr key={`${item.productId}-${item.size}`}>
                    <td className="border px-3 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-3 py-2">{item.styleName}</td>
                    <td className="border px-3 py-2">{`${item.styleName} - ${item.color}`}</td>
                    <td className="border px-3 py-2 text-center">
                      {item.size}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {item.dispatchedQty}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {(item.price * item.dispatchedQty).toFixed(2)}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {item.gstRate}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {item.gstAmount.toFixed(2)}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}

                {/* Empty rows to maintain layout */}
                {invoiceItems.length < 10 &&
                  Array(10 - invoiceItems.length)
                    .fill()
                    .map((_, i) => (
                      <tr key={`empty-${i}`}>
                        <td className="border px-3 py-2">&nbsp;</td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                        <td className="border px-3 py-2"></td>
                      </tr>
                    ))}

                {/* Totals */}
                <tr className="font-semibold">
                  <td colSpan="6" className="border px-3 py-2 text-right">
                    Sub Total:
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {invoiceTotal.subtotal.toFixed(2)}
                  </td>
                  <td colSpan="2" className="border px-3 py-2 text-right">
                    Total GST:
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {invoiceTotal.gstAmount.toFixed(2)}
                  </td>
                </tr>
                <tr className="font-bold bg-gray-100">
                  <td colSpan="8" className="border px-3 py-2 text-right">
                    Grand Total:
                  </td>
                  <td colSpan="2" className="border px-3 py-2 text-right">
                    ₹{invoiceTotal.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mb-6 border-t border-gray-300 pt-2">
              <p className="font-semibold">Amount in words:</p>
              <p>{convertNumberToWords(invoiceTotal.total)} Only</p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* <div className="border border-gray-300 p-3">
                <h3 className="font-bold mb-1">Bank Details:</h3>
                <p>Bank Name: YOUR BANK NAME</p>
                <p>A/C No: 1234567890123456</p>
                <p>IFSC Code: BANK0001234</p>
                <p>Branch: Your Branch Name</p>
              </div> */}
              <div className="text-right mt-12">
                <p className="font-bold">For {companyInfo.name}</p>
                <div className="h-16"></div>
                <p className="font-bold">Authorized Signatory</p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-2 text-xs">
              <p className="text-center mt-2">
                This is a computer generated invoice and does not require a
                signature.
              </p>
              <p className="font-bold text-center mt-1">
                Thank You for Your Business!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your component (the form part)
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party/Client *
          </label>
          <select
            className="w-full p-2 border rounded"
            value={selectedParty}
            onChange={(e) => handlePartySelect(e.target.value)}
            required
          >
            <option value="">Select Party</option>
            {parties.map((party) => (
              <option key={party._id} value={party._id}>
                {party.companyName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Destination *
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={deliveryDestination}
            onChange={(e) => setDeliveryDestination(e.target.value)}
            placeholder="Enter delivery destination"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Number *
          </label>
          <select
            className="w-full p-2 border rounded"
            value={selectedOrder}
            onChange={(e) => handleOrderSelect(e.target.value)}
            required
            disabled={!selectedParty}
          >
            <option value="">
              {selectedParty ? "Select Order" : "Please select a party first"}
            </option>
            {filteredOrders.map((order) => (
              <option key={order.order_no} value={order.order_no}>
                {order.order_no} - {order.buyer}
              </option>
            ))}
          </select>
          {selectedParty && filteredOrders.length === 0 && (
            <p className="text-sm text-orange-600 mt-1">
              No orders found for selected party
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
      </div>

      {selectedOrder && (
        <>
          <h3 className="text-lg font-medium mb-2 mt-6">Invoice Items</h3>
          {invoiceItems.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-4">
              <p>No dispatched items found for this order.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Product ID</th>
                    <th className="border px-4 py-2 text-left">Style Name</th>
                    <th className="border px-4 py-2 text-left">Color</th>
                    <th className="border px-4 py-2 text-left">Size</th>
                    <th className="border px-4 py-2 text-right">Ordered Qty</th>
                    <th className="border px-4 py-2 text-right">
                      Dispatch Qty
                    </th>
                    <th className="border px-4 py-2 text-right">Price (₹)</th>
                    <th className="border px-4 py-2 text-right">GST %</th>
                    <th className="border px-4 py-2 text-right">
                      GST Amount (₹)
                    </th>
                    <th className="border px-4 py-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, index) => (
                    <tr key={`${item.productId}-${item.size}`}>
                      <td className="border px-4 py-2">{item.productId}</td>
                      <td className="border px-4 py-2">{item.styleName}</td>
                      <td className="border px-4 py-2">{item.color}</td>
                      <td className="border px-4 py-2">{item.size}</td>
                      <td className="border px-4 py-2 text-right">
                        {item.orderedQty}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {item.dispatchedQty}
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-20 p-1 border rounded text-right"
                          value={item.price}
                          onChange={(e) =>
                            updateItemPrice(index, e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-16 p-1 border rounded text-right"
                          value={item.gstRate}
                          onChange={(e) => updateItemGst(index, e.target.value)}
                        />
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {item.gstAmount.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  {/* Totals Row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan="6" className="border px