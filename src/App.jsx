import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout, { Logged } from "./RootLayout";
import ErrorPage from "./Pages/error-page";

import Dashboard from "./Pages/Dashboard";
// import { useAuth } from "./hooks/useAuth.js";

import LoginForm from "./Pages/Login";

import NavigationPane from "./Components/NavigationPane";
import Inventory from "./Pages/Inventory/Inventory.jsx";
import InventoryNav from "./Pages/Inventory/InventoryNav.jsx";
//import for master module
// import Party2, { loader as partyLoader } from "./Pages/Master/Party2";
// import PartyView, { loader as viewLoader } from "./Pages/Master/Party-View";
// import PartyEdit, { loader as editLoader } from "./Pages/Master/Party-Edit";
// import { action as editAction } from "./Pages/Master/Partyformm";
import Master from "./Pages/Master/Master";
import MasterIndex from "./Pages/Master/Master-Index";
// import Unit2, { loader as unitLoader } from "./Pages/Master/Unit2";
// import UnitView, { loader as unitViewLoader } from "./Pages/Master/UnitView";
// import ItemView, { loader as itemViewLoader } from "./Pages/Master/ItemView";
// import Item, { loader as itemLoader } from "./Pages/Master/Item";
// import ItemEdit, { loader as itemEditLoader } from "./Pages/Master/ItemEdit";
// import UnitEdit, { loader as unitEditLoader } from "./Pages/Master/UnitEdit";
// import { action as unitEditAction } from "./Pages/Master/UnitForm";
// import { action as itemEditAction } from "./Pages/Master/ItemForm";
// import Activity, { loader as activityLoader } from "./Pages/Master/Activity";
// import ActivityView, {
//   loader as activityViewLoader,
// } from "./Pages/Master/ActivityView";
// import ActivityEdit, {
//   loader as activityEditLoader,
// } from "./Pages/Master/ActivityEdit";
// import { action as activityEditAction } from "./Pages/Master/ActivityForm";
// import Process, { loader as processLoader } from "./Pages/Master/Process";
// import Location, { loader as locationLoader } from "./Pages/Master/Location";
// import ProcessView, {
//   loader as processViewLoader,
// } from "./Pages/Master/ProcessView";
// import LocationView, {
//   loader as locationViewLoader,
// } from "./Pages/Master/LocationView";
// import LocationEdit, {
//   loader as locationEditLoader,
// } from "./Pages/Master/LocationEdit";
// import ProcessEdit, {
//   loader as processEditLoader,
// } from "./Pages/Master/ProcessEdit";
// import { action as locationEditAction } from "./Pages/Master/LocationForm";
// import { action as processEditAction } from "./Pages/Master/Processformm";
// import Group, { loader as groupLoader } from "./Pages/Master/Group";
// import GroupView, { loader as groupViewLoader } from "./Pages/Master/GroupView";
// import GroupEdit, { loader as groupEditLoader } from "./Pages/Master/GroupEdit";
// import { action as groupEditAction } from "./Pages/Master/GF2";
// import Size, { loader as sizeLoader } from "./Pages/Master/Size";
// import SizeView, { loader as sizeViewLoader } from "./Pages/Master/SizeView";
// import SizeEdit, { loader as sizeEditLoader } from "./Pages/Master/SizeEdit";
// import { action as sizeEditAction } from "./Pages/Master/SizeForm";

//imports for Master/product
// import Product2 from "./Pages/Master/products/Product2";
// import OperationView, {
//   loader as opLoader,
// } from "./Pages/Master/products/OperationView";
// import General from "./Pages/Master/products/General";
// import Specifications from "./Pages/Master/products/Specifications";
// import GeneralView, {
//   loader as gropLoader,
// } from "./Pages/Master/products/GeneralView";
// import GeneralEdit, {
//   loader as generalEditLoader,
//   action as generalAction,
// } from "./Pages/Master/products/GeneralEdit";
// import OperationEdit, {
//   loader as opEditLoader,
//   action as opAction,
// } from "./Pages/Master/products/OperationEdit";
// import SpecificationView, {
//   loader as specLoader,
// } from "./Pages/Master/products/SpecificationView";
// import SpecificationEdit, {
//   loader as specEditLoader,
//   action as specAction,
// } from "./Pages/Master/products/SpecificationEdit";
// import BOMView, { loader as bomLoader } from "./Pages/Master/products/BOMView";
// import BOM from "./Pages/Master/products/BOM";

// import Unitparaform from "./Allforms/master/Unitform/Unitparaform";
// import BOMEdit, {
//   loader as bomEditLoader,
//   action as bomAction,
// } from "./Pages/Master/products/BOMEdit";
// import Operation from "./Pages/Master/products/Operations";
// import Manufacturing from "./Pages/Master/products/Manufacturing";
// import ManufacturingView, {
//   loader as mfgLoader,
// } from "./Pages/Master/products/ManufacturingView";
// import ManufacturingEdit, {
//   loader as mfgEditLoader,
//   action as mfgAction,
// } from "./Pages/Master/products/ManufacturingEdit";
// import Pictures from "./Pages/Master/products/Pictures";
// import PictureView, {
//   loader as picLoader,
// } from "./Pages/Master/products/PictureView";
// import PictureEdit, {
//   loader as picEditLoader,
//   action as picAction,
// } from "./Pages/Master/products/PictureEdit";

// import sale modules...
import Sales from "./Pages/Sales/Sales";

//import of material management
import Material from "./Pages/MatMgmt/Material";
import MaterialNav from "./Pages/MatMgmt/MaterialNav";
// import GRN from "./Pages/MatMgmt/GRN";
//import GRNbkp, { action as GRNAction } from "./Pages/MatMgmt/GRNbkp";
// import GSN from "./Pages/MatMgmt/GSN";
// import MatMgmt from "./Pages/MatMgmt/MatMgmt";
// import PurchaseOrder, {
//   action as POAction,
// } from "./Pages/MatMgmt/PurchaseOrder";

//import of workorder
// import WorkOrder, {
//   loader as workorderLoader,
// } from "./Pages/work order/WorkOrder";

// import of finance
import Money from "./Pages/Money/Money";
import MoneyNav from "./Pages/Money/MoneyNav";
// import Payment, { loader as paymentLoader } from "./Pages/Money/Payment";
import WoScheduler from "./Pages/work order/WoScheduler";
// import LoginPage from "./Pages/Authentication/Login/Login.jsx";
import SignUp from "./Pages/Authentication/SignUp/SignUp.jsx";
// import { getCurrentUser } from "./Pages/Authentication/Login/Login.jsx";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./Pages/Authentication/ForgotPassword.jsx";
import ResetPassword from "./Pages/Authentication/ResetPassword.jsx";
import Gallery from "./Pages/Gallery/Gallery.jsx";
import GalleryUpload from "./Pages/Gallery/Upload.jsx";
import Size1 from "./Pages/Master/Size/Size.jsx";
import AddSize from "./Pages/Master/Size/AddSize.jsx";
import Product from "./Pages/Master/Product/Product.jsx";
import AddProduct from "./Pages/Master/Product/AddProduct.jsx";
import AddGroup from "./Pages/Master/Group/AddGroup.jsx";
import Party from "./Pages/Master/Party/Party1.jsx";
import AddParty from "./Pages/Master/Party/AddParty.jsx";
import SalesView from "./Pages/Sales/SalesView.jsx";
import Unit from "./Pages/Master/Unit/Unit.jsx";
import AddUnit from "./Pages/Master/Unit/AddUnit.jsx";
// import Journal from "./Pages/Money/Journal/Journal.jsx";
import ProductInventory from "./Pages/Inventory/Product/ProductInventory.jsx";
import Items from "./Pages/Master/Items/Items.jsx";
import AddItems from "./Pages/Master/Items/AddItems.jsx";
import Home from "./Pages/Home/Home.jsx";
import Shipment from "./Pages/Shipment/Shipment.jsx";
import Scheduler from "./Pages/Scheduler/Scheduler.jsx";
import ItemsInventory from "./Pages/Inventory/Item/Items.jsx";
import Collection from "./Pages/Gallery/Collection.jsx";
import LoginPage from "./Pages/Authentication/Login/Login.jsx";
import ProductGallery from "./Pages/Gallery/ProductGallery.jsx";
import ItemGallery from "./Pages/Gallery/ItemGallery.jsx";
import ItemCollection from "./Pages/Gallery/ItemCollection.jsx";
import ItemStock from "./Pages/Gallery/ItemStock.jsx";
import Activity from "./Pages/Master/Activity/Activity.jsx";
import AddActivity from "./Pages/Master/Activity/AddActivity.jsx";
import WorkOrder from "./Pages/WorkOrder/WorkOrder.jsx";
import WorkflowBoard from "./Pages/WorkOrder/WOCards.jsx";
import Schedular from "./Pages/Scheduler/Scheduler.jsx";
import Process from "./Pages/Master/Process/Process.jsx";
import AddProcess from "./Pages/Master/Process/AddProcess.jsx";
import Group from "./Pages/Master/Group/Group.jsx";
import Group1 from "./Pages/Master/Group/Group1.jsx";
import AddGroup1 from "./Pages/Master/Group/AddGroup1.jsx";
import AdminLogin from "./Pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./Pages/Admin/AdminPanel.jsx";
// const ProtectedRoute = () => {
//   const { isAuthenticated } = useAuth();
//   let token = localStorage.getItem("token");
//   let valid = getCurrentUser();
//   return valid ? <RootLayout /> : <LoginPage />;
// };

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <Logged />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "dashboard/",
        element: <Dashboard />,
      },
      {
        path: "shipment/",
        element: <Shipment />,
      },
      {
        path: "scheduler/",
        element: <Schedular />,
      },
      {
        path: "navigate/",
        element: <NavigationPane />,
      },
      {
        path: "master/",
        element: <Master />,
        children: [
          {
            index: true,
            element: <MasterIndex />,
          },
          {
            path: "party1/",
            element: <Party />,
          },
          {
            path: "party1/addParty",
            element: <AddParty />,
          },

          // {
          //   path: "party/",
          //   element: <Party2 />,
          //   loader: partyLoader,
          // },
          // {
          //   path: "party/:partyId/Edit",
          //   element: <PartyEdit />,
          //   loader: editLoader,
          //   action: editAction,
          // },
          // {
          //   path: "party/:partyId",
          //   element: <PartyView />,
          //   loader: viewLoader,
          // },
          // {
          //   path: "unit",
          //   element: <Unit2 />,
          //   loader: unitLoader,
          // },
          {
            path: "unit1",
            element: <Unit />,
          },
          {
            path: "unit1/addUnit",
            element: <AddUnit />,
          },
          // {
          //   path: "unit/:unitId",
          //   element: <UnitView />,
          //   loader: unitViewLoader,
          // },
          // {
          //   path: "unit/:unitId/Edit",
          //   element: <UnitEdit />,
          //   loader: unitEditLoader,
          //   action: unitEditAction,
          // },
          {
            path: "item1",
            element: <Items />,
          },
          {
            path: "item1/addItems",
            element: <AddItems />,
          },
          {
            path: "activity",
            element: <Activity />,
          },
          {
            path: "activity/addActivity",
            element: <AddActivity />,
          },
          {
            path: "process",
            element: <Process />,
          },
          {
            path: "process/addProcess",
            element: <AddProcess />,
          },
          // {
          //   path: "item",
          //   element: <Item />,
          //   loader: itemLoader,
          // },
          // {
          //   path: "item/:itemId",
          //   element: <ItemView />,
          //   loader: itemViewLoader,
          // },
          // {
          //   path: "item/:itemId/Edit",
          //   element: <ItemEdit />,
          //   loader: itemEditLoader,
          //   action: itemEditAction,
          // },
          // {
          //   path: "activity",
          //   element: <Activity />,
          //   loader: activityLoader,
          // },
          // {
          //   path: "activity/:activityId",
          //   element: <ActivityView />,
          //   loader: activityViewLoader,
          // },
          // {
          //   path: "activity/:activityId/Edit",
          //   element: <ActivityEdit />,
          //   loader: activityEditLoader,
          //   action: activityEditAction,
          // },
          // {
          //   path: "process",
          //   element: <Process />,
          //   loader: processLoader,
          // },
          // {
          //   path: "process/:processId",
          //   element: <ProcessView />,
          //   loader: processViewLoader,
          // },
          // {
          //   path: "process/:processId/Edit",
          //   element: <ProcessEdit />,
          //   loader: processEditLoader,
          //   action: processEditAction,
          // },
          // {
          //   path: "location",
          //   element: <Location />,
          //   loader: locationLoader,
          // },
          // {
          //   path: "location/:locationId",
          //   element: <LocationView />,
          //   loader: locationViewLoader,
          // },
          // {
          //   path: "location/:locationId/Edit",
          //   element: <LocationEdit />,
          //   loader: locationEditLoader,
          //   action: locationEditAction,
          // },
          // {
          //   path: "group",
          //   element: <Group />,
          //   loader: groupLoader,
          // },
          // {
          //   path: "group/:groupId",
          //   element: <GroupView />,
          //   loader: groupViewLoader,
          // },
          // {
          //   path: "group/:groupId/Edit",
          //   element: <GroupEdit />,
          //   loader: groupEditLoader,
          //   action: groupEditAction,
          // },
          {
            path: "group",
            element: <Group />,
          },
          {
            path: "group/addGroup",
            element: <AddGroup />,
          },
          {
            path: "group1",
            element: <Group1 />,
          },
          {
            path: "group1/addGroup",
            element: <AddGroup1 />,
          },
          // {
          //   path: "size",
          //   element: <Size />,
          //   loader: sizeLoader,
          // },
          {
            path: "size1",
            element: <Size1 />,
            // loader: sizeLoader,
          },
          {
            path: "size1/addForm",
            element: <AddSize />,
            // loader: sizeLoader,
          },
          // {
          //   path: "size/:sizeId",
          //   element: <SizeView />,
          //   loader: sizeViewLoader,
          // },
          // {
          //   path: "size/:sizeId/Edit",
          //   element: <SizeEdit />,
          //   loader: sizeEditLoader,
          //   action: sizeEditAction,
          // },
          {
            path: "product1",
            element: <Product />,
          },
          {
            path: "product1/addProduct",
            element: <AddProduct />,
          },
          // {
          //   path: "product",
          //   element: <Product2 />,

          //   children: [
          //     {
          //       path: "general",
          //       element: <General />,
          //     },
          //     {
          //       path: "general/:id",
          //       element: <GeneralView />,
          //       loader: gropLoader,
          //     },
          //     {
          //       path: "general/:id/Edit",
          //       element: <GeneralEdit />,
          //       loader: generalEditLoader,
          //       action: generalAction,
          //     },

          //     {
          //       path: "bom",
          //       element: <BOM />,
          //     },
          //     {
          //       path: "bom/:id",
          //       element: <BOMView />,
          //       loader: bomLoader,
          //     },
          //     {
          //       path: "bom/:id/Edit",
          //       element: <BOMEdit />,
          //       loader: bomEditLoader,
          //       action: bomAction,
          //     },
          //     {
          //       path: "operation",
          //       element: <Operation />,
          //     },
          //     {
          //       path: "operation/:id",
          //       element: <OperationView />,
          //       loader: opLoader,
          //     },
          //     {
          //       path: "operation/:id/Edit",
          //       element: <OperationEdit />,
          //       loader: opEditLoader,
          //       action: opAction,
          //     },
          //     {
          //       path: "specification",
          //       element: <Specifications />,
          //     },
          //     {
          //       path: "specification/:id",
          //       element: <SpecificationView />,
          //       loader: specLoader,
          //     },
          //     {
          //       path: "specification/:id/Edit",
          //       element: <SpecificationEdit />,
          //       loader: specEditLoader,
          //       action: specAction,
          //     },
          //     {
          //       path: "manufacturing",
          //       element: <Manufacturing />,
          //     },
          //     {
          //       path: "manufacturing/:id",
          //       element: <ManufacturingView />,
          //       loader: mfgLoader,
          //     },
          //     {
          //       path: "manufacturing/:id/Edit",
          //       element: <ManufacturingEdit />,
          //       loader: mfgEditLoader,
          //       action: mfgAction,
          //     },
          //     {
          //       path: "picture",
          //       element: <Pictures />,
          //     },
          //     {
          //       path: "picture/:id",
          //       element: <PictureView />,
          //       loader: picLoader,
          //     },
          //     {
          //       path: "picture/:id/Edit",
          //       element: <PictureEdit />,
          //       loader: picEditLoader,
          //       action: picAction,
          //     },
          //   ],
          // },
        ], //end of master children
      }, //end of master

      {
        path: "gallery/",
        element: <Gallery />,
      },
      {
        path: "gallery/productGallery",
        element: <ProductGallery />,
      },
      {
        path: "gallery/itemGallery",
        element: <ItemGallery />,
      },
      {
        path: "gallery/itemGallery/collection",
        element: <ItemCollection />,
      },
      {
        path: "gallery/productGallery/collection",
        element: <Collection />,
      },
      {
        path: "gallery/productStock",
        element: <GalleryUpload />,
      },
      {
        path: "gallery/itemStock",
        element: <ItemStock />,
      },
      // {
      //   path: "sales/",
      //   element: <Sales />,
      //   loader: salesLoader,
      //   action: salesAction,
      // }, //end of sales //end of material management
      {
        path: "sales/",
        element: <Sales />,
      },
      {
        path: "sales/salesView",
        element: <SalesView />,
      },
      {
        path: "workorder/",
        element: <WorkflowBoard />,
        // loader: workorderLoader,
      },
      {
        path: "workorder/createWorkOrder",
        element: <WorkOrder />,
        // loader: workorderLoader,
      },
      // {
      //   path: "workorder/scheduler",
      //   element: <WoScheduler />,
      // },
      //end of workorder
      {
        path: "finance/",
        element: <Money />,
        children: [
          {
            index: true,
            element: <MoneyNav />,
          },

          // {
          //   path: "payment/",
          //   element: <Payment />,
          //   loader: paymentLoader,
          //   // action: paymentAction,
          // },
          // {
          //   path: "journal/",
          //   element: <Journal />,
          // },
        ],
      },
      {
        path: "material/",
        element: <Material />,
        children: [
          {
            index: true,
            element: <MaterialNav />,
          },
          // {
          //   path: "grn/",
          //   // element: <GRN />,
          //   element: <GRN />,
          // },
          // {
          //   path: "gsn/",
          //   element: <GSN />,
          // },
          // {
          //   path: "purchaseorder/",
          //   element: <PurchaseOrder />,
          //   action: POAction,
          // },
        ],
      }, //end of material management
      {
        path: "inventory/",
        element: <Inventory />,
        children: [
          {
            index: true,
            element: <InventoryNav />,
          },
          {
            path: "productInventory",
            element: <ProductInventory />,
          },
          {
            path: "itemInventory",
            element: <ItemsInventory />,
          },
        ],
      },
    ], //end of root layout
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
]);

export default function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}
