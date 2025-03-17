import React from "react";
import { Link } from "react-router-dom";
import { Card, CardGroup } from "semantic-ui-react";

export default function MasterIndex() {
  let cards = [
    // {
    //   name: "Party",
    //   path: "party",
    //   desc: "Listing of all Customers and Vendors",
    // },
    {
      name: "Party",
      path: "party1",
      desc: "Listing of all Customers and Vendors",
    },
    // { name: "Unit", path: "unit", desc: "Listing of all Units of Measurement" },
    {
      name: "Unit",
      path: "unit1",
      desc: "Listing of all Units of Measurement",
    },

    // { name: "Item", path: "item", desc: "Listing of all Units of Measurement" },
    {
      name: "Item",
      path: "item1",
      desc: "Listing of all Units of Measurement",
    },

    { name: "Activity", path: "activity", desc: "Listing of all Activities" },
    { name: "Process", path: "process", desc: "Listing of all the Processes" },
    { name: "Location", path: "location", desc: "Listing of all Locations" },
    // {
    //   name: "Group",
    //   path: "group",
    //   desc: "Listing of all groups",
    // },
    // { name: "Size", path: "size", desc: "Listing of all Units of Measurement" },
    // {
    //   name: "Product",
    //   path: "product",
    //   desc: "Listing of all Products",
    // },
    {
      name: "Size",
      path: "size1",
      desc: "Listing of all Units of Measurement",
    },
    {
      name: "Group",
      path: "group",
      desc: "Listing of all groups",
    },
    {
      name: "Group1",
      path: "group1",
      desc: "Listing of all groups",
    },
    { name: "Product", path: "product1", desc: "Listing of all Products" },
  ];
  return (
    <div>
      <div
        className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-5 overflow-y-auto h-screen"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-3xl font-bold mb-6">Master</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cards.map((card) => (
            <Link
              key={card.name}
              to={card.path}
              className="bg-white shadow-md rounded-md p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <h2 className="text-lg font-semibold mb-2">{card.name}</h2>
              <p className="text-gray-600"> {card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
      {/* <CardGroup itemsPerRow={3}>
        <Card className="modulecard" as={Link} to="party">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Party</Card.Header>
            <Card.Description>
              Listing of all Customers and Vendors.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="unit">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Unit</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="item">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Item</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="activity">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Activity</Card.Header>
            <Card.Description>Listing of all Activities.</Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="process">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Process</Card.Header>
            <Card.Description>Listing of all the Processes.</Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="location">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Location</Card.Header>
            <Card.Description>Listing of all Locations.</Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="group">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Group</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="size">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Size</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="product">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Product</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>
      </CardGroup> */}
    </div>
  );
}
