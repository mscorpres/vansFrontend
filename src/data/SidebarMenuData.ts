import { SidebarMenuLinkType } from "@/types/MainLayout";

// export const sidebarMenulinklist: SidebarMenuLinkType[] = [
//   { name: "Dashboard", path: "/" },
//   {
//     name: "Material Management",
//     subMenu: [
//       {
//         name: "Master",
//         subMenu: [
//           {
//             name: "Components",

//             subMenu: [
//               { name: "Material", path: "/master/material" },
//               { name: "Service", path: "/not-permission" },
//             ],
//           },
//           { name: "Component Map", path: "/not-permission" },
//           { name: "Products", path: "/not-permission" },
//           { name: "HSN map", path: "/not-permission" },
//           { name: "Groups", path: "/not-permission" },
//           { name: "Locations", path: "/not-permission" },
//           { name: "Billing address", path: "/not-permission" },
//           { name: "Shipping address", path: "/not-permission" },
//           {
//             name: "Bill Of Material",
//             subMenu: [
//               { name: "Create Bom", path: "/not-permission" },
//               { name: "Manage Bom", path: "/not-permission" },
//             ],
//           },
//           {
//             name: "Vender / Suppliar",
//             subMenu: [{ name: "Add / Rectify", path: "/not-permission" }],
//           },
//           {
//             name: "Customer / Client",
//             subMenu: [
//               { name: "Add", path: "/not-permission" },
//               { name: "View", path: "/not-permission" },
//             ],
//           },
//         ],
//       },
//       {
//         name: "Procurement",
//         subMenu: [
//           { name: " Create PO", path: "/not-permission" },
//           { name: "Manage PO", path: "/not-permission" },
//           { name: "Compleated PO", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "Sales Order",
//         subMenu: [
//           { name: "Create", path: "/sales/order/create" },
//           { name: "Register", path: "/sales/order/register" },
//           { name: "Shipment", path: "/sales/order/shipments" },
//           { name: "Invoice", path: "/sales/order/invoice" },
//           { name: "Allocated Invoices", path: "/sales/order/allocated" },
//           {
//             name: "E Transaction Invoices",
//             path: "/sales/order/e.transaction-register",
//           },
//         ],
//       },
//       {
//         name: "Warehouse",
//         subMenu: [
//           { name: "MR Approval", path: "/not-permission" },
//           { name: "Inward", path: "/not-permission" },
//           { name: "Transfer", path: "/not-permission" },
//           { name: "Pic Slip", path: "/not-permission" },
//           { name: "Batch Allocation", path: "/not-permission" },
//         ],
//       },
//       {
//         name: " FG(s) Inwarding",
//         subMenu: [
//           { name: "Pending FG(s)", path: "/not-permission" },
//           { name: "Complete FG(s)", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "FG(s) OUT",
//         subMenu: [
//           { name: "Create FG(s) OUT", path: "/not-permission" },
//           { name: "View FG(s) OUT", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "Production",
//         subMenu: [{ name: "PPC", path: "/not-permission" }],
//       },
//       {
//         name: "Report (s)",
//         subMenu: [
//           { name: "Inventory report", path: "/not-permission" },
//           { name: "Printing", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "   Query (s)",
//         subMenu: [{ name: "Q1-Q2", path: "/not-permission" }],
//       },
//       {
//         name: " Physical Stock",
//         subMenu: [
//           { name: "Create Physical Stock", path: "/not-permission" },
//           { name: "View Physical Stock", path: "/not-permission" },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Customer Management",
//     subMenu: [{ name: " Customer Enquiry", path: "/not-permission" }],
//   },
// ];
export const materialmenu = [
  {
    name: "Master",
    subMenu: [
      {
        name: "UOM",
        subMenu: [
          { name: "UOM", path: "/master/uom" },
          { name: "SOQ", path: "/master/suom" },
        ],
      },
      {
        name: "Components",
        subMenu: [
          { name: "Material", path: "/master/material" },
          { name: "Service", path: "/master/service" },
        ],
      },
      {
        name: "Component Map",

        subMenu: [
          { name: "Vendor", path: "/master/componentMap/vendor" },
          { name: "Customer", path: "/master/componentMap/customer" },
        ],
      },
      { name: "Products", path: "/master/product" },
      { name: "HSN map", path: "/master/hsn" },
      { name: "Groups", path: "/master/groups" },
      { name: "Locations", path: "/master/location" },
      { name: "Billing address", path: "/master/billing-address" },
      { name: "Shipping address", path: "/master/shipping-address" },
      {
        name: "Bill Of Material",
        subMenu: [
          { name: "Bom", path: "/master/bom" },
          // { name: "Manage Bom", path: "/not-permission" },
        ],
      },
      {
        name: "Vender / Supplier",
        subMenu: [{ name: "Add / Rectify", path: "/master/vendor" }],
      },
      {
        name: "Customer / Client",
        subMenu: [
          { name: "Add", path: "/master/client/add" },
          { name: "View", path: "/master/customer" },
        ],
      },
      {
        name: "Vendor Price",
        subMenu: [
          { name: "Vendor Price", path: "/master/vendorPrice" },
          { name: "Approve List", path: "/master/vendorPriceList" },
        ],
      },
      // {
      //   name: "Customer / Client",
      //   path: "/master/customer",
      // },
    ],
  },
  {
    name: "Procurement",
    subMenu: [
      { name: " Create PO", path: "/create-po" },
      { name: "Manage PO", path: "/manage-po" },
      { name: "Completed PO", path: "/completed-po" },
      { name: "Approve PO", path: "/approve-po" },
    ],
  },
  {
    name: "Sales Order",
    subMenu: [
      { name: "Create Sales Order", path: "/sales/order/create" },
      { name: "Sales Order Register", path: "/sales/order/register" },
      { name: "Sales Order Shipment", path: "/sales/order/shipment" },
      { name: "Invoice Register", path: "/sales/order/invoice" },
      // { name: "Allocated Invoices", path: "/sales/order/allocated" },
      {
        name: "e-Transaction Invoices",
        path: "/sales/order/e-transaction-register",
      },
    ],
  },
  {
    name: "Warehouse",
    subMenu: [
      { name: "MR Approval", path: "/warehouse/mrApproval" },
      { name: "Inward", path: "/warehouse/inward" },
      { name: "Transfer", path: "/warehouse/transfer" },
      { name: "Pick Slip", path: "/warehouse/pickSlip" },
      { name: "Batch Allocation", path: "/warehouse/batchAllocation" },
    ],
  },
  {
    name: " FG(s) Inwarding",
    subMenu: [
      { name: "Pending FG(s)", path: "/fg/pending" },
      { name: "Complete FG(s)", path: "/fg/completed" },
    ],
  },
  {
    name: "FG(s) OUT",
    subMenu: [
      { name: "Create FG(s) OUT", path: "/fgOut/create" },
      { name: "View FG(s) OUT", path: "/fgOut/view" },
    ],
  },
  // {
  //   name: "Production",
  //   subMenu: [
  //     {
  //       name: "PPR",
  //       subMenu: [
  //         { name: "Material", path: "/master/material" },
  //         { name: "Service", path: "/master/service" },
  //       ],
  //     },
  //     {
  //       name: "Material Requisition",
  //       subMenu: [
  //         { name: "Material", path: "/master/material" },
  //         { name: "Service", path: "/master/service" },
  //       ],
  //     },
  //     {
  //       name: "Production & Plan",
  //       subMenu: [
  //         { name: "Create PPR", path: "/production/ppr/create" },
  //         { name: "Pending PPR", path: "/production/ppr/pending" },
  //         { name: "Completed PPR", path: "/production/ppr/completed" },
  //       ],
  //     },
  //   ],
  // },
  {
    name: "Report (s)",
    subMenu: [
      {
        name: "Inventory report",
        // path: "/not-permission",
        subMenu: [
          { name: "MIN Register", path: "/inventory/min" },
          { name: "Reports R1-R6", path: "/inventory/report/r1" },
        ],
      },
      { name: "Printing", path: "/warehouse/min/print" },
    ],
  },
  {
    name: "Query (s)",
    subMenu: [{ name: "Q1-Q3", path: "/query/q1" }],
  },
  {
    name: " Physical Stock",
    subMenu: [
      { name: "Create Physical Stock", path: "/physicalStock" },
      { name: "View Physical Stock", path: "/viewphysicalStock" },
    ],
  },
];
export const printMenu = [
  { name: " MIN Label", path: "/warehouse/min/print" },
  { name: "Pick Slip", path: "/warehouse/PickSlip/print" },
  { name: " Customer Label", path: "/warehouse/printCustomerLabel" },
];
export const customerEnquiry = [
  { name: "Customer Enquiry", path: "/customer/customerEnquires" },
];
export const customerEnquiryClient = [
  { name: "Customer Enquiry", path: "/customer/yourStock" },
  { name: "All Item Stock", path: "/customer/allItemStock" },
];
export const useFullLinks = [
  { name: " Forgot password", path: "/forgot-password" },
  { name: " Change password", path: "/change-password" },
];
