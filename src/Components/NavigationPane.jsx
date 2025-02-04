import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardGroup,
  Header,
  Icon,
  IconGroup,
} from "semantic-ui-react";
import "./navigationpane.css";

export default function MasterIndex() {
  let cards = [
    {
      name: "Dashboard",
      icon: "https://cdn1.iconfinder.com/data/icons/tiny-iconz-line-vol-09/20/dashboard_panel_admin-512.png",
      path: "/dashboard",
    },
    {
      name: "Admin",
      icon: "https://cdn1.iconfinder.com/data/icons/ui-set-6/100/User-1024.png",
    },
    {
      name: "Work Order",
      icon: "https://cdn0.iconfinder.com/data/icons/work-from-home-17/512/FoodDelivery-food-delivery-meal-order-1024.png",
      path: "/workorder",
    },
    {
      name: "Material Management",
      icon: "https://cdn3.iconfinder.com/data/icons/web-design-and-development-3-2/512/141-128.png",
      path: "/material",
    },
    {
      name: "Manufacturing",
      icon: "https://cdn2.iconfinder.com/data/icons/industry-and-production/48/37-Exchange_and_Process-1024.png",
    },
    {
      name: "Sales",
      icon: "https://cdn1.iconfinder.com/data/icons/ui-set-6/100/ROI-1024.png",
      path: "/sales",
    },
    {
      name: "Inventory",
      icon: "https://cdn0.iconfinder.com/data/icons/social-productivity-line-art-4/128/checklist-1024.png",
      path: "/inventory",
    },
    {
      name: "Money",
      icon: "https://cdn2.iconfinder.com/data/icons/thin-business-1/24/thin-1099_money_deal-1024.png",
    },
    {
      name: "Inspection",
      icon: "https://cdn3.iconfinder.com/data/icons/seo-and-marketing-solid-icons-vol-1/64/002-1024.png",
    },
    {
      name: "Master",
      icon: "https://cdn2.iconfinder.com/data/icons/web-solid/32/user-1024.png",
      path: "/master",
    },
    {
      name: "Product Gallery",
      icon: "https://cdn2.iconfinder.com/data/icons/product-ui/60/4-06-512.png",
    },
    {
      name: "Report",
      icon: "https://cdn2.iconfinder.com/data/icons/education-582/64/Score-examination-result-report-checklist-1024.png",
    },
  ];
  return (
    <div className="container">
      <Card.Header as="h1" className="navheading">
        NAVIGATION PANE
      </Card.Header>

      <div
        className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-5 overflow-y-auto h-screen"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cards.map((card) => (
            <Link
              key={card.name}
              to={card.path}
              className="bg-white shadow-md rounded-md p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="flex justify-center">
                <img src={card.icon} className="w-6 h-6" />
              </span>
              <h2 className="text-lg text-center font-semibold mb-2">
                {card.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      {/* 
      <CardGroup centered className="cardgroup" itemsPerRow={4}>
        <Card className="navcard" href="#card-example-link-card">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="tasks" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Dashboard
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" href="#card-example-link-card">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="file alternate outline" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Admin
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" as={Link} to="/workorder">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="calendar check outline" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Work Order
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" as={Link} to="/material">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="bullseye" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Material Management
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" href="#card-example-link-card">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="warehouse" />
            </IconGroup>
            <Card.Header className="navheader" as="h3">
              Manufacturing
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" as={Link} to="/sales">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="chart line" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Sales
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" as={Link} to="/inventory">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="signal" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Inventory
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" href="#card-example-link-card">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="rupee sign" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Money
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" href="#card-example-link-card">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="search" />
            </IconGroup>
            <Card.Header className="navheader" as="h3">
              Inspection
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" as={Link} to="/master">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="user" />
            </IconGroup>
            <Card.Header className="navheader" as="h3">
              Master
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" href="#card-example-link-card">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="images" />
            </IconGroup>
            <Card.Header className="navheader" as="h3">
              Product Gallery
            </Card.Header>
          </CardDescription>
        </Card>
        <Card className="navcard" href="#card-example-link-card">
          <CardDescription textAlign="center" style={{ margin: "30px" }}>
            <IconGroup size="big">
              <Icon size="big" name="circle outline" />
              <Icon name="edit outline" />
            </IconGroup>

            <Card.Header className="navheader" as="h3">
              Report
            </Card.Header>
          </CardDescription>
        </Card>
      </CardGroup> */}
    </div>
  );
}
