import React from "react";
import { Link } from "react-router-dom";
import { Card, CardGroup } from "semantic-ui-react";

export default function MasterIndex() {
  const cards = [
    {
      name: "Payment",
      desc: "Listing of all Customers and Vendors.",
      path: "payment",
    },
    {
      name: "Receipt",
      desc: "Listing of all Units of Measurement.",
      path: "receipt",
    },
    {
      name: "Journal",
      desc: "Listing of all Units of Measurement.",
      path: "journal",
    },
    { name: "Contra", desc: "Listing of all Activities.", path: "contra" },
    { name: "Sales", desc: "Listing of all the Processes.", path: "sales" },
    { name: "Purchase", desc: "Listing of all Locations.", path: "purchase" },
    {
      name: "Credit Note",
      desc: "Listing of all Units of Measurement.",
      path: "creditnote",
    },
    {
      name: "Debit Note",
      desc: "Listing of all Units of Measurement.",
      path: "debitnote",
    },
  ];

  return (
    <div>
      <div
        className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-5 overflow-y-auto h-screen"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-3xl font-bold mb-6">Finance</h1>
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
        <Card className="modulecard" as={Link} to="payment">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Payment</Card.Header>
            <Card.Description>
              Listing of all Customers and Vendors.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="reciept">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Reciept</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="journal">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Journal</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="contra">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Contra</Card.Header>
            <Card.Description>Listing of all Activities.</Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="sales">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Sales</Card.Header>
            <Card.Description>Listing of all the Processes.</Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="purchase">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Purchase</Card.Header>
            <Card.Description>Listing of all Locations.</Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="creditnote">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Credit Note</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>

        <Card className="modulecard" as={Link} to="debitnote">
          <Card.Description textAlign="center" style={{ margin: "30px" }}>
            <Card.Header as="h3">Debit Note</Card.Header>
            <Card.Description>
              Listing of all Units of Measurement.
            </Card.Description>
          </Card.Description>
        </Card>
      </CardGroup> */}
    </div>
  );
}
