import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Card, CardGroup } from "semantic-ui-react";

export default function MasterIndex() {
  let cards = [
    {
      name: "Purchase Order",
      desc: "Listing of all Customers and Vendors",
      path: "purchaseorder",
    },
    {
      name: "Goods Reciept Note",
      desc: "Listing of all Units of Measurement",
      path: "grn",
    },
    {
      name: "Goods Sending Note",
      desc: "Listing of all Units of Measurement.",
      path: "gsn",
    },
  ];
  return (
    <div>
      <div
        className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-5 overflow-y-auto h-screen"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-3xl font-bold mb-6">Material</h1>
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
        <Card className="modulecard" as={Link} to="purchaseorder">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Purchase Order</Card.Header>
            <Card.Description>
              Listing of all Customers and Vendors.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="grn">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Goods Reciept Note</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="gsn">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Goods Sending Note</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>
      </CardGroup> */}
    </div>
  );
}
