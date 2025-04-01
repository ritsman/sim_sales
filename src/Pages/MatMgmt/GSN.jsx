import React, { useEffect, useState } from "react";
import { Form, redirect, useActionData, useLoaderData } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AutoComplete from "../../Components/Autocomplete";
import "../../css/Master/master-common.css";
import {
  TableRow,
  TableCell,
  TableBody,
  Input,
  Table,
  Button,
  Grid,
  GridRow,
  GridColumn,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  TableHeader,
  TableHeaderCell,
  Icon,
} from "semantic-ui-react";
import { getPageData } from "../../Double/fun";
import {
  MasterUrl,
  records_per_page,
} from "../../Consts/Master/MasterUrl.const";
import { parseInt } from "lodash-es";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  // console.log(`formdata:`);
  // console.log(updates);

  const error = validation(updates);
  if (Object.keys(error).length) {
    // console.log(error);
    return error;
  } else {
    // Combine formData and rows
    const rows = JSON.parse(updates.rows);
    const combinedData = {
      ...updates,
      rows,
    };

    console.log("Combined Data:");
    console.log(combinedData);
    return null;
    //   //console.log("inside upd2");
    //   // console.log(res);
    //   if (res == "success") {
    //     toast.success("Successfully Edited");
    //     return redirect(`/master/unit/${params.unitId}`);
    //   } else {
    //     toast.error("Error");
    //     return null;
    //   }
  }

  return null;
}
const validation = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    if (!formData[key]) {
      errors[key] = `Please fill ${key}`;
    }
  });
  console.log(errors);
  return errors;
};

export default function GSN() {
  const [partyData, setPartyData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [gstData, setGstData] = useState([]);

  useEffect(() => {
    fetchItemData();
    fetchPartyData();
    fetchLocationData();
  }, []);

  const fetchItemData = async () => {
    try {
      const response = await axios.get(
        "https://arya-erp.in/simranapi/Matman/getItemName.php"
      );
      setItemData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLocationData = async () => {
    try {
      const response = await axios.get(
        "https://arya-erp.in/simranapi/Matman/getLocationName.php"
      );
      setLocationData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPartyData = async () => {
    try {
      const response = await axios.get(
        "https://arya-erp.in/simranapi/Matman/getPartyName.php"
      );
      setPartyData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  //   console.log(data);
  //   console.log(itemData);
  // console.log(locationData);
  const errors = useActionData();

  const plus_button = {
    background: "transparent",
    padding: "0",
  };

  const tableStyle = {
    border: "none !important",
    // padding:'20px',
  };
  const icons_cell = {
    width: "50px",
  };
  const input_width = {
    width: "100%",
  };
  const [row_id, setRow_id] = useState(1);

  const [rows, setRows] = useState([
    { id: 0, qty: 0, rate: 0, igst: 0, sgst: 0, cgst: 0, amt: 0 },
  ]);
  const handleAddRow = (e) => {
    setRow_id(row_id + 1);
    setRows([
      ...rows,
      { id: rows.length, qty: 0, rate: 0, igst: 0, sgst: 0, cgst: 0, amt: 0 },
    ]);
    e.preventDefault();
  };
  const removeItem = (ind) => {
    const updatedItems = rows.filter((item) => item.id !== ind);
    console.log(updatedItems);
    setRows(updatedItems);
  };

  const handleChange = (index, field, value) => {
    const newInputs = [...rows];
    newInputs[index][field] = value;
    setRows(newInputs);
  };

  const calculateSum = (field) => {
    return rows.reduce((sum, input) => sum + parseFloat(input[field]) || 0, 0);
  };

  const handleDelRow = (e, ind) => {
    const updated_rows = [...rows];

    updated_rows.splice(ind, 1);
    setRows(updated_rows);
    e.preventDefault();
  };

  const [selectedpartyValues, setSelectedpartyValues] = useState([]);
  const handlePartySelect = async (value) => {
    // console.log(value);
    setSelectedpartyValues([...selectedpartyValues, value]);
    try {
      const response = await axios.post(
        "https://arya-erp.in/simranapi/Matman/getPartyAddGst.php",
        { company_name: value }
      );
      setAddressData(response.data.address);
      setGstData(response.data.gst);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [selectedlocationValues, setSelectedlocationValues] = useState("");
  const handleLocationSelect = (value) => {
    setSelectedlocationValues(value);
  };

  const [selectedValues, setSelectedValues] = useState([]);
  const handleSelect = (value, index) => {
    setSelectedValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  const handleSave = () => {
    const form = document.getElementById("grnForm");
    const rowsInput = document.createElement("input");
    rowsInput.type = "hidden";
    rowsInput.name = "rows";
    rowsInput.value = JSON.stringify(rows);
    form.appendChild(rowsInput);
  };

  return (
    <>
      <Form method="post" id="grnForm">
        <Grid verticalAlign="middle" className="w-screen">
          <GridRow
            centered
            color=""
            className="formheader bg-gray-700 mr-10 w-screen  border-4 "
          >
            <GridColumn
              floated="right"
              width={4}
              textAlign="right"
              verticalAlign="middle"
            >
              <Button onClick={handleSave}>Save</Button>
              <Button>Cancel</Button>
            </GridColumn>
          </GridRow>
          <GridRow>
            <Table
              className="borderless-table"
              basic="very"
              style={{ maxWidth: "1200px" }}
            >
              <TableBody>
                <TableRow>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    GSN No.
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="GSN No*"
                      name="gsn_no"
                      error={errors?.gsn_no}
                    />
                  </TableCell>

                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    GSN Type
                  </TableCell>
                  <TableCell>
                    <select
                      placeholder="Type"
                      style={{
                        border: "1px solid rgba(34, 36, 38, 0.15)",
                        padding: "10px 50px",
                        marginleft: "12px",
                        outline: "none",
                        borderRadius: "0.28571429rem",
                      }}
                      className="select"
                      name="gsn_type"
                      id="gsn_type"
                    >
                      <option value="returnable">Returnable</option>
                      <option value="billable">Billable</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </TableCell>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Supplier
                  </TableCell>
                  <TableCell>
                    <AutoComplete
                      options={partyData.map((item) => item)}
                      onSelect={(value) => handlePartySelect(value)}
                    />{" "}
                    <input
                      type="hidden"
                      name="supplier"
                      value={selectedpartyValues}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Address
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Address*"
                      name="address"
                      error={errors?.address}
                      value={addressData}
                      readOnly
                    />
                  </TableCell>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    GST
                  </TableCell>
                  <TableCell>
                    <Input
                      value={gstData}
                      placeholder="GST*"
                      name="gst"
                      error={errors?.gst}
                      readOnly
                    />
                  </TableCell>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Date
                  </TableCell>
                  <TableCell>
                    <Input type="date" name="date" error={errors?.date} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    PO No.
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="PO No.*"
                      name="po_no"
                      error={errors?.po_no}
                    />
                  </TableCell>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Location
                  </TableCell>
                  <TableCell>
                    <AutoComplete
                      options={locationData.map((item) => item)}
                      onSelect={(value) => handleLocationSelect(value)}
                    />
                    <input
                      type="hidden"
                      name="location"
                      value={selectedlocationValues}
                    />
                  </TableCell>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Transport
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Trasport*"
                      name="transport"
                      error={errors?.transport}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </GridRow>
          <GridRow centered>
            <div className="mt-8 mr-10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={(e) => handleAddRow(e)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IGST
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SGST
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CGST
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, index) => (
                      <tr key={`R${row.id}`}>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => handleDelRow(e, index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <AutoComplete
                            onSelect={(value) => handleSelect(value, index)}
                            options={itemData.map((item) => item)}
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Quantity*"
                            onChange={(e) =>
                              handleChange(index, "qty", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Rate*"
                            onChange={(e) =>
                              handleChange(index, "rate", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="IGST*"
                            onChange={(e) =>
                              handleChange(index, "igst", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="SGST*"
                            onChange={(e) =>
                              handleChange(index, "sgst", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="CGST*"
                            onChange={(e) =>
                              handleChange(index, "cgst", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Amount*"
                            onChange={(e) =>
                              handleChange(index, "amt", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GridRow>
          <GridRow>
            <GridColumn width={5} floated="right">
              <Table
                className="borderless-table"
                basic="very"
                style={{ maxWidth: "1200px" }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell
                      textAlign="center"
                      verticalAlign="middle"
                      className="formheader"
                    >
                      Discount
                    </TableCell>
                    <TableCell>
                      <Input
                        name="discount"
                        placeholder="Discount*"
                        error={errors?.discount}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      textAlign="center"
                      verticalAlign="middle"
                      className="formheader"
                    >
                      Freight
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Freight"
                        name="freight"
                        error={errors?.freight}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      textAlign="center"
                      verticalAlign="middle"
                      className="formheader"
                    >
                      Tax Amount
                    </TableCell>
                    <TableCell>
                      <Input
                        name="tax_amount"
                        value={
                          Number(calculateSum("igst")) +
                          Number(calculateSum("cgst")) +
                          Number(calculateSum("sgst"))
                        }
                        readOnly
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      textAlign="center"
                      verticalAlign="middle"
                      className="formheader"
                    >
                      SubTotal
                    </TableCell>
                    <TableCell>
                      <Input
                        name="subtotal"
                        value={
                          Number(calculateSum("rate")) *
                          Number(calculateSum("qty"))
                        }
                        readOnly
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      textAlign="center"
                      verticalAlign="middle"
                      className="formheader"
                    >
                      Total Amount
                    </TableCell>
                    <TableCell>
                      <Input
                        name="total_amt"
                        value={calculateSum("amt")}
                        readOnly
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      textAlign="center"
                      verticalAlign="middle"
                      className="formheader"
                    >
                      Total Quantity
                    </TableCell>
                    <TableCell>
                      <Input
                        name="total_qty"
                        value={calculateSum("qty")}
                        readOnly
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </GridColumn>
          </GridRow>
        </Grid>
      </Form>
    </>
  );
}
