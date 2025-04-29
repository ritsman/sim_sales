import { useState, useEffect } from "react";
import { FileText, Printer, Save, ArrowLeft, AlertCircle } from "lucide-react";
import axios from "axios";
import config from "../../../config";

// API base URL - adjust based on your environment
const API_URL = "http://localhost:5000/api";

const PurchaseOrderEdit = ({ id, onBack }) => {
  const [formData, setFormData] = useState({
    poNumber: "",
    date: "",
    party: "",
    partyLocation: "",
    deliveryDate: "",
    paymentTerms: "Net 30",
    items: [],
    notes: "",
    subtotal: 0,
    tax: 0,
    total: 0,
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [partyLocations, setPartyLocations] = useState([]);
  const [originalStatus, setOriginalStatus] = useState("");

  // Load data on component mount
  useEffect(() => {
    fetchPurchaseOrder();
    fetchVendors();
  }, [id]);

  //   When vendor changes, fetch locations
  useEffect(() => {
    if (formData.party) {
      fetchVendorLocations(formData.party);
    } else {
      setLocations([]);
    }
  }, [formData.party]);

  // Calculate totals when items change
  useEffect(() => {
    calculateTotals();
  }, [formData.items]);

  const fetchPurchaseOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.API_URL}/api/material/getPurchaseOrder/${id}`
      );
      const poData = response.data[0];
      console.log(poData.partyLocation, "po Data");

      setFormData({
        ...poData,
        // Format dates for input fields
        date: new Date(poData.date).toISOString().split("T")[0],
        deliveryDate: new Date(poData.deliveryDate).toISOString().split("T")[0],
        // Ensure IDs are strings for select fields
        // vendor: poData.party,
        // vendorLocation:poData.partyLocation,
      });

      setOriginalStatus(poData.status);
      setLoading(false);
    } catch (err) {
      setError("Failed to load purchase order");
      setLoading(false);
      console.error(err);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/master/getParty`);
      setVendors(response.data);
    } catch (err) {
      setError("Failed to load vendors");
      console.error(err);
    }
  };

  const fetchVendorLocations = async (vendorId) => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/master/getLocations`
      );
      setPartyLocations(response.data);
    } catch (err) {
      setError("Failed to load vendor locations");
      console.error(err);
    }
  };

  useEffect(() => {
    if (formData.party) {
      console.log(formData.party);
      let location = partyLocations.filter(
        (item) => item.partyId == formData.party._id
      );
      console.log(location[0]?.locations, partyLocations);
      setLocations(location[0]?.locations || []);
      setFormData((prev) => ({ ...prev, partyLocation: "" }));
    }
  }, [formData.party]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "party") {
      const selectedParty = vendors.find((p) => p.companyName === value);
      setFormData((prev) => ({
        ...prev,
        party: selectedParty || "",
        partyLocation: "", // reset party location if party changes
      }));
    } else if (name === "partyLocation") {
      const selectedLocation = locations.find((l) => l.locationName === value);
      console.log(selectedLocation);
      setFormData((prev) => ({
        ...prev,
        partyLocation: selectedLocation || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Calculate amount for this item
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unitPrice;
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newId =
      formData.items.length > 0
        ? Math.max(...formData.items.map((item) => item.id || 0)) + 1
        : 1;

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: newId, description: "", quantity: 1, unitPrice: 0, amount: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const tax = subtotal * 0.07; // Assuming 7% tax
    const total = subtotal + tax;

    setFormData((prev) => ({ ...prev, subtotal, tax, total }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      // Make sure all required fields are filled
      if (
        !formData.vendor ||
        !formData.vendorLocation ||
        !formData.deliveryDate
      ) {
        setError("Please fill all required fields");
        setSaving(false);
        return;
      }

      // Make sure all items have descriptions
      if (formData.items.some((item) => !item.description)) {
        setError("All items must have descriptions");
        setSaving(false);
        return;
      }

      // If this is a draft, allow changing status to submitted
      let updatedStatus = formData.status;
      if (originalStatus === "Draft" && formData.status === "Draft") {
        updatedStatus = "Submitted";
      }

      // Prepare data for API
      const purchaseOrderData = {
        ...formData,
        status: updatedStatus,
      };

      // Send to API
      await axios.patch(`${API_URL}/purchase-orders/${id}`, purchaseOrderData);

      setSuccess("Purchase order updated successfully!");
      setSaving(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        if (onBack) onBack(); // Return to list view
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update purchase order"
      );
      setSaving(false);
      console.error(err);
    }
  };

  const generatePDF = () => {
    window.open(`${API_URL}/purchase-orders/${id}/pdf`, "_blank");
  };

  // Can only edit if in draft status
  const isEditable = originalStatus === "Draft";

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-500">Loading purchase order...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
      {error && (
        <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <button
            className="ml-auto text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {!isEditable && (
        <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded mb-4">
          This purchase order is no longer in draft status and cannot be edited.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              type="button"
              onClick={onBack}
              className="mr-3 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Purchase Order
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={generatePDF}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate PDF
            </button>
            <button
              type="button"
              className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </button>
            <button
              type="submit"
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={saving || !isEditable}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Header Information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                PO Number
              </label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditable ? "bg-gray-100" : ""
                }`}
                required
                readOnly={!isEditable}
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
                value={formData.party.companyName}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditable ? "bg-gray-100" : ""
                }`}
                required
                disabled={!isEditable}
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor.companyName}>
                    {vendor.companyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              {console.log(formData.partyLocation)}
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Location
              </label>
              <select
                name="partyLocation"
                value={formData.partyLocation.locationName}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditable ? "bg-gray-100" : ""
                }`}
                required
                // disabled={!isEditable || !formData.vendor}
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

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditable ? "bg-gray-100" : ""
                }`}
                required
                readOnly={!isEditable}
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditable ? "bg-gray-100" : ""
                }`}
                disabled={!isEditable}
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">Line Items</h2>
            {isEditable && (
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Add Item
              </button>
            )}
          </div>

          <div className="border rounded overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-right">Unit Price</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  {isEditable && (
                    <th className="py-3 px-6 text-center">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {formData.items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">{index + 1}</td>
                    <td className="py-3 px-6 text-left">
                      {isEditable ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded"
                          required
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {isEditable ? (
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="w-20 p-1 border rounded text-center"
                          required
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      {isEditable ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unitPrice",
                              Number(e.target.value)
                            )
                          }
                          className="w-24 p-1 border rounded text-right"
                          required
                        />
                      ) : (
                        `$${item.unitPrice.toFixed(2)}`
                      )}
                    </td>
                    <td className="py-3 px-6 text-right font-medium">
                      {(item.amount || 0).toFixed(2)}
                    </td>
                    {isEditable && (
                      <td className="py-3 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={formData.items.length <= 1}
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 font-semibold text-gray-800">
                  <td
                    colSpan={isEditable ? "4" : "3"}
                    className="py-3 px-6 text-right"
                  >
                    Subtotal:
                  </td>
                  <td className="py-3 px-6 text-right">
                    {formData.subtotal.toFixed(2)}
                  </td>
                  {isEditable && <td></td>}
                </tr>
                <tr className="border-t border-gray-200 font-semibold text-gray-800">
                  <td
                    colSpan={isEditable ? "4" : "3"}
                    className="py-3 px-6 text-right"
                  >
                    Tax (7%):
                  </td>
                  <td className="py-3 px-6 text-right">
                    {formData.tax.toFixed(2)}
                  </td>
                  {isEditable && <td></td>}
                </tr>
                <tr className="border-t border-gray-200 font-bold text-gray-800">
                  <td
                    colSpan={isEditable ? "4" : "3"}
                    className="py-3 px-6 text-right"
                  >
                    Total:
                  </td>
                  <td className="py-3 px-6 text-right">
                    {formData.total.toFixed(2)}
                  </td>
                  {isEditable && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              !isEditable ? "bg-gray-100" : ""
            }`}
            rows="4"
            readOnly={!isEditable}
          ></textarea>
        </div>

        {/* Status field - only shown if editable */}
        {isEditable && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={formData.status === "Draft"}
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Keep as Draft</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Submitted"
                  checked={formData.status === "Submitted"}
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-green-600"
                />
                <span className="ml-2">Submit for Approval</span>
              </label>
            </div>
          </div>
        )}

        {/* Form Buttons */}
        {isEditable && (
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Purchase Order"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PurchaseOrderEdit;
