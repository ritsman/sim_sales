import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Button,
  Grid,
  GridColumn,
  GridRow,
  Input,
  Table,
  Header,
  Message,
} from "semantic-ui-react";
import OldForm from "../../Components/OldForm";

export const getProdData = async (axios, search) => {
  let data = await axios.post(
    `https://arya-erp.in/simranapi/workorder/getProdData.php`,

    {
      search: search,
    }
  );
  // console.log(`inside getProdData function`);
  // console.log(data.data);
  return data.data;
};

export async function loader({ request, params }) {
  const url = new URL(request.url);
  const urlsearch = url.searchParams.get("search");
  const contacts = await getProdData(axios, urlsearch);
  return { contacts, urlsearch };
}

const WorkOrder = () => {
  const { contacts, urlsearch } = useLoaderData();
  // console.log(contacts);

  const [forms, setForms] = useState([]);
  const [formDataArray, setFormDataArray] = useState([]);
  const [idCounter, setIdCounter] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [workorderData, setWorkOrderData] = useState({});
  const [workONo, setWorkONo] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    fetchSuggestionsFromAPI(value);
  };

  useEffect(() => {
    async function fetch() {
      const response = await axios.get(
        "http://localhost:3000/api/workOrder/getWorkOrderNo"
      );
      console.log(response.data);
      setWorkONo(response.data);
    }
    fetch();
  }, []);

  useEffect(() => {
    console.log(workONo);
  }, [workONo]);

  const fetchSuggestionsFromAPI = (value) => {
    // const mockSuggestions = ["2425WO0001", "2425WO0002"];

    setSuggestions(
      workONo.filter((suggestion) =>
        suggestion.toLowerCase().endsWith(value.toLowerCase())
      )
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Example: Call your handleClick function with the selected suggestion
    getWorkOrder(suggestion);
    // Clear suggestions
    setSuggestions([]);
  };

  const getWorkOrder = async (suggestion) => {
    console.log("Clicked suggestion:", suggestion);

    const res = await axios.get(
      `http://localhost:3000/api/workOrder/getFrom/${suggestion}`
    );
    setWorkOrderData(res.data[0].data);
    console.log(res.data[0].data, "fetched data of work oder");
  };

  useEffect(() => {
    console.log(workorderData);
  }, [workorderData]);

  const handleSave = (formData) => {
    setFormDataArray((prevState) => [...prevState, formData]);
  };

  const addnew = () => {
    const id = idCounter;
    setIdCounter((prevCounter) => prevCounter + 1);
    setForms([
      ...forms,
      <OldForm
        key={id}
        id={id}
        contacts={contacts}
        onSave={handleSave}
        onDelete={handleDelete}
      />,
    ]);
  };

  const handleDelete = (idToDelete) => {
    console.log(idToDelete);
    setForms((prevForms) => {
      const updatedForms = prevForms.filter((_, index) => index !== idToDelete);
      console.log("updatedForms");
      console.log(updatedForms);
      return updatedForms.map((form, index) => {
        const newId = index;
        console.log(newId);
        return React.cloneElement(form, { key: newId, id: newId });
      });
    });

    setFormDataArray((prevState) => {
      const newArray = [...prevState];
      newArray.splice(idToDelete, 1);
      return newArray;
    });
  };

  // const handleDelete = (id) => {
  //   setForms((prevForms) => prevForms.filter((form) => form.props.id !== id));
  //   setFormDataArray((prevData) => prevData.filter((data) => data.id !== id));
  // };

  console.log(formDataArray);

  const navigate = useNavigate();

  function handleScheduler() {
    navigate("/workorder/scheduler");
  }

  return (
    <>
      <Grid verticalAlign="middle">
        <GridRow centered className="bg-gray-700">
          <GridColumn width={6} className="text-white  ">
            <div className="flex gap-4 items-center justify-center">
              <p className=" p-2"> Work Order Number:</p>
              {/* work order input */}
              <div className="border-2 text-black">
                <input
                  type="text"
                  // value={inputValue}
                  onChange={handleInputChange}
                  className="p-2"
                />
                <div className="absolute z-10 ">
                  {suggestions.length > 0 && (
                    <ul className="bg-white p-4 pr-16 border-2">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {/* work order input end */}
          </GridColumn>
          <GridColumn
            floated="right"
            width={4}
            textAlign="middle"
            verticalAlign="middle"
          >
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded-md text-lg"
              onClick={addnew}
            >
              New
            </button>
            {/* <button onClick={handleScheduler}>Scheduler</button> */}
          </GridColumn>
        </GridRow>
        <GridRow style={{ display: "flex", flexDirection: "column-reverse" }}>
          {forms?.map((FormComponent, index) => (
            <ul key={index}>
              <li>{FormComponent}</li>
            </ul>
          ))}
        </GridRow>
      </Grid>

      {/* display work order data */}
      {Object.keys(workorderData).length !== 0 && (
        <div>
          <Header as="h2" className="text-2xl font-bold mb-4">
            {workorderData.styleName}
          </Header>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(workorderData.sizeData).map((key, index) => (
                  <th
                    key={index}
                    className="py-2 px-4 border-b border-gray-300 text-left text-gray-700"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(workorderData.sizeData).map((value, index) => (
                  <td
                    key={index}
                    className="py-2 px-4 border-b border-gray-300"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          {/* <Message>
            <Message.Header>Size Data</Message.Header>
            <p>Total Quantity: {workorderData.sizeData.totalQuantity}</p>
            <p>L: {workorderData.sizeData.l}</p>
            <p>XL: {workorderData.sizeData.Xl}</p>
            <p>XXL: {workorderData.sizeData.XXL}</p>
            <p>XXXL: {workorderData.sizeData.XXXL}</p>
          </Message> */}

          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Item</Table.HeaderCell>
                <Table.HeaderCell>Qty</Table.HeaderCell>
                <Table.HeaderCell>Req</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {workorderData.bomData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.item}</Table.Cell>
                  <Table.Cell>{item.qty}</Table.Cell>
                  <Table.Cell>{item.req}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Message>
            <Message.Header>Process Data</Message.Header>
            <p>Process: {workorderData.processData[0].process}</p>
            <p>
              Selected IP Values:{" "}
              {workorderData.processData[0].selectedIpValues.join(", ")}
            </p>
            <p>
              Selected OP Values:{" "}
              {workorderData.processData[0].selectedOpValues.join(", ")}
            </p>
            <p>Start Date: {workorderData.processData[0].startDate}</p>
            <p>End Date: {workorderData.processData[0].endDate}</p>
          </Message>

          <p>Work Order No: {workorderData.WorkOrderNo}</p>
        </div>
      )}
    </>
  );
};

export default WorkOrder;
