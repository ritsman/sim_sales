import { useState, useEffect } from "react";
import { FileText, Printer, Save } from "lucide-react";
import axios from "axios";
import config from "../../../config";
import { toast } from "react-toastify";

const GRN = () => {
  const TAX_RATE = 0.07; // 7% tax rate
  const [formData, setFormData] = useState({
    grnNumber: generateGRNNumber(),
    type: "product", // Default to product
    category: "fresh", // Default to fresh
    purchaseOrderId: "",
    gsnNumber: "", // Added GSN number field
    date: new Date().toISOString().split("T")[0],
    party: "",
    partyLocation: "",
    deliveryDate: "",
    items: [
      {
        id: 1,
        description: "",
        quantity: 1,
        unitPrice: 0,
        tax: 0,
        amount: 0,
        size: "",
      },
    ],

    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const [parties, setParties] = useState([]);
  const [partyLocations, setPartyLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [companyProfile, setCompanyProfile] = useState({});
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [gsnData, setGsnData] = useState([]); // Added state for GSN data
  const [availableSizes, setAvailableSizes] = useState({}); // Store available sizes for each product

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        partyRes,
        locationRes,
        itemRes,
        productRes,
        profileRes,
        poRes,
        gsnRes,
      ] = await Promise.all([
        axios.get(`${config.API_URL}/api/master/getParty`),
        axios.get(`${config.API_URL}/api/master/getLocations`),
        axios.get(`${config.API_URL}/api/master/getItems`), // For inventory items
        axios.get(`${config.API_URL}/api/master/getProduct`), // For products
        axios.get(`${config.API_URL}/api/profile/getProfile`),
        axios.get(`${config.API_URL}/api/material/getPurchaseOrder`),
        axios.get(`${config.API_URL}/api/material/getGSN`), // Fetch GSN data
      ]);

      setParties(partyRes.data);
      setPartyLocations(locationRes.data);
      setInventoryItems(itemRes.data);
      setProducts(productRes.data);
      setCompanyProfile(profileRes.data);
      setPurchaseOrders(poRes.data);
      setGsnData(gsnRes.data);

      // Set initial items based on default type (product)
      setItems(productRes.data);

      // Create a mapping of product IDs to their available sizes
      const sizesMap = {};
      productRes.data.forEach((product) => {
        if (
          product.size &&
          product.size.sizes &&
          Array.isArray(product.size.sizes)
        ) {
          sizesMap[product._id] = product.size.sizes;
        } else {
          sizesMap[product._id] = [];
        }
      });
      setAvailableSizes(sizesMap);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (formData.party) {
      let location = partyLocations.filter(
        (item) => item.partyId == formData.party._id
      );
      setLocations(location[0]?.locations || []);
      setFormData((prev) => ({ ...prev, partyLocation: "" }));
    }
  }, [formData.party]);

  // Update items list when type changes
  useEffect(() => {
    // Clear selected items when type changes
    setFormData((prev) => ({
      ...prev,
      items: [
        {
          id: 1,
          description: "",
          quantity: 1,
          unitPrice: 0,
          tax: 0,
          amount: 0,
          size: "",
        },
      ],
    }));

    // Set appropriate items list based on type
    if (formData.type === "product") {
      setItems(products);
    } else if (formData.type === "item") {
      setItems(inventoryItems);
    }
  }, [formData.type, products, inventoryItems]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items]);

  function generateGRNNumber() {
    return `GRN-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "party") {
      const selectedParty = parties.find((p) => p.companyName === value);
      setFormData((prev) => ({
        ...prev,
        party: selectedParty || "",
        partyLocation: "", // reset party location if party changes
      }));
    } else if (name === "partyLocation") {
      const selectedLocation = locations.find((l) => l.locationName === value);
      setFormData((prev) => ({
        ...prev,
        partyLocation: selectedLocation || "",
      }));
    } else if (name === "purchaseOrderId" && value) {
      // Handle purchase order selection and prefill data
      const selectedPO = purchaseOrders.find((po) => po._id === value);
      if (selectedPO) {
        setFormData((prev) => ({
          ...prev,
          purchaseOrderId: value,
          party: selectedPO.party,
          partyLocation: selectedPO.partyLocation,
          deliveryDate: selectedPO.deliveryDate,
          items: selectedPO.items,
          subtotal: selectedPO.subtotal,
          tax: selectedPO.tax,
          total: selectedPO.total,
        }));
      }
    } else if (name === "gsnNumber" && value) {
      // Handle GSN selection and prefill data
      const selectedGSN = gsnData.find((gsn) => gsn._id === value);
      if (selectedGSN) {
        setFormData((prev) => ({
          ...prev,
          gsnNumber: value,
          party: selectedGSN.party,
          partyLocation: selectedGSN.partyLocation,
          deliveryDate: selectedGSN.deliveryDate,
          items: selectedGSN.items,
          subtotal: selectedGSN.subtotal,
          tax: selectedGSN.tax,
          total: selectedGSN.total,
        }));
      }
    } else if (name === "category") {
      // Reset related fields when category changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        purchaseOrderId: "",
        gsnNumber: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Recalculate values for this item
    if (field === "quantity" || field === "unitPrice") {
      const quantity = newItems[index].quantity;
      const unitPrice = newItems[index].unitPrice;
      const subtotal = quantity * unitPrice;
      const tax = subtotal * TAX_RATE;

      newItems[index].tax = tax;
      newItems[index].amount = subtotal + tax; // Amount includes tax
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newId =
      formData.items.length > 0
        ? Math.max(...formData.items.map((item) => item.id)) + 1
        : 1;

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          description: "",
          quantity: 1,
          unitPrice: 0,
          tax: 0,
          amount: 0,
          size: "",
        },
      ],
    }));
  };

  // Handle item selection from dropdown
  const handleItemSelect = (index, itemId) => {
    const selectedItem = items.find((item) => item._id === itemId);
    if (selectedItem) {
      const newItems = [...formData.items];
      const quantity = newItems[index].quantity || 1;

      // Field names might differ between products and items
      const itemName = selectedItem.styleName || selectedItem.itemName || "";
      const unitPrice = selectedItem.rate || selectedItem.price || 0;
      const subtotal = quantity * unitPrice;
      const tax = subtotal * TAX_RATE;

      newItems[index] = {
        ...newItems[index],
        itemId: selectedItem._id,
        description: selectedItem.description || itemName,
        unitPrice: unitPrice,
        quantity: quantity,
        tax: tax,
        amount: subtotal + tax, // amount includes tax
        size: "",
      };

      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  // Handle size selection
  const handleSizeSelect = (index, size) => {
    const newItems = [...formData.items];
    newItems[index].size = size;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const calculateTotals = () => {
    // Calculate item-based sums
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const tax = formData.items.reduce((sum, item) => {
      return sum + item.tax;
    }, 0);

    const total = subtotal + tax;

    setFormData((prev) => ({ ...prev, subtotal, tax, total }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      let res = await axios.post(
        `${config.API_URL}/api/material/createGRN`,
        formData
      );
      console.log(res);
      toast.success("Successfully saved GRN");
      setFormData({
        grnNumber: generateGRNNumber(),
        type: "product",
        category: "fresh",
        purchaseOrderId: "",
        gsnNumber: "",
        date: new Date().toISOString().split("T")[0],
        party: "",
        partyLocation: "",
        deliveryDate: "",
        items: [
          {
            id: 1,
            description: "",
            quantity: 1,
            unitPrice: 0,
            tax: 0,
            amount: 0,
            size: "",
          },
        ],
        notes: "",
        subtotal: 0,
        tax: 0,
        total: 0,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error in saving GRN");
    }
  };

  // Function to render either Purchase Order or GSN Number dropdown based on category
  const renderOrderDropdown = () => {
    if (formData.category === "purchase_order") {
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Purchase Order
          </label>
          <select
            name="purchaseOrderId"
            value={formData.purchaseOrderId}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Purchase Order</option>
            {purchaseOrders.map((po) => (
              <option key={po._id} value={po._id}>
                {po.poNumber || po.grnNumber}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (formData.category === "transfer") {
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            GSN Number
          </label>
          <select
            name="gsnNumber"
            value={formData.gsnNumber}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select GSN Number</option>
            {gsnData.map((gsn) => (
              <option key={gsn._id} value={gsn._id}>
                {gsn.gsnNumber}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      // For "fresh" category, return an empty div to maintain layout
      return <div className="mb-4"></div>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Goods Receipt Notes
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleSubmit}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save GRN
          </button>
        </div>
      </div>

      {/* Header Information with new inputs */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              GRN Number
            </label>
            <input
              type="text"
              name="grnNumber"
              value={formData.grnNumber}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="product">Product</option>
              <option value="item">Item</option>
            </select>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="fresh">Fresh</option>
              <option value="transfer">Transfer</option>
              <option value="purchase_order">Purchase Order</option>
            </select>
          </div>
          {renderOrderDropdown()}
        </div>
      </div>

      {/* Date & Party Information */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Delivery Date
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Vendor
            </label>
            <select
              name="party"
              value={formData.party?.companyName || ""}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Vendor</option>
              {parties.map((party) => (
                <option key={party._id} value={party.companyName}>
                  {party.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Vendor Location
            </label>
            <select
              name="partyLocation"
              value={formData.partyLocation?.locationName || ""}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={!formData.party}
              required
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location._id} value={location.locationName}>
                  {location.locationName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {formData.type === "product" ? "Products" : "Items"}
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-gray-600">#</th>
                <th className="px-4 py-2 text-gray-600 w-2/5">
                  {formData.type === "product" ? "Product" : "Item"}
                </th>
                {formData.type === "product" && (
                  <th className="px-4 py-2 text-gray-600">Size</th>
                )}
                <th className="px-4 py-2 text-gray-600">Quantity</th>
                <th className="px-4 py-2 text-gray-600">Unit Price</th>
                <th className="px-4 py-2 text-gray-600">Tax (7%)</th>
                <th className="px-4 py-2 text-gray-600">Amount</th>
                <th className="px-4 py-2 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <select
                      value={item.itemId || ""}
                      onChange={(e) => handleItemSelect(index, e.target.value)}
                      className="w-full p-1 border rounded"
                      required
                    >
                      <option value="">
                        Select{" "}
                        {formData.type === "product" ? "Product" : "Item"}
                      </option>
                      {items.map((invItem) => (
                        <option key={invItem._id} value={invItem._id}>
                          {formData.type === "product"
                            ? invItem.styleName || invItem.itemName
                            : invItem.itemName || invItem.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  {formData.type === "product" && (
                    <td className="px-4 py-2">
                      <select
                        value={item.size || ""}
                        onChange={(e) =>
                          handleSizeSelect(index, e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        disabled={!item.itemId}
                        required={formData.type === "product"}
                      >
                        <option value="">Select Size</option>
                        {item.itemId &&
                          availableSizes[item.itemId] &&
                          availableSizes[item.itemId].map((size, idx) => (
                            <option key={idx} value={size}>
                              {size}
                            </option>
                          ))}
                      </select>
                    </td>
                  )}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 p-1 border rounded"
                      min="1"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">{item.unitPrice}</td>
                  <td className="px-4 py-2">{item.tax.toFixed(2)}</td>
                  <td className="px-4 py-2">{item.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={formData.items.length === 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={addItem}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded"
          >
            Add {formData.type === "product" ? "Product" : "Item"}
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Subtotal:</span>
            <span>{formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Tax (7%):</span>
            <span>{formData.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total:</span>
            <span>{formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          Submit GRN
        </button>
      </div>
    </div>
  );
};

export default GRN;
