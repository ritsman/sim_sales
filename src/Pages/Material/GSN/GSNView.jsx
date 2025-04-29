import { useState, useEffect } from "react";
import { Edit, Trash2, Eye, FileText, AlertCircle } from "lucide-react";
import axios from "axios";
import config from "../../../config";
import { NavLink } from "react-router-dom";
import { generatePDF } from "../PurchaseOrder/PurchaseOrderPdf";

const GSNView = () => {
  const [GSN, setGSN] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poToDelete, setPoToDelete] = useState(null);
  const [companyProfile, setComapnyProfile] = useState({});

  // Fetch all purchase orders on component mount
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/material/getGSN`);
      const profileRes = await axios.get(
        `${config.API_URL}/api/profile/getProfile`
      );
      setComapnyProfile(profileRes.data);
      setGSN(response.data);

      setLoading(false);
    } catch (err) {
      setError("Failed to load purchase orders");
      setLoading(false);
      console.error(err);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setLoading(true);
      let data = GSN.find((item) => item._id == id);
      setSelectedPO(data);
      setIsModalOpen(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to load purchase order details");
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    // Redirect to the edit page
    window.location.href = `/material/edit-gsn/${id}`;
  };

  const confirmDelete = (po) => {
    setPoToDelete(po);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!poToDelete) return;

    try {
      setLoading(true);
      await axios.delete(
        `${config.API_URL}/api/material/deleteGSN/${poToDelete._id}`
      );

      // Remove from state
      setGSN(GSN.filter((po) => po._id !== poToDelete._id));

      setSuccess(`Purchase order ${poToDelete.poNumber} deleted successfully`);
      setIsDeleteModalOpen(false);
      setPoToDelete(null);
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete purchase order"
      );
      setIsDeleteModalOpen(false);
      setLoading(false);
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-200 text-gray-800";
      case "Submitted":
        return "bg-blue-200 text-blue-800";
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      case "Completed":
        return "bg-purple-200 text-purple-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPO(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Goods Sending Notes
        </h1>
        <NavLink to="/material/gsn">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create New
          </button>
        </NavLink>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>{error}</span>
          <button className="ml-auto" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <span>{success}</span>
          <button className="ml-auto" onClick={() => setSuccess(null)}>
            ×
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Purchase Orders Table */}
      {!loading && GSN.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No GSN found</p>
          <button
            onClick={() => (window.location.href = "/material/gsn")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First GSN
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                  GSN Number
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                  Vendor
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                  Total
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {GSN.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{item.gsnNumber}</td>
                  <td className="py-3 px-4 border-b">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {item.party?.companyName || "Unknown"}
                  </td>
                  <td className="py-3 px-4 border-b">{item.total}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(item._id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          generatePDF(
                            item,
                            companyProfile,
                            "GOODS AND SENDING NOTES",
                            "GSN"
                          )
                        }
                        className="text-green-600 hover:text-green-800"
                        title="Generate PDF"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(item)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedPO && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center pt-28 justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">GSN Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 text-4xl hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">GSN Number</p>
                <p className="font-medium">{selectedPO.gsnNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(selectedPO.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium">
                  {selectedPO.party?.companyName || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {selectedPO.partyLocation?.locationName || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="font-medium">
                  {formatDate(selectedPO.deliveryDate)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">Items</h3>
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                      #
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                      Description
                    </th>
                    {/* Add Size column */}
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                      Size
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                      Qty
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                      Unit Price
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPO.items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">
                        {item.description || item.styleName}
                      </td>
                      {/* Display size if item type is product */}
                      <td className="py-2 px-4 border-b">
                        {selectedPO.type === "product"
                          ? item.size || "N/A"
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">{item.quantity}</td>
                      <td className="py-2 px-4 border-b">
                        {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan="5"
                      className="py-2 px-4 text-right font-medium"
                    >
                      Subtotal:
                    </td>
                    <td className="py-2 px-4">
                      {selectedPO.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="5"
                      className="py-2 px-4 text-right font-medium"
                    >
                      Tax (7%):
                    </td>
                    <td className="py-2 px-4">{selectedPO.tax}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="py-2 px-4 text-right font-bold">
                      Total:
                    </td>
                    <td className="py-2 px-4 font-bold">{selectedPO.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {selectedPO.notes && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Notes</h3>
                <p className="p-3 bg-gray-50 rounded">{selectedPO.notes}</p>
              </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() =>
                  generatePDF(
                    selectedPO,
                    companyProfile,
                    "GOODS AND SENDING NOTES",
                    "GSN"
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate PDF
              </button>

              <button
                onClick={() => {
                  closeModal();
                  handleEdit(selectedPO._id);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && poToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Confirm Delete</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <p>
                Are you sure you want to delete GSN{" "}
                <strong>{poToDelete.gsnNumber}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GSNView;
