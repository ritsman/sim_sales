// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config";

// const AddGroup = () => {
//   const [groupName, setGroupName] = useState("");
//   const [groupType, setGroupType] = useState("");
//   const [groupItems, setGroupItems] = useState([""]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state) {
//       setGroupName(location.state.groupName);
//       setGroupType(location.state.groupType);
//       setGroupItems(location.state.groupItems);
//     }
//   }, [location.state]);

//   const handleAddItem = () => {
//     setGroupItems([...groupItems, ""]);
//   };

//   const handleItemChange = (index, value) => {
//     const updatedItems = [...groupItems];
//     updatedItems[index] = value;
//     setGroupItems(updatedItems);
//   };

//   const handleRemoveItem = (index) => {
//     const updatedItems = groupItems.filter((_, i) => i !== index);
//     setGroupItems(updatedItems);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (location.state?.id) {
//         await axios.put(
//           `${config.API_URL}/api/master/updateGroup/${location.state.id}`,
//           {
//             groupName,
//             groupType,
//             groupItems,
//           }
//         );
//         alert("Group updated successfully!");
//       } else {
//         await axios.post(`${config.API_URL}/api/master/createGroup`, {
//           groupName,
//           groupType,
//           groupItems,
//         });
//         alert("Group added successfully!");
//       }
//       navigate(-1);
//     } catch (error) {
//       console.error("Error saving group:", error);
//       alert("Failed to save group!");
//     }
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-bold mb-4">
//         {location.state?.id ? "Edit Group" : "Add Group"}
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="block text-sm font-medium">Group Name</label>
//           <input
//             type="text"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="block text-sm font-medium">Group Type</label>
//           <input
//             type="text"
//             value={groupType}
//             onChange={(e) => setGroupType(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="block text-sm font-medium">Group Items</label>
//           {groupItems.map((item, index) => (
//             <div key={index} className="flex items-center mb-2">
//               <input
//                 type="text"
//                 value={item}
//                 onChange={(e) => handleItemChange(index, e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => handleRemoveItem(index)}
//                 className="px-2 ml-2 py-1 bg-gray-200 text-white rounded hover:bg-gray-600"
//               >
//                 ❌
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={handleAddItem}
//             className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//           >
//             + Add Item
//           </button>
//         </div>

//         <div className="mt-6 flex justify-between">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//           >
//             Back
//           </button>

//           <button
//             type="submit"
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//           >
//             {location.state?.id ? "Update" : "Submit"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddGroup;

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import Autocomplete from "../../../Components/Autocomplete";
import { toast } from "react-toastify";

const AddGroup = () => {
  const options = ["group1", "group2"];
  const options2 = [
    { _id: 1, code: "A1000", groupName: "group1", under: "Primary" },
    { _id: 2, code: "B1000", groupName: "group2", under: "Primary" },
  ];
  const [groups, setgroups] = useState([]);
  const [unders, setUnders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getGroup`
        );

        console.log(response.data);
        // setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get(`${config.API_URL}/api/master/getGroup`);
        let a = res.data.map((item) => item.groupName);

        setUnders([...options, ...a]);
        console.log(a);
        setgroups(res.data);

        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  const generateCode = (under) => {
    let underOption = options2.find((opt) => opt.groupName === under);
    if (!underOption) {
      underOption = groups.find((opt) => opt.groupName === under);
    }
    console.log(underOption, "underoptions");

    const prefix = underOption.code.charAt(0);

    let similarCodes = options2
      .filter((opt) => opt.code.startsWith(prefix))
      .map((opt) => opt.code);

    const arr = groups
      .filter((opt) => opt.code.startsWith(prefix))
      .map((opt) => opt.code);

    similarCodes = [...similarCodes, ...arr];

    if (similarCodes.length === 0) {
      return `${prefix}1001`;
    } else {
      const maxCode = similarCodes.reduce((max, code) => {
        const num = parseInt(code.slice(1));
        return num > max ? num : max;
      }, 0);
      return `${prefix}${(maxCode + 1).toString().padStart(3, "0")}`;
    }
  };

  const [groupName, setGroupName] = useState("");

  const handleChange = (e) => {
    setGroupName(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(generateCode(selectedValue), "code");

    try {
      let result = await axios.post(
        `${config.API_URL}/api/master/createGroup`,
        {
          code: generateCode(selectedValue),
          groupName: groupName,
          under: selectedValue,
        }
      );
      console.log(result);
      toast.success("New Group Added Successfully");
    } catch (error) {
      console.log(error);
      toast.error("something wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-y-auto"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-center text-2xl font-bold mb-8">ADD GROUP</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group Name Field */}
            <div className="mb-4">
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                value={groupName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Under Field with Autocomplete */}
            <div className="mb-4">
              <label
                htmlFor="under"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Under
              </label>
              <Autocomplete
                options={unders}
                onSelect={(value) => handleSelect(value)}
              />
            </div>

            {/* Buttons */}
            <div className="col-span-full flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
              <button
                onClick={() => navigate(-1)}
                type="button" // Changed to type="button" to prevent form submission
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
