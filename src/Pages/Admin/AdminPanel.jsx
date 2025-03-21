// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 const availablePages = [
   { name: "dashboard", children: [] },
   {
     name: "Scheduler",
     children: [{
        name:"Scheduler",path:"/scheduler"
     }],
   },
   {
     name: "sales",
     children: [{
        name:"Sales",path:"/sales"
     },{
        name:"Sales View",path:"/sales/salesView"
     }],
   },
   {
     name: "inventory",
     children: [{
        name:"Item Inventory",path:"/inventory/itemInventory"
     }],
   },
  
 ];


  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin"); // Redirect to login if no token
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/superAdmin/users`,{
      headers: {
           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
     });

      console.log(response)

    //   if (!response.ok) {
    //     // If unauthorized, redirect to login
    //     if (response.status === 401) {
    //       localStorage.removeItem("adminToken");
    //       navigate("/admin");
    //       return;
    //     }
    //     throw new Error("Failed to fetch users");
    //   }

     const data = response.data
    let a= data.users.filter((user)=>user.email != "admin@gmail.com")
      setUsers(a);
    } catch (error) {
     console.log(error);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedPages(user.allowedPages || []);
  };

  function handlePageSelection(event, pageName) {
    if (event.target.checked) {
      setSelectedPages([...selectedPages, pageName]);
    } else {
      setSelectedPages(selectedPages.filter((p) => p !== pageName));
    }
  }

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `${config.API_URL}/api/superAdmin/approve-user/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            approved: true,
            allowedPages: selectedPages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
    setSelectedUser(null);
    setSelectedPages([])
      fetchUsers();

      alert("User access updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user access");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl border mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid border grid-cols-1  gap-8">
          <div className="">
            <div className="bg-white shadow-md rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Manage Users
                </h2>
              </div>

              <div className="overflow-x-auto">
                {users.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No users found
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.approved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.approved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleUserSelect(user)}
                              className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                            >
                              Manage Access
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {selectedUser && (
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Manage Access for {selectedUser.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Email: {selectedUser.email}
                  </p>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Select accessible pages:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {availablePages.map((page) => (
                      <div key={page.name} className="mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`page-${page.name}`}
                            checked={selectedPages.includes(page.name)}
                            onChange={(e) => handlePageSelection(e, page.name)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`page-${page.name}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {page.name}
                          </label>
                        </div>
                        {page.children.length > 0 && (
                          <div className="ml-6 border-l pl-4 mt-2">
                            {page.children.map((child) => (
                              <div
                                key={child.path}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  id={`page-${child.path}`}
                                  checked={selectedPages.includes(child.path)}
                                  onChange={(e) =>
                                    handlePageSelection(e, child.path)
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`page-${child.path}`}
                                  className="ml-2 text-sm text-gray-600"
                                >
                                  {child.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 border-t border-gray-200 pt-5">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateUser}
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
