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

import Master from "./Pages/Master/Master";
import MasterIndex from "./Pages/Master/Master-Index";

// import sale modules...
import Sales from "./Pages/Sales/Sales";

//import of material management
import Material from "./Pages/MatMgmt/Material";
import MaterialNav from "./Pages/MatMgmt/MaterialNav";


// import of finance
import Money from "./Pages/Money/Money";
import MoneyNav from "./Pages/Money/MoneyNav";

import SignUp from "./Pages/Authentication/SignUp/SignUp.jsx";
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
import Color from "./Pages/Master/Color/Color.jsx";
import AddColor from "./Pages/Master/Color/AddColor.jsx";
import SKU from "./Pages/Master/SkuManagement/SKU.jsx";
import ManageSku from "./Pages/Master/SkuManagement/ManageSku.jsx";
import Dispatch from "./Pages/Shipment/Dispatch.jsx";
import Invoice from "./Pages/Shipment/Invoice.jsx";
import DetailedStock from "./Pages/Master/Items/DetailedStock.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import ViewDetailedStock from "./Pages/Inventory/Item/ViewDetailedStock.jsx";
import AddLocation from "./Pages/Master/Location/AddLocation.jsx";
import Location from "./Pages/Master/Location/Location.jsx";
import PurchaseOrder from "./Pages/Material/PurchaseOrder/PurchaseOrder.jsx";
import PurchaseOrderList from "./Pages/Material/PurchaseOrder/PurchaseOrderView.jsx";
import PurchaseOrderEdit from "./Pages/Material/PurchaseOrder/PurchaseOrderEdit.jsx";
import GoodsReceiptNote from "./Pages/Material/GRN/GRN.jsx";
import GRN from "./Pages/Material/GRN/GRN.jsx";
import GRNView from "./Pages/Material/GRN/GRNView.jsx";
import Editgrn from "./Pages/Material/GRN/GRNEdit.jsx";
import GSN from "./Pages/Material/GSN/GSN.jsx";
import GSNView from "./Pages/Material/GSN/GSNView.jsx";
import Editgsn from "./Pages/Material/GSN/GSNEdit.jsx";
import ProcessGallery from "./Pages/Gallery/ProcessGallery/ProcessGallery.jsx";
import ActivityGallery from "./Pages/Gallery/ActivityGallery/ActivityGallery.jsx";
import EditProcess from "./Pages/Master/Process/EditProcess.jsx";
import WorkOrderCards from "./Pages/WorkOrder/WOSingle.jsx";
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
        path: "profile/",
        element: <Profile />,
      },
      {
        path: "shipment",
        element: <Shipment />,
      },
      {
        path: "shipment/dispatch",
        element: <Dispatch />,
      },
      {
        path: "shipment/invoice",
        element: <Invoice />,
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

          {
            path: "unit1",
            element: <Unit />,
          },
          {
            path: "unit1/addUnit",
            element: <AddUnit />,
          },

          {
            path: "item1",
            element: <Items />,
          },
          {
            path: "item1/detailed-stock",
            element: <DetailedStock />,
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
          {
            path: "process/editProcess/:id",
            element: <EditProcess />,
          },
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

          {
            path: "color",
            element: <Color />,
            // loader: sizeLoader,
          },
          {
            path: "color/addColor",
            element: <AddColor />,
            // loader: sizeLoader,
          },
          {
            path: "size1",
            element: <Size1 />,
          },
          {
            path: "location",
            element: <Location />,
          },
          {
            path: "location/addLocation",
            element: <AddLocation />,
          },
          {
            path: "size1/addForm",
            element: <AddSize />,
          },
          {
            path: "skuManagement",
            element: <SKU />,
          },
          {
            path: "skuManagement/editSku",
            element: <ManageSku />,
          },

          {
            path: "product1",
            element: <Product />,
          },
          {
            path: "product1/addProduct",
            element: <AddProduct />,
          },
        ], //end of master children
      }, //end of master

      {
        path: "gallery/",
        element: <Gallery />,
      },
      {
        path: "gallery/processGallery",
        element: <ProcessGallery />,
      },
      {
        path: "gallery/activityGallery",
        element: <ActivityGallery />,
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
      },
      {
        path: "workorder/:id",
        element: <WorkOrderCards />,
      },
      {
        path: "workorder/createWorkOrder",
        element: <WorkOrder />,
      },

      {
        path: "finance/",
        element: <Money />,
        children: [
          {
            index: true,
            element: <MoneyNav />,
          },
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
          {
            path: "grn/",
            element: <GRN />,
          },
          {
            path: "grnView/",
            element: <GRNView />,
          },
          {
            path: "edit-grn/:id",
            element: <Editgrn />,
          },
          {
            path: "gsn/",
            element: <GSN />,
          },
          {
            path: "gsnView/",
            element: <GSNView />,
          },
          {
            path: "edit-gsn/:id",
            element: <Editgsn />,
          },
          {
            path: "purchaseorder/",
            element: <PurchaseOrder />,
          },
          {
            path: "purchaseOrderView/",
            element: <PurchaseOrderList />,
          },
          {
            path: "edit-purchase-order/:id",
            element: <PurchaseOrderEdit />,
          },
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
          {
            path: "itemInventory/stock-entries/:itemId",
            element: <ViewDetailedStock />,
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
