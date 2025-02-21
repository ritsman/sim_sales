/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Link, Outlet } from "react-router-dom";
import menu_master from "../Consts/Master/Master.const";
import Breadcrumbs from "../Components/BreadCrumps.jsx";
import "./sidebarr.css";
import {
  Icon,
  Sidebar,
  Segment,
  Header,
  Menu,
  Button,
  Modal,
  ModalHeader,
  ModalDescription,
  ModalActions,
} from "semantic-ui-react";

export default function SidebarCom({ visible, change, sidemenu2 }) {
  let paths = [
    { title: "Home", link: "/" },
    { title: "Sales", link: "/sales" },
    { title: "Work Order", link: "/workorder" },
    { title: "Material", link: "/material" },
    { title: "Purchase Order", link: "/material/purchaseorder" },
    { title: "Goods Reciept Note", link: "/material/grn" },
    { title: "Goods Sending Note", link: "/material/gsn" },
    { title: "Finance", link: "/finance" },
    { title: "Master", link: "/master" },
    { title: "Product", link: "/master/product" },
    { title: "Inventory", link: "/inventory" },
    { title: "Dashboard", link: "/dashboard" },
    { title: "Home", link: "/" },
    { title: "Home", link: "/" },
  ];
  //console.log(sidemenu2);

  const menu_items_default = [
    {
      key: 1,
      name: "Dashboard14",
      icon: "address card outline",
    },
    {
      key: 2,
      name: "WorkOrder4",
      icon: "list ul",
    },
  ];

  function m(sidemenu2) {
    switch (sidemenu2) {
      case "master":
        return menu_master.master;
      case "dashboard":
        return menu_master.dashboard;
      case "material":
        return menu_master.material;
      case "money":
        return menu_master.money;
      case "gallery":
        return menu_master.gallery;
      default:
        return menu_items_default;
    }
  }
  const menu_items = m(sidemenu2);
  // console.log(menu_items);
  return (
    <>
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          visible={visible}
          animation="push"
          vertical
          inverted
          onHide={() => change()}
          className="custom-sidebar "
        >
          <Menu.Item as={Link} to="navigate">
            Navigation Pane
          </Menu.Item>

          {menu_items.map((it) => (
            <Menu.Item key={it.key} as={Link} to={it.nav}>
              <Icon name={it.icon} />
              {it.name}
            </Menu.Item>
          ))}
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic>
            {/* <Header as="h4">Data</Header> */}
            <div className=" w-screen ">
              <Breadcrumbs paths={paths} />
              <Outlet />
            </div>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
}
