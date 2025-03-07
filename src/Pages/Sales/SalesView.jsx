"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import config from "../../config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QRCodeSVG } from "qrcode.react";

const SalesView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/sales/getSales`
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`${config.API_URL}/api/sales/cancelOrder/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      toast.error("Failed to cancel order. Please try again.");
      console.error("Cancel Order Error:", err);
    }
  };

  // Determine order status based on dates (hardcoded logic for now)
  const getOrderStatus = (order) => {
    const currentDate = new Date();
    const confirmDate = new Date(order.confirm_date);
    const entryDate = new Date(order.entry_date);
    const exFactoryDate = new Date(order.ex_factory_date);
    const deliveryDate = new Date(order.delivery_date);

    // Simplifying the logic for now - in a real app this would come from order status in the database
    if (currentDate >= deliveryDate) {
      return 4; // Delivered
    } else if (currentDate >= exFactoryDate) {
      return 3; // Shipped
    } else if (currentDate >= entryDate) {
      return 2; // Confirmed
    } else if (currentDate >= confirmDate) {
      return 1; // Ordered
    } else {
      return 0; // Not started yet
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (orders.length === 0)
    return (
      <div className="text-center mt-8 text-gray-600">No orders found.</div>
    );

  const createPdf = (order) => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Sales Order", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Order Details
    const orderDetails = [
      ["Order No:", order.order_no, "Buyer:", order.buyer],
      [
        "Shipment Destination:",
        order.shipment_destination,
        "Shipment Type:",
        order.shipment_type,
      ],
      [
        "Confirm Date:",
        format(new Date(order.confirm_date), "dd/MM/yyyy"),
        "Entry Date:",
        format(new Date(order.entry_date), "dd/MM/yyyy"),
      ],
      [
        "Ex Factory Date:",
        format(new Date(order.ex_factory_date), "dd/MM/yyyy"),
        "Delivery Date:",
        format(new Date(order.delivery_date), "dd/MM/yyyy"),
      ],
      ["Agent:", order.agent, "Factory Location:", order.factory_location],
    ];

    autoTable(doc, {
      startY: 25,
      body: orderDetails,
      theme: "plain",
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 45 },
        1: { cellWidth: 55 },
        2: { fontStyle: "bold", cellWidth: 45 },
        3: { cellWidth: 55 },
      },
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    // For PDF generation, we'll need to use a different approach
    // since we can't directly render React components to PDF
    // This is a simplified approach - in production you might want to use a QR code library
    // that works directly with jsPDF
    doc.setFontSize(10);
    doc.text(`Order QR Code: ${order.order_no}`, 14, finalY);

    finalY += 10; // Adjust position for product table

    // Product Table Headers
    const tableColumn = ["Product", "Size", "Quantity", "Price (RS)"];
    const tableRows = [];

    order.products.forEach((product) => {
      Object.entries(product.sizes2).forEach(([size, sizeData]) => {
        if (sizeData > 0) {
          // Only include sizes that were ordered
          tableRows.push([
            product.styleName,
            size,
            sizeData, // Fetch available stock instead of quantity
            `${(product.price * sizeData).toFixed(2)}`,
          ]);
        }
      });
    });

    // Render Product Table
    autoTable(doc, {
      startY: finalY,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 122, 204], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    finalY = doc.lastAutoTable.finalY + 10;

    // Grand Total
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: ${order.grandTotal.toFixed(2)} RS`, 14, finalY);

    // Open in new tab
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sales Orders</h1>
      <div className="max-h-[600px] overflow-y-auto border rounded-lg p-4 shadow-md bg-gray-50">
        {orders.map((order) => {
          const orderStatus = getOrderStatus(order);

          return (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-6 mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Order No: {order.order_no}
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => createPdf(order)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>

              {/* Amazon-style Order Progress Tracker - Enhanced Version */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <div className="relative">
                  {/* Background Track */}
                  <div className="absolute top-1/2 left-0 w-full h-2 -mt-1 bg-gray-200 rounded-full"></div>

                  {/* Progress Fill */}
                  <div
                    className="absolute top-1/2 left-0 h-2 -mt-1 bg-gradient-to-r from-blue-400 to-green-500 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(orderStatus / 4) * 100}%` }}
                  ></div>

                  {/* Steps Container */}
                  <div className="relative flex justify-between items-center">
                    {/* Step 1: Ordered */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 mb-2 flex items-center justify-center rounded-full shadow-md border-2 transition-all duration-300 z-10
            ${
              orderStatus >= 1
                ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 text-white transform scale-110"
                : "bg-white border-gray-300"
            }`}
                      >
                        {orderStatus >= 1 ? (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-center">
                        <span
                          className={`text-sm font-medium ${
                            orderStatus >= 1 ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          Ordered
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(order.confirm_date), "MMM dd")}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 mb-2 flex items-center justify-center rounded-full shadow-md border-2 transition-all duration-300 z-10
            ${
              orderStatus >= 2
                ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-700 text-white transform scale-110"
                : "bg-white border-gray-300"
            }`}
                      >
                        {orderStatus >= 2 ? (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-center">
                        <span
                          className={`text-sm font-medium ${
                            orderStatus >= 2 ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          Confirmed
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(order.entry_date), "MMM dd")}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Shipped */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 mb-2 flex items-center justify-center rounded-full shadow-md border-2 transition-all duration-300 z-10
            ${
              orderStatus >= 3
                ? "bg-gradient-to-r from-blue-700 to-green-600 border-green-600 text-white transform scale-110"
                : "bg-white border-gray-300"
            }`}
                      >
                        {orderStatus >= 3 ? (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-center">
                        <span
                          className={`text-sm font-medium ${
                            orderStatus >= 3
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Shipped
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(order.ex_factory_date), "MMM dd")}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 mb-2 flex items-center justify-center rounded-full shadow-md border-2 transition-all duration-300 z-10
            ${
              orderStatus >= 4
                ? "bg-gradient-to-r from-green-500 to-green-600 border-green-600 text-white transform scale-110"
                : "bg-white border-gray-300"
            }`}
                      >
                        {orderStatus >= 4 ? (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-center">
                        <span
                          className={`text-sm font-medium ${
                            orderStatus >= 4
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Delivered
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(order.delivery_date), "MMM dd")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Status Message */}
                {/* <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {orderStatus === 0 &&
                      "Your order has been recorded and is being processed."}
                    {orderStatus === 1 &&
                      "Your order has been received and is being prepared."}
                    {orderStatus === 2 &&
                      "Your order is confirmed and will be shipped soon."}
                    {orderStatus === 3 &&
                      "Your order is on its way to your location."}
                    {orderStatus === 4 &&
                      "Your order has been delivered. Thank you for your purchase!"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {orderStatus < 4
                      ? `Expected delivery by ${format(
                          new Date(order.delivery_date),
                          "MMMM dd, yyyy"
                        )}`
                      : `Delivered on ${format(
                          new Date(order.delivery_date),
                          "MMMM dd, yyyy"
                        )}`}
                  </p>
                </div> */}
              </div>

              {/* Order Details with QR Code */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p>
                    <strong>Buyer:</strong> {order.buyer}
                  </p>
                  <p>
                    <strong>Shipment Destination:</strong>{" "}
                    {order.shipment_destination}
                  </p>
                  <p>
                    <strong>Shipment Type:</strong> {order.shipment_type}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Confirm Date:</strong>{" "}
                    {format(new Date(order.confirm_date), "dd/MM/yyyy")}
                  </p>
                  <p>
                    <strong>Entry Date:</strong>{" "}
                    {format(new Date(order.entry_date), "dd/MM/yyyy")}
                  </p>
                  <p>
                    <strong>Ex Factory Date:</strong>{" "}
                    {format(new Date(order.ex_factory_date), "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <QRCodeSVG value={order.order_no} size={100} />
                    {/* <p className="text-sm mt-2">Scan to track</p> */}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Product</th>
                      <th className="py-3 px-6 text-left">Size</th>
                      <th className="py-3 px-6 text-center">Quantity</th>
                      <th className="py-3 px-6 text-right">Price (Per Item)</th>
                      <th className="py-3 px-6 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {order.products.map((product) =>
                      Object.entries(product.sizes2).map(
                        ([size, sizeData]) =>
                          sizeData > 0 && (
                            <tr
                              key={`${product._id}-${size}`}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="py-3 px-6 text-left whitespace-nowrap">
                                {product.styleName}
                              </td>
                              <td className="py-3 px-6 text-left">{size}</td>
                              <td className="py-3 px-6 text-center">
                                {sizeData}
                              </td>
                              <td className="py-3 px-6 text-center">
                                {product.price}
                              </td>
                              <td className="py-3 px-6 text-right">
                                ₹{(product.price * sizeData).toFixed(2)}
                              </td>
                            </tr>
                          )
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {/* Grand Total Section */}
              <div className="mt-4 text-right">
                <p className="text-xl font-bold text-gray-800">
                  Grand Total: ₹{order.grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesView;
