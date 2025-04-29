import { useState, useEffect } from "react";
import { FileText, Printer, Save } from "lucide-react";
import axios from "axios";
import config from "../../../config";
import { toast } from "react-toastify";

const GSN = () => {
  const TAX_RATE = 0.07; // 7% tax rate
  const [formData, setFormData] = useState({
    gsnNumber: generateGSNNumber(),
    type: "product", // Default to product
    category: "sell", // Default to fresh
    salesOrder: "",
    date: new Date().toISOString().split("T")[0],
    party: "",
    partyLocation: "",
    deliveryDate: "",
    items: [
      { id: 1, description: "", quantity: 1, unitPrice: 0, tax: 0, amount: 0 },
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
  const [salesorder, setSalesOrder] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [partyRes, locationRes, itemRes, productRes, profileRes, poRes] =
        await Promise.all([
          axios.get(`${config.API_URL}/api/master/getParty`),
          axios.get(`${config.API_URL}/api/master/getLocations`),
          axios.get(`${config.API_URL}/api/master/getItems`), // For inventory items
          axios.get(`${config.API_URL}/api/master/getProduct`), // For products
          axios.get(`${config.API_URL}/api/profile/getProfile`),
          axios.get(`${config.API_URL}/api/shipment/getDispatched`),
        ]);

      setParties(partyRes.data);
      setPartyLocations(locationRes.data);
      setInventoryItems(itemRes.data);
      setProducts(productRes.data);
      setCompanyProfile(profileRes.data);
      setSalesOrder(poRes.data);

      // Set initial items based on default type (product)
      setItems(productRes.data);
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

  function generateGSNNumber() {
    return `GSN-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, "handle input");

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
    } else if (name === "salesOrder" && value) {
      console.log("inside sales order");
      // Handle purchase order selection and prefill data
      const selectedPO = salesorder.find((po) => po.order_no === value);
      console.log(selectedPO);
      if (selectedPO) {
        setFormData((prev) => ({
          ...prev,
          salesOrder: value,
          party: selectedPO.party,
          partyLocation: selectedPO.partyLocation,
          deliveryDate: selectedPO.deliveryDate,
          items: selectedPO.products || selectedPO.items,
          subtotal: selectedPO.subtotal,
          tax: selectedPO.tax,
          total: selectedPO.total,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
      const itemName = selectedItem.productName || selectedItem.itemName || "";
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
        `${config.API_URL}/api/material/createGSN`,
        formData
      );
      console.log(res);
      toast.success("Successfully saved GSN");
      setFormData({
        gsnNumber: generateGSNNumber(),
        type: "product",
        category: "fresh",
        purchaseOrderId: "",
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
          },
        ],
        notes: "",
        subtotal: 0,
        tax: 0,
        total: 0,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error in saving GSN");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Goods Sending Notes
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleSubmit}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save GSN
          </button>
        </div>
      </div>

      {/* Header Information with new inputs */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              GSN Number
            </label>
            <input
              type="text"
              name="gsnNumber"
              value={formData.gsnNumber}
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
              <option value="sell">Sell</option>
              <option value="shipment">Shipment</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sales Order Number
            </label>
            <select
              name="salesOrder"
              value={formData.salesOrder}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={formData.category !== "shipment"}
            >
              <option value="">Select sales Order</option>
              {salesorder.map((po) => (
                <option key={po._id} value={po._id}>
                  {po.order_no || po.poNumber}
                </option>
              ))}
            </select>
          </div>
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
                      value={item.itemId || item.productId}
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
                  <td className="px-4 py-2">{item.tax}</td>
                  <td className="px-4 py-2">{item.amount}</td>
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
            <span>{formData.subtotal}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Tax (7%):</span>
            <span>{formData.tax}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total:</span>
            <span>{formData.total}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {/* <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
          placeholder="Additional notes or special instructions..."
        ></textarea>
      </div> */}

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

export default GSN;
