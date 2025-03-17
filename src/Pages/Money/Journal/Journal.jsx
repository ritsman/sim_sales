import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { v4 as uuidv4 } from "uuid";
import config from "../../../config";

const Journal = () => {
//   const { userDetails } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState("Select");
  const [name, setName] = useState([]);
  const [member, setMember] = useState([]);
  const [account, setAccount] = useState([]);
  const [date, setDate] = useState("");
  const [narration, setNarration] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const dropdownRef = useRef(null);

  const groupByTransactionsId = (transactions) => {
    const groupedTransactions = {};

    transactions.forEach((txn) => {
      const txnId = txn.transactionId;

      if (!groupedTransactions[txnId]) {
        groupedTransactions[txnId] = {
          transactionId: txnId,
          entries: [],
        };
      }

      groupedTransactions[txnId].entries.push(txn);
    });

    return Object.values(groupedTransactions);
  };

  const fetchJournals = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`${config.API_URL}/api/transaction/getPaymentLedger`),
        axios.get(`${config.API_URL}/api/transaction/getCollectionLedger`),
      ]);

      console.log(res1.data.paymentLedgers, res2.data.paymentLedgers);
      let arr = [...res1.data.paymentLedgers, ...res2.data.paymentLedgers];
      console.log(groupByTransactionsId(arr));
      setTransactions(groupByTransactionsId(arr));
    } catch (error) {
      console.error("Error fetching journal data:", error);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  // Fetch member and account data
  useEffect(() => {
    const fetchMemberList = async () => {
      try {
        const res = await axios.get(
          `${config.API_URL}/api/member/getMemberList`
        );
        const options = Array.isArray(res.data)
          ? res.data.map((item) => ({
              id: item.flatNo,
              name: item.name,
              isMember: true,
            }))
          : [];
        setMember(options);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch member list");
      }
    };

    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          `${config.API_URL}/api/master/getAccLedger`
        );
        const expenseAccounts = res.data
          // .filter((item) => item.group === "Expense")
          .map((item) => ({
            id: item.shortName,
            name: item.name,
            isMember: false,
          }));
        setAccount(expenseAccounts);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch accounts");
      }
    };

    fetchMemberList();
    fetchAccounts();
  }, []);

  // Combine member and account data
  useEffect(() => {
    setName([...account, ...member]);
  }, [account, member]);

  // Filter accounts based on search term
  const filteredNames = useMemo(() => {
    return name.filter(
      (account) =>
        account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [name, searchTerm]);

  // Handle selection
  const handleSelect = (account) => {
    setSelected(account.name);
    setId(account.id);
    setIsMember(account.isMember);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add entry to the table
  const handleAdd = () => {
    if (!selected || !transactionType || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    const newEntry = {
      id: id,
      isMember: isMember,
      name: selected,
      type: transactionType,
      amount: parseFloat(amount).toFixed(2),
      ...(transactionId && { transactionId }), // Only add if transactionId exists
    };

    // setData((prevData) => [...prevData, newEntry]);

    if (editIndex !== null) {
      // If in edit mode, update the existing entry
      const updatedData = [...data];
      updatedData[editIndex] = newEntry;
      setData(updatedData);
      setEditIndex(null);
    } else {
      setData((prevData) => [...prevData, newEntry]);
    }
    setSelected("Select");
    setTransactionType("");
    setAmount("");
  };

  function generateShortUUID(selectedDate) {
    const year = new Date(selectedDate).getFullYear().toString().slice(-2); // Get last two digits of the selected year
    const shortUUID = uuidv4().replace(/-/g, "").slice(0, 5); // Generate short UUID with 5 characters
    return `JV/${year}/${shortUUID}`;
  }

  // Submit data
  const handleSubmit = () => {
    if (data.length === 0) {
      toast.error("No entries to submit");
      return;
    }
    console.log("hjghj", data);
    let collectionLedger;
    let paymentLedger;

    const creditEntries = data.filter((entry) => entry.type === "credit");
    const debitEntries = data.filter((entry) => entry.type === "debit");

    if (!isEditing) {
      let transactionid = generateShortUUID("2025/02/07");

      collectionLedger = creditEntries.map((item, index) => {
        return {
          ...item,
          date,
          narration,
          transactionId: transactionid,
          comesFrom: index === 0 ? "" : creditEntries[0].name, // Only first collection ledger has blank 'comesFrom'
        };
      });

      let goesTo = collectionLedger[0].name; // All payments will go to the first collection ledger's name

      // Create payment ledger, linking them to the first collection ledger's 'goesTo'
      paymentLedger = debitEntries.map((item) => {
        return {
          ...item,
          date,
          narration,
          transactionId: transactionid,
          goesTo, // All payments go to the first collection ledger
        };
      });
    } else {
      collectionLedger = creditEntries.map((item, index) => {
        return {
          ...item,
          date,
          narration,
          comesFrom: index === 0 ? "" : creditEntries[0].name,
        };
      });

      let goesTo = collectionLedger[0].name;

      // Create payment ledger, linking them to the first collection ledger's 'goesTo'
      paymentLedger = debitEntries.map((item) => {
        return {
          ...item,
          date,
          narration,
          goesTo,
        };
      });
    }

    let creditAmount = collectionLedger.reduce((acc, item) => {
      return acc + Number(item.amount);
    }, 0);
    let debitAmount = paymentLedger.reduce((acc, item) => {
      return acc + Number(item.amount);
    }, 0);

    if (creditAmount != debitAmount) {
      alert("Total credit and total debit should be same");
      return;
    }

    console.log(paymentLedger, collectionLedger, "fkjg");
    setIsEditing(false);
    // Send payload to the server
    const apiRequest1 = axios.post(
      `${config.API_URL}/api/transaction/postPaymentLedger`,
      paymentLedger
    );
    const apiRequest2 = axios.post(
      `${config.API_URL}/api/transaction/postCollectionLedger`,
      collectionLedger
    );

    // Send both requests in parallel
    Promise.all([apiRequest1, apiRequest2])
      .then(() => {
        toast.success("Journal submitted successfully to both APIs");
        setData([]); // Clear the data after success
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to submit journal to one or both APIs");
      });
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // Gets the current date
    setDate(currentDate); // Set default date
  }, []);

  const handleEdit = (index) => {
    const entry = data[index];
    setSelected(entry.name);
    setId(entry.id);
    setIsMember(entry.isMember);
    setTransactionType(entry.type);
    setTransactionId(entry.transactionId);
    setAmount(entry.amount);
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleDeleteJournal = async (item) => {
    let id = item.transactionId;
    console.log(item, id);
    try {
      if (!id) {
        console.error("Transaction ID is required for deletion.");
        return;
      }

      const encodedId = encodeURIComponent(id);

      // Confirm before deleting
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this journal?"
      );
      if (!confirmDelete) return;

      // Perform both delete requests simultaneously
      console.log("hellooo");
      const [res1, res2] = await Promise.all([
        axios.post(`${config.API_URL}/api/transaction/deleteCollectionLedger`, {
          transactionId: id,
        }),
        axios.post(`${config.API_URL}/api/transaction/deletePaymentLedger`, {
          transactionId: id,
        }),
      ]);

      // Check if both deletions were successful
      if (res1.status === 200 && res2.status === 200) {
        alert("Journal deleted successfully.");
      } else {
        alert(
          "Error deleting journal. Some entries may not have been removed."
        );
      }
    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("Failed to delete journal. Please try again.");
    }
  };

  const handleEditJournal = (txn) => {
    console.log(txn, "txn");
    setIsEditing(true);
    let arr = txn.entries.map((entry) => {
      const key = entry.type === "debit" ? "goesTo" : "comesFrom";
      return {
        transactionId: txn.transactionId,
        date: entry.date,
        name: entry.name,
        amount: entry.amount,
        narration: entry.narration,
        id: entry.id,
        type: entry.type,
        isMember: entry.isMember,
        [key]: entry[key], // Dynamically assign the correct value from the entry object
      };
    });

    console.log(arr);

    setDate(arr[0].date);
    setNarration(arr[0].narration);

    const newArr = arr.map(({ date, narration, ...rest }) => rest);

    console.log(newArr);

    setData(newArr);

    const newEntry = {
      id: id,
      isMember: isMember,
      name: selected,
      type: transactionType,
      amount: parseFloat(amount).toFixed(2),
    };
  };

  useEffect(() => {
    console.log(data, "dataaa");
  }, [data]);

  return (
    <div className="flex flex-col items-center py-5">
    
        <div className="flex flex-col items-center  w-full ">
          <h1 className="text-2xl font-bold">Journal</h1>

          <div className="p-4 flex items-center gap-10">
            {/* Date Input */}
            <div>
              <label className="block text-gray-700 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Narration Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Narration
              </label>
              <input
                type="text"
                placeholder="Enter narration..."
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-10">
            {/* Dropdown for Name */}
            <div className="relative w-64" ref={dropdownRef}>
              <label className="block mb-1 text-gray-700 font-medium">
                Name
              </label>
              <div
                className="border rounded px-3 py-2 cursor-pointer bg-white flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selected}
                <span className="text-gray-500">▼</span>
              </div>

              {isOpen && (
                <div className="absolute left-0 top-12 w-full bg-white border rounded shadow-lg z-10">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border-b outline-none"
                    autoFocus
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredNames.length > 0 ? (
                      filteredNames.map((item, index) => (
                        <div
                          key={index}
                          className="p-2 text-gray-800 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelect(item)}
                        >
                          {`${item.id}-${item.name}`}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No results found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-gray-700 font-medium">Type</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="border rounded mt-1 p-2 w-full px-10"
              >
                <option value="">Select</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label
                className="block text-gray-700 font-medium"
                htmlFor="amount"
              >
                Amount:
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="border p-2 rounded-md"
              />
            </div>

            {/* Add and Submit Buttons */}
            <div>
              <button
                onClick={handleAdd}
                className="border-2 px-4 py-2 bg-gray-600 text-white rounded-md"
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className="border-2 px-4 py-2 bg-gray-600 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full px-20">
            <table className="w-full min-h-32 bg-white border border-gray-300 shadow-md mt-4 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-400 text-white">
                  <th className="border-b border-gray-300 px-6 py-3 text-left text-sm font-medium ">
                    Sr. No.
                  </th>
                  <th className="border-b border-gray-300 px-6 py-3 text-left text-sm font-medium ">
                    Name
                  </th>
                  <th className="border-b border-gray-300 px-6 py-3 text-left text-sm font-medium ">
                    Type
                  </th>
                  <th className="border-b border-gray-300 px-6 py-3 text-left text-sm font-medium ">
                    Amount
                  </th>
                  <th className="border-b border-gray-300 px-6 py-3 text-left text-sm font-medium ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-200 transition-colors duration-200`}
                  >
                    <td className="border-b border-gray-300 px-6 py-4 text-sm text-gray-800">
                      {index + 1}
                    </td>
                    <td className="border-b border-gray-300 px-6 py-4 text-sm text-gray-800">
                      {item.name}
                    </td>
                    <td className="border-b uppercase border-gray-300 px-6 py-4 text-sm text-gray-800">
                      {item.type}
                    </td>
                    <td className="border-b border-gray-300 px-6 py-4 text-sm text-gray-800">
                      {item.amount}
                    </td>
                    <td className="border-b border-gray-300 px-6 py-4 text-sm text-gray-800">
                      <button
                        className="border-2 px-4 py-2 bg-gray-600 text-white rounded-md"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="border-2 px-4 py-2 bg-gray-600 text-white rounded-md"
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
     

      {/* journal ledger rendering */}

      <div className="w-full px-20 mt-16 overflow-x-auto">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-700">
          Journal Voucher List
        </h1>
        <table className="w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-400 text-white text-left">
              <th className="p-3">Date</th>

              <th className="p-3">Transaction ID</th>
              <th className="p-3">Account Head</th>
              <th className="p-3">Total Amount</th>
             
                <th className="p-3">Action</th>
            
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => {
              // Find the first entry with comesFrom as blank
              const mainEntry = txn.entries.find((entry) => !entry.comesFrom);

              // Calculate the total debit amount
              const totalDebit = txn.entries
                .filter((entry) => entry.type === "debit")
                .reduce((sum, entry) => sum + entry.amount, 0);

              return (
                <tr
                  key={txn.transactionId}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-3 border-b">{mainEntry.date}</td>

                  <td className="p-3 border-b">{txn.transactionId}</td>
                  <td className="p-3 border-b">
                    {mainEntry ? mainEntry.name : "N/A"}
                  </td>
                  <td className="p-3 border-b  font-semibold text-black">
                    {totalDebit}
                  </td>
                  {userDetails.role == "view" ? (
                    " "
                  ) : (
                    <td className="p-3 border-b  font-semibold text-black">
                      <button
                        className="border-2 px-4 py-2 bg-gray-600 text-white rounded-md"
                        onClick={() => handleEditJournal(txn)}
                      >
                        Edit
                      </button>
                      <button
                        className="border-2 px-4 py-2 bg-gray-600 text-white rounded-md"
                        onClick={() => handleDeleteJournal(txn)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Journal;
