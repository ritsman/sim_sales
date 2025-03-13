import axios from "axios";
import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
// import { Card, CardGroup, CardHeader, Table } from "react-bootstrap";
import {
  Card,
  CardGroup,
  Table,
  CardContent,
  CardDescription,
  Image,
  Input,
  Button,
  SegmentGroup,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Header,
} from "semantic-ui-react";
import AutoComplete from "../Components/Autocomplete";

import ProcessAutoComplete from "./ProcessAutoComplete";
import { MasterUrl, records_per_page } from "../Consts/Master/MasterUrl.const";

export const getProdDetail = async (style_name) => {
  let data = await axios.post(
    `https://arya-erp.in/simranapi/workorder/getProdDetail.php`,

    {
      style_name: style_name,
    }
  );
  console.log(`inside getProdDetail function`);
  console.log(data.data);
  return data.data;
};

const OldForm = ({ id, contacts, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    product: "",
  });

  const [selectedOptions, setSelectedOptions] = useState({
    product: "",
  });

  const [data, setData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({});
  const [imageData, setImageData] = useState([]);
  const [filteredImage, setFilteredImage] = useState([]);
  let [counter, setCounter] = useState(1);
  const [workONo, setWorkONo] = useState([]);

  const handleSelect = async (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setSelectedOptions({
      ...selectedOptions,
      [field]: value,
    });
    setSelectedProduct(value);
    setData(await getProdDetail(value));
  };
  // console.log("data");
  // console.log(data);
  // console.log(contacts);

  //size card utilities
  const [inputValues, setInputValues] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    const total = newInputValues.reduce(
      (acc, curr) => acc + (parseInt(curr) || 0),
      0
    );
    setTotalQuantity(total);
  };

  useEffect(() => {
    if (data && data.sz && data.sz[0].size_nos) {
      const count = parseInt(data.sz[0].size_nos);
      const newQuantities = Array.from(
        { length: count },
        (_, index) => index + 1
      ).map(() => "");
      setInputValues(newQuantities);
    }

    async function fetch() {
      try {
        const res = await axios.get(
          "https://a3.arya-erp.in/api2/aryapi/api/getPictures"
        );
        //  "http://localhost:8888/api/getPictures";

        const arr = res.data;

        let newArr = arr.map((item) => {
          let imageURL1 = "";
          let imageURL2 = "";
          let imageURL3 = "";
          let imageURL4 = "";

          if (item.image1 != undefined) {
            const uint8Array1 = new Uint8Array(item.image1.data.data);
            const blob1 = new Blob([uint8Array1], { type: "image/png" }); // Adjust type as per your image format
            imageURL1 = URL.createObjectURL(blob1);
          }

          if (item.image2 != undefined) {
            const uint8Array2 = new Uint8Array(item.image2.data.data);
            const blob2 = new Blob([uint8Array2], { type: "image/png" }); // Adjust type as per your image format
            imageURL2 = URL.createObjectURL(blob2);
          }

          if (item.image3 != undefined) {
            const uint8Array3 = new Uint8Array(item.image3.data.data);
            const blob3 = new Blob([uint8Array3], { type: "image/png" }); // Adjust type as per your image format
            imageURL3 = URL.createObjectURL(blob3);
          }

          if (item.image4 != undefined) {
            const uint8Array4 = new Uint8Array(item.image4.data.data);
            const blob4 = new Blob([uint8Array4], { type: "image/png" }); // Adjust type as per your image format
            imageURL4 = URL.createObjectURL(blob4);
          }
          let newObj = {
            styleId: item.styleId,
            image1: imageURL1,
            image2: imageURL2,
            image3: imageURL3,
            image4: imageURL4,
          };
          return newObj;
        });
        setImageData(newArr);
        console.log(imageData);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [data]);

  useEffect(() => {
    if (data.pic && data.pic.length > 0) {
      console.log(data.pic[0].style_id, "style iddd");
    }
    if (imageData.length > 0) {
      setFilteredImage(
        imageData.filter((item) => {
          if (data.pic && data.pic.length > 0) {
            return item.styleId == data.pic[0].style_id;
          }
        })
      );
    }
  }, [imageData]);

  useEffect(() => {
    console.log(filteredImage);
  }, [filteredImage]);

  //bom card utilities
  const item_name = data?.bom?.map((item) => item.itemname);
  const [userNumbers, setUserNumbers] = useState(
    Array(item_name?.length).fill("")
  );
  const [consNumbers, setConsNumbers] = useState(Array(item_name?.length));
  const [results, setResults] = useState(Array(item_name?.length).fill("0"));

  const handleReqChange = (index, value, type) => {
    const newNumbers = type === "cons" ? [...consNumbers] : [...userNumbers];
    newNumbers[index] = value;

    if (type === "cons") {
      setConsNumbers(newNumbers);
    } else {
      setUserNumbers(newNumbers);
    }

    const cons = parseFloat(type === "cons" ? value : consNumbers[index]);
    const qty = parseFloat(type === "qty" ? value : userNumbers[index]);

    if (!isNaN(cons) && !isNaN(qty)) {
      const result = cons * qty;
      const newResults = [...results];
      newResults[index] = result.toFixed(2); // Assuming you want to display two decimal places
      setResults(newResults);
    }
  };

  // const handleReqChange = (index, value) => {
  //   const newNumbers = [...userNumbers];
  //   newNumbers[index] = value;
  //   setUserNumbers(newNumbers);

  //   const newResults = newNumbers.map((num, i) =>
  //     i !== index
  //       ? (num * consumption[i]).toFixed(2)
  //       : (num * consumption[index]).toFixed(2)
  //   );

  //   setResults(newResults);
  // };

  //process card utilities
  const [selectedIpValues, setSelectedIpValues] = useState({});

  const handleIpBOMSelect = (index, value) => {
    setSelectedIpValues((prevValues) => ({
      ...prevValues,
      [index]: [...(prevValues[index] || []), value],
    }));
  };

  const [selectedOpValues, setSelectedOpValues] = useState({});

  const handleOpBOMSelect = (index, value) => {
    setSelectedOpValues((prevValues) => ({
      ...prevValues,
      [index]: [...(prevValues[index] || []), value],
    }));
  };

  const [dateFieldValues, setDateFieldValues] = useState([]);

  const handleStartDateChange = (index, e) => {
    const { value } = e.target;
    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], startDate: value };
      return newValues;
    });
  };

  const handleEndDateChange = (index, e) => {
    const { value } = e.target;
    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], endDate: value };
      return newValues;
    });
  };

  const validation = (formData) => {
    const errors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = `Please fill ${key}`;
      }
    });
    // console.log(errors);
    return errors;
  };
  const sizes = data.sz?.map((item) => item.sizes?.split("**")).flat();
  // const processValues = data?.mfg?.map((item) => item.process);

  // console.log(processValues);

  //save functionality
  const handleSave = async () => {
    const combinedData = {
      styleName: {},
      sizeData: { totalQuantity: totalQuantity },
      bomData: {},
      processData: {},
    };

    combinedData.styleName = selectedProduct;

    // Size data

    inputValues.forEach((value, index) => {
      const size = sizes[index];
      combinedData.sizeData[size] = value;
    });

    // Bom data
    // consNumbers.forEach((value, index) => {
    //   combinedData.bomData.push({
    //     cons: value,
    //     qty: userNumbers[index],
    //     req: results[index],
    //   });
    // });
    const bomToLog = data?.bom?.map((item, index) => ({
      item: item.itemname,
      cons: consNumbers[index],
      qty: userNumbers[index],
      req: results[index],
    }));

    //console.log(bomToLog);
    combinedData.bomData = bomToLog;
    // Process data
    const dataToLog = data?.mfg?.map((item, index) => ({
      process: item.process,
      selectedIpValues: selectedIpValues[index] || [],
      selectedOpValues: selectedOpValues[index] || [],
      startDate: dateFieldValues[index]?.startDate || "",
      endDate: dateFieldValues[index]?.endDate || "",
    }));

    // console.log(dataToLog);
    combinedData.processData = dataToLog;

    const generateWOUniqueID = async () => {
      let uniqueID;
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      let year1, year2;

      if (currentMonth < 3) {
        year1 = (currentYear - 1).toString().slice(-2);
        year2 = currentYear.toString().slice(-2);
      } else {
        year1 = currentYear.toString().slice(-2);
        year2 = (currentYear + 1).toString().slice(-2);
      }

      while (true) {
        uniqueID = `${year1}${year2}WO${String(counter).padStart(4, "0")}`;
        if (!workONo.includes(uniqueID)) {
          return uniqueID;
        }
        console.log("ID exists, generating new ID...");
        counter++;
        setCounter(counter);
      }
    };

    combinedData.WorkOrderNo = await generateWOUniqueID();

    // const error = validation(combinedData);
    // if (Object.keys(error).length) {
    //   console.log(error);
    //   return error;
    // } else {
    //   onSave(combinedData);
    //   // return null;
    // }

    //posting data to backend side
    try {
      console.log("start posting data");
      const res = await axios.post(
        "https://a2.arya-erp.in/api2/aryapi/api/workOrder/PostForm",
        combinedData
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    console.log("combined data ", combinedData);
    onSave(combinedData);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  useEffect(() => {
    async function fetch() {
      const response = await axios.get(
        "https://a2.arya-erp.in/api2/aryapi/api/workOrder/getWorkOrderNo"
      );

      setWorkONo(response.data);
    }
    fetch();
  }, []);

  useEffect(() => {
    console.log(workONo);
  }, [workONo]);

  return (
    <>
      <div className="proddiv px-10">
        <Header style={{ marginTop: "20px" }} as="h5">
          Product
        </Header>
        <AutoComplete
          options={contacts.map((item) => item.style_name)}
          onSelect={(value) => handleSelect("product", value)}
        />
      </div>

      {selectedOptions.product && (
        <>
          <div className="mainscrollable pr-16 ">
            <CardContent className="cardcon">
              <Button color="red" floated="right" onClick={handleDelete}>
                Delete
              </Button>
              <Button floated="right" primary onClick={handleSave}>
                Save
              </Button>
              {/* Style Card */}
              <CardDescription className="py-20">
                {data.pic?.map((item) => (
                  <div key={item.id} className="">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHeaderCell>
                            Style: {item.style_name}
                          </TableHeaderCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <CardGroup>
                            <Card>
                              <CardContent textAlign="center">
                                <Image
                                  size="small"
                                  src={
                                    filteredImage.length > 0 &&
                                    filteredImage[0].image2
                                      ? filteredImage[0].image2
                                      : "/defaultimg.jpeg"
                                  }
                                />
                                <CardDescription>
                                  {item.frontpic}
                                </CardDescription>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent textAlign="center">
                                <Image
                                  size="small"
                                  src={
                                    filteredImage.length > 0 &&
                                    filteredImage[0].image3
                                      ? filteredImage[0].image3
                                      : "/defaultimg.jpeg"
                                  }
                                />
                                <CardDescription>
                                  {item.backpic}
                                </CardDescription>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent textAlign="center">
                                <Image
                                  size="small"
                                  src={
                                    filteredImage.length > 0 &&
                                    filteredImage[0].image4
                                      ? filteredImage[0].image4
                                      : "/defaultimg.jpeg"
                                  }
                                />
                                <CardDescription>{item.sketch}</CardDescription>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent textAlign="center">
                                <Image
                                  size="small"
                                  src={
                                    filteredImage.length > 0 &&
                                    filteredImage[0].image1
                                      ? filteredImage[0].image1
                                      : "/defaultimg.jpeg"
                                  }
                                />
                                <CardDescription>
                                  {item.stylecard}
                                </CardDescription>
                              </CardContent>
                            </Card>
                          </CardGroup>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </CardDescription>
              {/* Size Card */}
              <CardDescription>
                {data.sz?.map((item) => (
                  <div key={item.id}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHeaderCell>
                            Size: {item.size_name}
                          </TableHeaderCell>
                          <TableHeaderCell>
                            Total Quantity: {totalQuantity}
                          </TableHeaderCell>
                          <TableHeaderCell></TableHeaderCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {item.sizes?.split("**").map((size, index) => (
                            <Input
                              requried
                              key={index}
                              defaultValue={size}
                              readOnly
                            />
                          ))}
                        </TableRow>
                        <TableRow>
                          {inputValues.map((value, index) => (
                            <Input
                              key={index}
                              type="text"
                              placeholder={`Enter quantity`}
                              name={`QTY${index + 1}`}
                              value={value}
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                            />
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </CardDescription>
              {/* BOM Card */}
              <CardDescription>
                <div className="scrollable">
                  <Table className="borderless-table">
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>BOM</TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Item Name</TableHeaderCell>
                        <TableHeaderCell>Consumption</TableHeaderCell>
                        <TableHeaderCell>Quantity</TableHeaderCell>
                        <TableHeaderCell>Requirement</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.bom?.map((item, index) => {
                        return (
                          <>
                            <TableRow key={index}>
                              <TableCell>{item.itemname}</TableCell>
                              <TableCell>
                                <Input
                                  name={`cons${index + 1}`}
                                  placeholder="Consumption*"
                                  defaultValue={item.cons}
                                  value={consNumbers[index]}
                                  onChange={(e) =>
                                    handleReqChange(
                                      index,
                                      e.target.value,
                                      "cons"
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  name={`qty${index + 1}`}
                                  placeholder="Enter Quantity"
                                  value={userNumbers[index]}
                                  onChange={(e) =>
                                    handleReqChange(
                                      index,
                                      e.target.value,
                                      "qty"
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  requried
                                  value={results[index]}
                                  name={`req${index + 1}`}
                                  readOnly
                                />
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardDescription>
              {/* Process Card */}
              <CardDescription>
                <div className="scrollable">
                  <Table className="borderless-table custom-table">
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Process</TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Input requried</TableHeaderCell>
                        <TableHeaderCell>Process</TableHeaderCell>
                        <TableHeaderCell>Output</TableHeaderCell>
                        <TableHeaderCell>Start Date</TableHeaderCell>
                        <TableHeaderCell>End Date</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.mfg &&
                        data.mfg?.map((item, index) => {
                          return (
                            <>
                              <TableRow key={item.id}>
                                <TableCell>
                                  <ProcessAutoComplete
                                    index={index}
                                    options={data?.bom?.map(
                                      (item) => item.itemname
                                    )}
                                    onSelect={(value) =>
                                      handleIpBOMSelect(index, value)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    name={`process${index + 1}`}
                                    placeholder="Process*"
                                    defaultValue={item.process}
                                    readOnly
                                  />
                                </TableCell>
                                <TableCell>
                                  <ProcessAutoComplete
                                    onSelect={(value) =>
                                      handleOpBOMSelect(index, value)
                                    }
                                    // index={index + 1}
                                    options={data?.bom?.map(
                                      (item) => item.itemname
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    requried
                                    name={`sd${index + 1}`}
                                    type="date"
                                    onChange={(e) =>
                                      handleStartDateChange(index, e)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    requried
                                    name={`ed${index + 1}`}
                                    type="date"
                                    onChange={(e) =>
                                      handleEndDateChange(index, e)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </CardDescription>
            </CardContent>
          </div>
        </>
      )}
    </>
  );
};

export default OldForm;
