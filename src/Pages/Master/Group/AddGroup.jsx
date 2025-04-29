import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";
import { useNavigate, useLocation } from "react-router-dom";

const GroupComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editGroup = location.state?.editGroup || null;

  const [groups, setGroups] = useState([]);
  const [typeOptions] = useState([
    "product",
    "activity",
    "item",
    "size",
    "process",
  ]);
  const [form, setForm] = useState({
    name: "",
    type: "product",
    subgroup: "product",
  });

  const fetchGroups = async () => {
    const res = await axios.get(`${config.API_URL}/api/master/getGroup/`);
    setGroups(res.data);
  };

  useEffect(() => {
    fetchGroups();
      console.log(editGroup,"edit group")
    if (editGroup) {
      setForm({
        name: editGroup.name,
        type: editGroup.type,
        subgroup: editGroup.subgroup,
      });
    }
  }, [editGroup]);

  const getSubgroupOptions = (type) => {
    const filtered = groups.filter(
      (g) => g.type === type && g._id !== editGroup?._id
    );
    const existing = filtered.map((g) => g.name);
    return [`${type}`, ...existing];
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Group name is required.");
      return;
    }

    try {
      if (editGroup?._id) {
        await axios.put(
          `${config.API_URL}/api/master/updateGroup/${editGroup._id}`,
          form
        );
      } else {
        await axios.post(`${config.API_URL}/api/master/createGroup/`, form);
      }

      navigate(-1);
    } catch (err) {
      console.error("Error saving group:", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 border rounded-xl shadow">
      <h2 className="text-xl font-semibold">
        {editGroup ? "Edit Group" : "Create Group"}
      </h2>

      <div>
        <label className="block text-sm font-medium">Group Name</label>
        <input
          type="text"
          className="mt-1 w-full border px-2 py-1 rounded"
          placeholder="Enter group name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          className="mt-1 w-full border px-2 py-1 rounded"
          value={form.type}
          onChange={(e) => {
            const selectedType = e.target.value;
            const defaultSubgroup = getSubgroupOptions(selectedType)[0];
            setForm({ ...form, type: selectedType, subgroup: defaultSubgroup });
          }}
        >
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Subgroup</label>
        <select
          className="mt-1 w-full border px-2 py-1 rounded"
          value={form.subgroup}
          onChange={(e) => setForm({ ...form, subgroup: e.target.value })}
        >
          {getSubgroupOptions(form.type).map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-5">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editGroup ? "Update Group" : "Add Group"}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default GroupComponent;
