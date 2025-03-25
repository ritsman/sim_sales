import workOrder from "../model/WorkOrder.model.js";

export const Style = async (req, res) => {
  console.log("reached inside style controller");

  try {
    const existingStyle = await workOrder.findOne({
      "data.styleName": req.body.styleName,
    });

    if (existingStyle) {
      // Update existing document
      existingStyle.data = req.body;
      await existingStyle.save();
      res.send("successfully updated existing style data in database");
    } else {
      // Create new document
      const newData = new workOrder({
        data: req.body,
      });
      await newData.save();
      res.send("successfully saved new style data to database");
    }
  } catch (error) {
    res.send("error in posting data to database");
  }
};

export const getStyle = async (req, res) => {
  console.log("reached insdie getStyle controller");
  const { id } = req.params;
  console.log(id);
  try {
    const response = await workOrder.find({ "data.WorkOrderNo": id });
    console.log(response);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

export const getAllNo = async (req, res) => {
  try {
    let result = await workOrder.find({});

    let orderNo = result.map((item) => item.data.WorkOrderNo);
    res.send(orderNo);
  } catch (error) {
    res.send("error in getting work order no");
  }
};
