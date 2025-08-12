import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import POLayout from "./layouts/POLayout";
import SOLayout from "./layouts/SOLayout";
import HomePage from "./pages/HomePage";
import CompletedPOPage from "./pages/CompletedPOPage";
import ApprovePOPage from "./pages/ApprovePOPage";
import ManagePoPage from "./pages/ProcurementModule/ManagePO/ManagePoPage";
// import ForgotPassword from "./pages/ForgotPassword";
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
//
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
import R7 from "./pages/ReportsModule/R7";
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
// import Inwards from "./pages/WarehouseModule/Inwards";
import ItemQr from "./pages/WarehouseModule/ItemQr";
import PrintMinLabel from "./pages/WarehouseModule/PrintMinLabel";
import BoxMarkup from "./pages/WarehouseModule/BoxMarkup";
// import BatchAlloaction from "./pages/WarehouseModule/BatchAlloaction";
import InternetStatusBar from "@/InternetStatusBar";
import { useEffect, useState } from "react";
import InwardTemplate from "./pages/WarehouseModule/Inward/InwardTemplate";
// import ChildMarkup from "./pages/WarehouseModule/ChildMarkup";
import PrintPickSlip from "./pages/WarehouseModule/PrintPickSlip";
import ViewMin from "./pages/WarehouseModule/ViewMin";
import PrintCustomerLabel from "./pages/WarehouseModule/PrintCustomerLabel";
import PrintLayout from "./layouts/PrintLayout";
// import BomLayout from "./layouts/Master/BomLayout";
import ViewFgOut from "./pages/FGOut/ViewFgOut";
import CustomerComponent from "./pages/masterModule/ComponentMap/CustomerComponent";
import ComponentMapLayout from "./layouts/Master/ComponentMapLayout";
import CreatePhyStock from "./layouts/CreatePhyStock";
import CreatePhysicalStock from "./pages/PhysicalStock/CreatePhysicalStock";
import PendingStock from "./pages/PhysicalStock/PendingStock";
import RejectedStock from "./pages/PhysicalStock/RejectedStock";
import ViewPhysicalStock from "./pages/PhysicalStock/ViewPhysicalStock";
import BomLayout from "./layouts/Master/BomLayout";
import CreatingBoxRecipe from "./pages/masterModule/Bom/CreatingBoxRecipe";
import VendorPriceLayout from "./layouts/Master/VendorPriceLayout";
import VendorPrice from "./pages/masterModule/VendorPrice/VendorPrice";
import ApproveList from "./pages/masterModule/VendorPrice/ApproveList";
import UomLayout from "./layouts/Master/UomLayout";
import UoM from "./pages/masterModule/UOM/UoM";
import Suom from "./pages/masterModule/UOM/Suom";
import SopPage from "@/pages/fileupload/SopPage";
import LogningV2 from "@/pages/WarehouseModule/LogningV2";
import ForgetPasswordNew from "./pages/ForgetPasswordNew";
import ChangePassword from "./pages/ChangePassword";
import CustomerEnquiry from "./pages/CustomerEnquiry/CustomerEnquiry";
import CustomerLayout from "./layouts/CustomerLayout";
import YourStock from "./pages/CustomerEnquiry/YourStock";
import AllItemStock from "./pages/CustomerEnquiry/AllItemStock";
import Profile from "@/components/shared/Api/Profile";
import { useSelector } from "react-redux";
import OtpPage from "@/pages/otpPage";
import RecoveryPassword from "@/pages/RecoveryPassword";
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
        {/* <AuthLayout> */}
        <LogningV2 />
        {/* </AuthLayout> */}
      </Protected>
    ),
    path: "/login",
  },
  // {
  //   element: (
  //     <Protected authentication={false}>
  //       <AuthLayout>
  //         <ForgotPassword />
  //       </AuthLayout>
  //     </Protected>
  //   ),
  //   path: "/forgot-password",
  // },
  ////
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <UomLayout>
            <UoM />
          </UomLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/uom",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <UomLayout>
            <Suom />
          </UomLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/suom",
  },
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
          <ComponentMapLayout>
            <CustomerComponent />
          </ComponentMapLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/componentMap/customer",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SopPage />
        </MainLayout>
      </Protected>
    ),
    path: "/sop",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ComponentMapLayout>
            <ComponentMap />
          </ComponentMapLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/componentMap/vendor",
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
          <BomLayout>
            <CreateBom />
          </BomLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/bom",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <BomLayout>
            <CreatingBoxRecipe />
          </BomLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/bomcreate",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <BomLayout> */}
          <EditBom />
          {/* </BomLayout> */}
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
            <ViewFgOut />
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
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <ReportaLayout>
            <R7 />
          </ReportaLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/inventory/report/r7",

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
    path: "/sales/order/shipment",
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
            <NotPermissionPage />
            {/* <SalesETransactionRegisterPage /> */}
          </MrApproval>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/mrApprovalstatus",
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
            <InwardTemplate />
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
            <NotPermissionPage />
            {/* <ChildMarkup /> */}
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
            <NotPermissionPage />
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
          <PrintLayout>
            <PrintPickSlip />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </PrintLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/PickSlip/print",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <PrintLayout>
            <PrintMinLabel />
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </PrintLayout>
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
            <NotPermissionPage />
            {/* <ItemQr /> */}
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
          <PrintLayout>
            <PrintCustomerLabel />
            {/* <ItemQr /> */}
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </PrintLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/printCustomerLabel",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <InwardLayout>
            <ViewMin />
            {/* <ItemQr /> */}
            {/* <PendingMr /> */}
            {/* <SalesETransactionRegisterPage /> */}
          </InwardLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/viewMin",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <InwardLayout> */}
          <NotPermissionPage />
          <ItemQr />
          {/* <PendingMr /> */}
          {/* <SalesETransactionRegisterPage /> */}
          {/* </InwardLayout> */}
        </MainLayout>
      </Protected>
    ),
    path: "/warehouse/pickSlip/qr",
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
          {" "}
          <ClientLayout>
            <MasterCustomerPage />
          </ClientLayout>
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
            <AddClient />
          </ClientLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/client/add",
  },
  // {
  //   element: (
  //     <Protected authentication>
  //       <MainLayout>
  //         <ClientLayout>
  //           <MasterCustomerPage />
  //         </ClientLayout>
  //       </MainLayout>
  //     </Protected>
  //   ),
  //   path: "/master/client/view",
  // },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <VendorPriceLayout>
            <VendorPrice />
          </VendorPriceLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/vendorPrice",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <VendorPriceLayout>
            <ApproveList />
          </VendorPriceLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/vendorPriceList",
  },
  ////Physical Stock///////////////
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <CreatePhyStock>
            <CreatePhysicalStock />
          </CreatePhyStock>
        </MainLayout>
      </Protected>
    ),
    path: "/physicalStock",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <CreatePhyStock>
            <PendingStock />
          </CreatePhyStock>
        </MainLayout>
      </Protected>
    ),
    path: "/pendingStock",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <CreatePhyStock>
            <RejectedStock />
          </CreatePhyStock>
        </MainLayout>
      </Protected>
    ),
    path: "/rejectedStock",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <CreatePhyStock>
            <ViewPhysicalStock />
          </CreatePhyStock>
        </MainLayout>
      </Protected>
    ),
    path: "/viewphysicalStock",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          {/* <CreatePhyStock> */}
          <CustomerEnquiry />
          {/* </CreatePhyStock> */}
        </MainLayout>
      </Protected>
    ),
    path: "/customer/customerEnquires",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <CustomerLayout>
            <YourStock />
          </CustomerLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/customer/yourStock",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <CustomerLayout>
            <AllItemStock />
          </CustomerLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/customer/allItemStock",
  },

  {
    element: (
      <Protected authentication={false}>
        <MainLayout>
          <BlockedPageRenderPage />
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
    path: "/profile",
    element: (
      <MainLayout>
        <Profile />
      </MainLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      // <MainLayout>
        <ForgetPasswordNew />
      // </MainLayout>
    ),
  },
  {
    element: (
      <Protected authentication={false}>
        <RecoveryPassword />
      </Protected>
    ),
    path: "/password-recovery",
  },
  {
    path: "/change-password",
    element: (
      <MainLayout>
        <ChangePassword />
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
  const { qrStatus } = useSelector((state) => state.auth);
  const showOtpPage = localStorage.getItem("showOtpPage");

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
  
  if (qrStatus?.isTwoStep === "Y"||showOtpPage === "Y"){
    return (
      <>
        <InternetStatusBar />
        <Toaster />
        <OtpPage />
      </>
    );
  }
  else{
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
}

export default App;
