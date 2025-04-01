import axios from "axios";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useLoaderData, useNavigate } from "react-router-dom";

import {
  Input,
  Table,
  Button,
  Grid,
  GridRow,
  GridColumn,
  TableRow,
  TableBody,
  TableCell,
  Message,
  MessageHeader,
} from "semantic-ui-react";
import { MasterUrl } from "../../../Consts/Master/MasterUrl.const";
import { getIdEntry } from "../../../Double/fun";
import { useParams } from "react-router-dom";
import AllProductView from "./AllProductView";
//import "./partyForm.css";
export async function loader({ params }) {
  //console.log(`inside loader unitview:`);
  //console.log(params);

  const data = await getIdEntry(
    axios,
    MasterUrl.getIdEntry,
    params.id,
    "prodpic"
  );
  //console.log(data);
  return data;
}
const PictureView = () => {
  const [imageData, setImageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const pageData = useLoaderData();
  console.log("picview");
  console.log(pageData);

  const navigate = useNavigate();
  const param = useParams();

  const editPic = (id) => {
    navigate(`Edit`);
  };
  const [del, setDel] = useState(false);
  const [visible, setVisible] = useState(true);

  const deletePic = (id) => {
    setDel(true);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  useEffect(() => {
    console.log(imageData);
    if (imageData.length > 0) {
      setFilteredData(
        imageData.filter((item) => {
          return item.styleId == param.id;
        })
      );
    }
    console.log(filteredData);
  }, [imageData]);

  useEffect(() => {
    fetchdata();
  }, []);

  async function fetchdata() {
    try {
      console.log("started fetching data");
      const res = await axios.get(
        "https://a3.arya-erp.in/api2/aryapi/api/getPictures"
      );

      const arr = res.data;
      console.log(res.data);

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
      console.log(newArr);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Grid verticalAlign="middle">
        <GridRow centered className="formheader bg-gray-700 text-white">
          <GridColumn textAlign="center" width={12}>
            {pageData.style_name}
          </GridColumn>
          <GridColumn
            floated="middle"
            width={4}
            // color="red"
            textAlign="middle"
            verticalAlign="middle"
          >
            <Button onClick={() => editPic(pageData.id)}>Edit</Button>
            <Button onClick={() => deletePic(pageData.id)}>Delete</Button>
          </GridColumn>
        </GridRow>
        <GridRow>
          <AllProductView />
        </GridRow>
        <GridRow centered>
          <Table
            className="borderless-table"
            basic="very"
            //collapsing
            style={{ maxWidth: "1200px" }}
          >
            <TableBody>
              <TableRow>
                <TableCell className="formheader">Style Name</TableCell>
                <TableCell>
                  <p className="font-semibold">{pageData.style_name}</p>
                </TableCell>
                <TableCell className="formheader">Style Card</TableCell>
                <TableCell>
                  {filteredData.length > 0 ? (
                    <Popup
                      trigger={
                        <img
                          style={{ cursor: "pointer" }}
                          src={filteredData[0].image1}
                          width={50}
                          height={50}
                        />
                      }
                      modal
                      contentStyle={{ width: "320px" }}
                    >
                      <img
                        src={filteredData[0].image1}
                        width={300}
                        height={300}
                      />
                    </Popup>
                  ) : (
                    <img
                      style={{ cursor: "pointer" }}
                      src="https://alppetro.co.id/dist/assets/images/default.jpg"
                      width={50}
                      height={50}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="formheader">Front Picture</TableCell>
                <TableCell>
                  {" "}
                  {filteredData.length > 0 ? (
                    <Popup
                      trigger={
                        <img
                          style={{ cursor: "pointer" }}
                          src={
                            filteredData[0].image2
                              ? filteredData[0].image2
                              : "https://alppetro.co.id/dist/assets/images/default.jpg"
                          }
                          width={50}
                          height={50}
                        />
                      }
                      modal
                      contentStyle={{ width: "320px" }}
                    >
                      <img
                        src={
                          filteredData[0].image2
                            ? filteredData[0].image2
                            : "https://alppetro.co.id/dist/assets/images/default.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    </Popup>
                  ) : (
                    <img
                      style={{ cursor: "pointer" }}
                      src="https://alppetro.co.id/dist/assets/images/default.jpg"
                      width={50}
                      height={50}
                    />
                  )}
                </TableCell>
                <TableCell className="formheader">Back Picture</TableCell>
                <TableCell>
                  {" "}
                  {filteredData.length > 0 ? (
                    <Popup
                      trigger={
                        <img
                          style={{ cursor: "pointer" }}
                          src={
                            filteredData[0].image3
                              ? filteredData[0].image3
                              : "https://alppetro.co.id/dist/assets/images/default.jpg"
                          }
                          width={50}
                          height={50}
                        />
                      }
                      modal
                      contentStyle={{ width: "320px" }}
                    >
                      <img
                        src={
                          filteredData[0].image3
                            ? filteredData[0].image3
                            : "https://alppetro.co.id/dist/assets/images/default.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    </Popup>
                  ) : (
                    <img
                      style={{ cursor: "pointer" }}
                      src="https://alppetro.co.id/dist/assets/images/default.jpg"
                      width={50}
                      height={50}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="formheader">Sketch</TableCell>
                <TableCell>
                  {" "}
                  {filteredData.length > 0 ? (
                    <Popup
                      trigger={
                        <img
                          style={{ cursor: "pointer" }}
                          src={
                            filteredData[0].image4
                              ? filteredData[0].image4
                              : "https://alppetro.co.id/dist/assets/images/default.jpg"
                          }
                          width={50}
                          height={50}
                        />
                      }
                      modal
                      contentStyle={{ width: "320px" }}
                    >
                      <img
                        src={
                          filteredData[0].image4
                            ? filteredData[0].image4
                            : "https://alppetro.co.id/dist/assets/images/default.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    </Popup>
                  ) : (
                    <img
                      style={{ cursor: "pointer" }}
                      src="https://alppetro.co.id/dist/assets/images/default.jpg"
                      width={50}
                      height={50}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </GridRow>
      </Grid>
      {del && visible && (
        <Message warning style={{ textAlign: "center" }}>
          <MessageHeader>
            Are you sure you want to delete this entry?
          </MessageHeader>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button>Yes</Button>
            <Button onClick={handleDismiss}>No</Button>
          </div>
        </Message>
      )}
    </>
  );
};

export default PictureView;
