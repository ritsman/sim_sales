import axios from "axios";
import React, { useState, useEffect } from "react";
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
  TableHeader,
  TableHeaderCell,
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
    "prodbom"
  );
  // console.log("insdie loader");
  // console.log(data);
  return data;
}
const BOMView = () => {
  const pageData = useLoaderData();
  console.log(pageData);

  const navigate = useNavigate();

  const editBom = (id) => {
    //console.log(id);
    navigate(`Edit`);
  };
  const [del, setDel] = useState(false);
  const [visible, setVisible] = useState(true);

  const deleteBom = (id) => {
    setDel(true);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <>
      <Grid verticalAlign="middle">
        <GridRow centered className="formheader bg-gray-700 text-white">
          <GridColumn textAlign="center" width={3}>
            Style ID:{pageData.style_id}
          </GridColumn>
          <GridColumn textAlign="center" width={3}>
            Style Name: {pageData.style_name}
          </GridColumn>
          <GridColumn
            floated="right"
            width={4}
            // color="red"
            textAlign="middle"
            verticalAlign="middle"
          >
            <Button onClick={() => editBom(pageData.id)}>Edit</Button>
            <Button onClick={() => deleteBom(pageData.id)}>Delete</Button>
          </GridColumn>
        </GridRow>
        <GridRow>
          <AllProductView />
        </GridRow>

        <Table centered celled striped className="tableStyle table-responsive">
          <TableHeader>
            <TableRow className="tableStyle">
              <TableHeaderCell>Item Name</TableHeaderCell>
              <TableHeaderCell>Unit</TableHeaderCell>
              <TableHeaderCell>Consumption</TableHeaderCell>
              <TableHeaderCell>Rate</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{pageData.itemname}</TableCell>
              <TableCell>{pageData.unit}</TableCell>
              <TableCell>{pageData.cons}</TableCell>
              <TableCell>{pageData.rate}</TableCell>
              <TableCell>{pageData.amount}</TableCell>
            </TableRow>
            {/* {pageData.map((data) => {
              return (
                <>
                  <TableRow>
                    <TableCell>{data.itemname}</TableCell>
                    <TableCell>{data.unit}</TableCell>
                    <TableCell>{data.cons}</TableCell>
                    <TableCell>{data.rate}</TableCell>
                    <TableCell>{data.amount}</TableCell>
                  </TableRow>
                </>
              );
            })} */}
          </TableBody>
        </Table>
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

export default BOMView;
