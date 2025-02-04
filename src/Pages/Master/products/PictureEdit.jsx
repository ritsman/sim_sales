import React, { useEffect, useState } from "react";
import {
  Form,
  redirect,
  useNavigate,
  useActionData,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { getIdEntry, getPageData, updateRecord } from "../../../Double/fun";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
// import "./partyForm.css";

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
  Image,
} from "semantic-ui-react";
import {
  MasterUrl,
  records_per_page,
} from "../../../Consts/Master/MasterUrl.const";

export async function loader({ params }) {
  //console.log(params);

  const data = await getIdEntry(
    axios,
    MasterUrl.getIdEntry,
    params.id,
    "prodpic"
  );
  //console.log(`inside loader General edit:`);
  //console.log(data);
  return data;
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log(`formdata:`);
  console.log(updates);
  //console.log(params);
  // const error = validation(updates);
  // if (Object.keys(error).length) {
  //   console.log(error);
  //   return error;
  // } else {
  //   const res = await updateRecord(axios, params.id, updates, "prodpic");

  //   if (res == "success") {
  //     toast.success("Successfully Edited");
  //     return redirect(`/master/product/picture/${params.id}`);
  //   } else {
  //     toast.error("Error");
  //     return null;
  //   }
  // }

  return null;
}
const validation = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    if (!formData[key]) {
      errors[key] = `Please fill ${key}`;
    }
  });
  //console.log(errors);
  return errors;
};

export default function GeneralEdit() {
  const data = useLoaderData();
  const errors = useActionData();
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [images, setImages] = useState({});

  const [img, setImg] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });

  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setImages({
      image1: image1,
      image2: image2,
      image3: image3,
      image4: image4,
      styleId: param.id,
    });
  }, [image1, image2, image3, image4]);

  const postData = async (e) => {
    console.log(images, "file selected in a object");
    try {
      const res = await axios.post(
        "https://a3.arya-erp.in/api2/aryapi/api/postPictures",
        images,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("successfully added images");
      navigate(`/master/product/picture/${param.id}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImg({
        ...img,
        [imageKey]: reader.result,
      });
    };

    console.log(images, "selected file showing");

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Form method="post">
        <Grid verticalAlign="middle">
          <GridRow centered color="blue" className="formheader">
            <GridColumn textAlign="center" width={12}>
              {data.style_name}
            </GridColumn>
            <GridColumn
              floated="middle"
              width={4}
              textAlign="middle"
              verticalAlign="middle"
            >
              <Button onClick={postData}>Submit</Button>
              <Button>Cancel</Button>
            </GridColumn>
          </GridRow>

          <GridRow centered>
            <Table
              className="borderless-table"
              basic="very"
              collapsing
              style={{ maxWidth: "1200px" }}
            >
              <TableBody>
                <TableRow>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Style Card
                  </TableCell>
                  <TableCell>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setImage1(e.target.files[0]);
                        handleImageChange(e, "image1");
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Image src={img.image1} size="small" circular />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Front Picture
                  </TableCell>
                  <TableCell>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setImage2(e.target.files[0]);
                        handleImageChange(e, "image2");
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Image src={img.image2} size="small" circular />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Back Picture
                  </TableCell>
                  <TableCell>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setImage3(e.target.files[0]);
                        handleImageChange(e, "image3");
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Image src={img.image3} size="small" circular />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    textAlign="center"
                    verticalAlign="middle"
                    className="formheader"
                  >
                    Sketch
                  </TableCell>
                  <TableCell className="imgcell">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setImage4(e.target.files[0]);
                        handleImageChange(e, "image4");
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Image src={img.image4} size="small" circular />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </GridRow>
        </Grid>
      </Form>
    </>
  );
}
