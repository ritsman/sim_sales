import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Card, CardGroup } from "semantic-ui-react";

export default function InventoryNav() {
  let cards = [
    {
      name: "Item",
      desc: "Listing of all Customers and Vendors",
      path: "iteminventory",
    },
    {
      name: "Product",
      desc: " Listing of all Units of Measurement.",
      path: "productinventory",
    },
  ];
  return (
    <div>
      <div
        className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-5 overflow-y-auto h-screen"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-3xl font-bold mb-6">Inventory</h1>
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

      {/* <CardGroup itemsPerRow={3} className="container">
        <Card className="maincards" as={Link} to="iteminventory">
          <Card.Description textAlign="center" className="desc">
            <Card.Header as="h3">Item</Card.Header>
            <Card.Description>
              Listing of all Customers and Vendors.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="maincards" as={Link} to="productinventory">
          <Card.Description textAlign="center" className="desc">
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
