import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import POLayout from "./layouts/POLayout";
import SOLayout from "./layouts/SOLayout";
import HomePage from "./pages/HomePage";
import CreatePoPage from "./pages/ProcurementModule/CreatePoPage";
import CompletedPOPage from "./pages/CompletedPOPage";
import ApprovePOPage from "./pages/ApprovePOPage";
import ManagePoPage from "./pages/ProcurementModule/ManagePO/ManagePoPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import RegisterSalesOrderPage from "./pages/salesModule/RegisterSalesOrderPage";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./font.css";
import Protected from "./components/Protected";
import Custom404Page from "./pages/Custom404Page";
import SalesShipmentPage from "./pages/salesModule/SalesShipmentPage";
import SalesInvoicePage from "./pages/salesModule/SalesInvoicePage";
import AllocatedInvoicesPage from "./pages/salesModule/AllocatedInvoicesPage";
import SalesETransactionRegisterPage from "./pages/salesModule/SalesETransactionRegisterPage";
import MasterProductLayout from "./layouts/MasterProductLayout";
import MasterProductFgPage from "./pages/masterModule/MasterProductFgPage";
import MasterProductSfgPage from "./pages/masterModule/MasterProductSfgPage";
import MasterAddressLayout from "./layouts/MasterAddressLayout";
import MasterBillingAddressPage from "./pages/masterModule/MasterBillingAddressPage";
import MasterShippingAddressPage from "./pages/masterModule/MasterShippingAddressPage";
import BlockedPageRenderPage from "./pages/BlockedPageRenderPage";
import MasterCustomerPage from "./pages/masterModule/MasterCustomerPage";
import NotPermissionPage from "./pages/NotPermissionPage";
import CreateSalesOrderPage from "./pages/salesModule/CreateSalesOrderPage";
import ComponentsLayout from "./layouts/Master/ComponentsLayout";
import Material from "./pages/masterModule/Components/Material";
import Service from "./pages/masterModule/Components/Service";
import ComponentMap from "./pages/masterModule/ComponentMap/ComponentMap";
import Product from "./pages/masterModule/Product/Product";
import Groups from "./pages/masterModule/Groups/Groups";
import Locations from "./pages/masterModule/Locations/Locations";
import CreateBom from "./pages/masterModule/Bom/CreateBom";
import AddClient from "./pages/masterModule/Client/AddClient";
import VendorList from "./pages/masterModule/Vendor/VendorList";
import PoCreateTemplate from "./pages/ProcurementModule/PoCreateTemplate";
import PendingFg from "./pages/FGInwarding/PendingFg";
import CompeletedFg from "./pages/FGInwarding/CompletedFg";
import FgLayout from "./layouts/Master/FgLayout";
import FgLayoutOut from "./layouts/Master/FgLayoutOut";
import FgOutCreate from "./pages/FGOut/FgOutCreate";
import CreatePPr from "./pages/ProductionModule/PPR/CreatePPr";
import QueryLayout from "./layouts/QueryLayout";
import Q1 from "./pages/Querys/Q1";
import Q2 from "./pages/Querys/Q2";
import Q3 from "./pages/Querys/Q3";
import MinRegister from "./pages/ReportsModule/MinRegister";
import MINReportLayout from "./layouts/MINReportLayout";
import TransactionOut from "./pages/ReportsModule/TransactionOut";
import ReportLayout from "./layouts/ReportLayout";
import ReportaLayout from "./layouts/ReportaLayout";
import R1 from "./pages/ReportsModule/R1";
import R2 from "./pages/ReportsModule/R2";
import R5 from "./pages/ReportsModule/R5";
import R4 from "./pages/ReportsModule/R4";
import R3 from "./pages/ReportsModule/R3";
import R6 from "./pages/ReportsModule/R6";
import ClientLayout from "./layouts/Master/ClientLayout";
import Hsn from "./pages/masterModule/HSN/Hsn";
import EditBom from "./pages/masterModule/Bom/EditBom";
import CreateEwayBill from "@/config/agGrid/invoiceModule/CreateEwayBill";
import MrApproval from "./layouts/MrApProval";
import PendingMr from "./pages/WarehouseModule/PendingMr/PendingMr";
import TransferBox from "./pages/WarehouseModule/PendingMr/TransferBox";
import PickSlipLayout from "./layouts/PickSlipLayout";
import PickSlip from "./pages/WarehouseModule/PickSlip/PickSlip";
import InwardLayout from "./layouts/InwardLayout";
import Inwards from "./pages/WarehouseModule/Inwards";
import ItemQr from "./pages/WarehouseModule/ItemQr";
import PrintMinLabel from "./pages/WarehouseModule/PrintMinLabel";
import BoxMarkup from "./pages/WarehouseModule/BoxMarkup";
import BatchAlloaction from "./pages/WarehouseModule/BatchAlloaction";
import InternetStatusBar from "@/InternetStatusBar";
import { useEffect, useState } from "react";
// Define the authenticated routes
const router = createBrowserRouter([
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Protected>
    ),
    path: "/",
  },
  {
    element: (
      <Protected authentication={false}>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Protected>
    ),
    path: "/login",
  },
  {
    element: (
      <Protected authentication={false}>
        <AuthLayout>
          <ForgotPassword />
        </AuthLayout>
      </Protected>
    ),
    path: "/forgot-password",
  },
  ////
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ComponentsLayout>
            <Material />
          </ComponentsLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/material",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ComponentsLayout>
            <Service />
          </ComponentsLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/service",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <ComponentsLayout> */}
          <ComponentMap />
          {/* </ComponentsLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/master/componentMap/map",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <ComponentsLayout> */}
          <Product />
          {/* </ComponentsLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/master/product",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <ComponentsLayout> */}
          <Groups />
          {/* </ComponentsLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/master/groups",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <ComponentsLayout> */}
          <Locations />
          {/* </ComponentsLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/master/location",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <Hsn />
        </MainLayout>
      </Protected>
    ),
    path: "/master/hsn",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <ComponentsLayout> */}
          <CreateBom />
          {/* </ComponentsLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/master/bom",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <ComponentsLayout> */}
          <EditBom />
          {/* </ComponentsLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/master/bom/edit/:id",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <ComponentsLayout> */}
          <VendorList />
          {/* </ComponentsLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/master/vendor",
  },

  //////////

  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <PoCreateTemplate />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/create-po",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <PoCreateTemplate />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/create-po/edit/:id",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <PoCreateTemplate />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/create-po/approve/:id",
  },

  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <ManagePoPage />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/manage-po",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <ApprovePOPage />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/approve-po",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <CompletedPOPage />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/completed-po",
  },
  ///////////////fg
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <FgLayout>
            <PendingFg />
          </FgLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/fg/pending",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <FgLayout>
            <CompeletedFg />
          </FgLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/fg/completed",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <FgLayoutOut>
            <FgOutCreate />
          </FgLayoutOut>
        </MainLayout>
      </Protected>
    ),
    path: "/fgOut/create",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <FgLayoutOut>
            <CompeletedFg />
          </FgLayoutOut>
        </MainLayout>
      </Protected>
    ),
    path: "/fgOut/view",
  },
  //////////////////////////////////////////
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <CreatePPr />
        </MainLayout>
      </Protected>
    ),
    path: "/production/ppr/create",
  },
  ///////////////////////////////////////////////
  {
    element: (
      <Protected authentication>
        {" "}
        <MainLayout>
          <QueryLayout>
            <Q1 />
          </QueryLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/query/q1",
  },
  {
    element: (
      <Protected authentication>
        {" "}
        <MainLayout>
          <QueryLayout>
            <Q2 />
          </QueryLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/query/q2",
  },
  {
    element: (
      <Protected authentication>
        {" "}
        <MainLayout>
          <QueryLayout>
            <Q3 />
          </QueryLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/query/q3",
  },
  ///////////////////////////////////////////////
  {
    element: (
      <Protected authentication>
        {" "}
        <MainLayout>
          <MINReportLayout>
            <MinRegister />
          </MINReportLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/min",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportLayout>
            <TransactionOut />
          </ReportLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/r1",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MINReportLayout>
            <TransactionOut />
          </MINReportLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/transaction",
  },
  ////////////////////////////////////
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportaLayout>
            <R1 />
          </ReportaLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/report/r1",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportaLayout>
            <R2 />
          </ReportaLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/report/r2",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportaLayout>
            <R3 />
          </ReportaLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/report/r3",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportaLayout>
            <R4 />
          </ReportaLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/report/r4",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportaLayout>
            <R5 />
          </ReportaLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/report/r5",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportaLayout>
            <R6 />
          </ReportaLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/report/r6",
  },
  ///////////////////////////////////////////////
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <CreateSalesOrderPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/create",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <CreateSalesOrderPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/update/:id",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <RegisterSalesOrderPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/register",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <SalesShipmentPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/shipments",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <SalesInvoicePage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/invoice",
  },
  {
    element: (
      <Protected authentication>
        <CreateEwayBill />
      </Protected>
    ),
    path: "/salesOrder/e-way/:id",
  },
  {
    element: (
      <Protected authentication>
        <CreateEwayBill />
      </Protected>
    ),
    path: "/salesOrder/e-inv/:id",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <AllocatedInvoicesPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/allocated",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <SalesETransactionRegisterPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/e-transaction-register",
  },

  //master moduls
  // {
  //   element: (
  //     <Protected authentication>
  //       <MainLayout>
  //         <MasterProductLayout>
  //           <MasterProductFgPage />
  //         </MasterProductLayout>
  //       </MainLayout>
  //     </Protected>
  //   ),
  //   path: "/master/product/fg",
  // },
  // {
  //   element: (
  //     <Protected authentication>
  //       <MainLayout>
  //         <MasterProductLayout>
  //           <MasterProductSfgPage />
  //         </MasterProductLayout>
  //       </MainLayout>
  //     </Protected>
  //   ),
  //   path: "/master/product/sfg",
  // },
  //wareHouse
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MrApproval>
            <PendingMr />
            {/* <SalesETransactionRegisterPage /> */}
          </MrApproval>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/mrApproval",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MrApproval>
            <PendingMr />
            {/* <SalesETransactionRegisterPage /> */}
          </MrApproval>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/status",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <TransferBox />
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/transfer",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <PickSlipLayout>
            <PickSlip />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </PickSlipLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/pickSlip",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <Inwards />
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/inward",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <BoxMarkup />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/boxMarkup",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <ItemQr />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/childMarkup",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <BatchAlloaction />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/batchAllocation",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <ItemQr />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/PickSlip",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <PrintMinLabel />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/PickSlip/print",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <PrintMinLabel />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/min/print",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <ItemQr />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/itemQr",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <PrintMinLabel />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/inward",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterAddressLayout>
            <MasterBillingAddressPage />
          </MasterAddressLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/billing-address",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterAddressLayout>
            <MasterShippingAddressPage />
          </MasterAddressLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/shipping-address",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterCustomerPage />
        </MainLayout>
      </Protected>
    ),
    path: "/master/customer",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ClientLayout>
            <AddClient />{" "}
          </ClientLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/client/add",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ClientLayout>
            <MasterCustomerPage />
          </ClientLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/client/view",
  },
  {
    element: (
      <Protected authentication={false}>
        <MainLayout>
          <NotPermissionPage />
        </MainLayout>
      </Protected>
    ),
    path: "/not-permission",
  },

  {
    path: "/warning",
    element: (
      <MainLayout>
        <BlockedPageRenderPage />
      </MainLayout>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <Custom404Page />
      </MainLayout>
    ),
  },
]);

// Define the unauthenticated routes

function App() {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true); // User is offline, apply blur effect
    };

    const handleOnline = () => {
      setIsOffline(false); // User is online, remove blur effect
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Check initial connection status
    if (!navigator.onLine) {
      setIsOffline(true); // If the user is offline when the app loads
    }

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
  return (
    <>
      <InternetStatusBar />
      <Toaster />
      <div
        className={` ${
          isOffline ? "filter blur-sm grayscale pointer-events-none" : ""
        }`}
      >
        {/* Router for different pages */}
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
