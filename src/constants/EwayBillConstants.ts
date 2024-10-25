import { ColDef } from "ag-grid-community";
import { z } from "zod";


const columnDefs: ColDef[] = [
    { headerName: "Item Name", field: "item_name", width: 500,cellRenderer: "truncateCellRenderer", },
    { headerName: "Part No", field: "item_part_no" },
    { headerName: "HSN", field: "item_hsncode" },
    { headerName: "Qty", field: "item_qty" },
    { headerName: "Rate", field: "item_rate" },
    { headerName: "Discount (%)", field: "item_discount" },
    { headerName: "GST Rate", field: "item_gst_rate" },
    { headerName: "GST Type", field: "item_gst_type" },
    { headerName: "CGST", field: "item_cgst" },
    { headerName: "SGST", field: "item_sgst" },
    { headerName: "IGST", field: "item_igst" },
    { headerName: "Taxable Amount", field: "item_value" },
  ];

const supplyTypeOptions = [
    {
        value: "O",
        label: "Outward",
    },
    {
        value: "I",
        label: "Inward",
    },
  ];
  const subsupplytype = [
    { value: "1", label: "Supply" },
    { value: "2", label: "Import" },
    { value: "3", label: "Export" },
    { value: "4", label: "Job Work" },
    { value: "5", label: "For Own Use" },
    { value: "6", label: "Job Work Return" },
    { value: "7", label: "Sale Return" },
    { value: "8", label: "Others" },
    { value: "9", label: "SKD/CKD/Lots" },
    { value: "10", label: "Line Sales" },
    { value: "11", label: "Recipient Not Known" },
    { value: "12", label: "Exhibition or Fairs" },
  ]
  
  const subOptions = [
    { value: "B2B", label: "Business to Business" },
    { value: "SEZWP", label: "SEZ with payment" },
    { value: "SEZWOP", label: "SEZ without payment" },
    { value: "EXPWP", label: "Export with Payment" },
    { value: "EXPWOP ", label: "Export without payment" },
    { value: "DEXP", label: "Deemed Export" },
  ];
  
  const docType = [
    { value: "INV", label: "Tax Invoice" },
    { value: "BIL", label: "Bill of Supply" },
    { value: "BOE", label: "Bill of Entry" },
    { value: "CHL", label: "Delivery Challan" },
    { value: "OTH", label: "Others" },
  ];
  
  const transportationMode = [
    { value: "1", label: "Road" },
    { value: "2", label: "Rail" },
    { value: "3", label: "Air" },
    { value: "4", label: "Ship" },
    { value: "5", label: "In Transit" },
  ];
 
  const reverseOptions = [
    {
      label: "Yes",
      value: "Y",
    },
    {
      label: "No",
      value: "N",
    },
  ];
  
  

  const vehicleTypeOptions = [
    {
      label: "Regular",
      value: "R",
    },
    {
      label: "ODC(Over Dimentional Cargo)",
      value: "O",
    },
  ];
  const transactionTypeOptions = [
    {
      label: "Regular",
      value: "1",
    },
    {
      label: "Bill To - Ship To",
      value: "2",
    },
    {
      label: "Bill From - Dispatch From",
      value: "3",
    },
    {
      label: "Combination of 2 & 3",
      value: "4",
    },
  ];




const stateSchema = z.object({
  code: z.string(),
  name: z.string(),
});

const header= z.object({
  documentType: z.string({ required_error: "Document Type is required" }),
  supplyType: z.string({ required_error: "Supply Type is required" }),
  subSupplyType: z.string({ required_error: "Sub Supply Type is required" }),
  documentNo: z.string({ required_error: "Document No is required" }),
  documentDate: z.string({ required_error: "Document Date is required" }),
  transactionType: z.enum(["1", "2", "3", "4"], {
    required_error: "Transaction Type is required",
  }),
  reverseCharge: z.enum(["Y", "N"]).optional(),
  igstOnIntra: z.enum(["Y", "N"]).optional(),
});

const headerEInv= z.object({
  documentType: z.string({ required_error: "Document Type is required" }),
  supplyType: z.string({ required_error: "Supply Type is required" }),
  documentNo: z.string({ required_error: "Document No is required" }),
  documentDate: z.string({ required_error: "Document Date is required" }),
  transactionType: z.enum(["1", "2", "3", "4"], {
    required_error: "Transaction Type is required",
  }),
  reverseCharge: z.enum(["Y", "N"]).optional(),
  igstOnIntra: z.enum(["Y", "N"]).optional(),
});

const billFrom = z.object({
  gstin: z.string({ required_error: "GSTIN is required" }),
  legalName: z.string({ required_error: "Legal Name is required" }),
  tradeName: z.string().optional(),
  addressLine1: z.string({ required_error: "Address Line 1 is required" }),
  addressLine2: z.string().optional(),
  location: z.string({ required_error: "Location is required" }),
  state: stateSchema.refine((val) => val.code && val.name, {
    message: "State is required",
  }),
  pincode: z.string({ required_error: "Pincode is required" }),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const billTo = z.object({
  gstin: z.string({ required_error: "GSTIN is required" }),
  legalName: z.string({ required_error: "Legal Name is required" }),
  addressLine1: z.string({ required_error: "Address Line 1 is required" }),
  addressLine2: z.string().optional(),
  location: z.string({ required_error: "Location is required" }),
  state: stateSchema.refine((val) => val.code && val.name, {
    message: "State is required",
  }),
  pincode: z.string({ required_error: "Pincode is required" }),
  // email: z.string({ required_error: "Email is required" }),
  // email: z.string().optional(),
  phone: z.union([z.string().optional(), z.null()]),
});

const dispatchFrom = z.object({
  legalName: z.string({ required_error: "Legal Name is required" }),
  addressLine1: z.string({ required_error: "Address Line 1 is required" }),
  addressLine2: z.string().optional(),
  location: z.string({ required_error: "Location is required" }),
  state: stateSchema.refine((val) => val.code && val.name, {
    message: "State is required",
  }),
  pincode: z.string({ required_error: "Pincode is required" }),
});

const shipTo = z.object({
  gstin: z.string({ required_error: "GSTIN is required" }),
  legalName: z.string({ required_error: "Legal Name is required" }),
  tradeName: z.string().optional(),
  addressLine1: z.string({ required_error: "Address Line 1 is required" }),
  addressLine2: z.string().optional(),
  location: z.string({ required_error: "Location is required" }),
  state: stateSchema.refine((val) => val.code && val.name, {
    message: "State is required",
  }),
  pincode: z.string({ required_error: "Pincode is required" }),
});

const ewaybillDetailsForInvoice = z.object({
  transporterId: z.string().optional(),
  transporterName: z.string().optional(),
  tradeName: z.string().optional(),
  transMode: z.string().optional(),
  transporterDocNo: z.string().optional(),
  transporterDate: z.string().optional(),
  vehicleNo: z.string().optional(),
  vehicleType: z.string().optional(),
  transDistance: z.string({ required_error: "Trans Distance is required" }),
  });

  const ewaybillDetailsForBill = z.object({
    transporterId: z.string({ required_error: "Transporter ID is required" }),
    transporterName: z.string({ required_error: "Transporter Name is required" }),
    transMode: z.string({ required_error: "Transport Mode is required" }),
    transporterDocNo: z.string().optional(),
    // transporterDate: z.string({ required_error: "Transporter Date is required" }),
    transporterDate:z.string().optional(),
    vehicleNo: z.string({ required_error: "Vehicle Number is required" }),
    vehicleType: z.string({ required_error: "Vehicle Type is required" }),
    transDistance: z.string({ required_error: "Trans Distance is required" }), // Mandatory in both
  });

// Main schema
const eInvoiceSchema = z.object({
  header: headerEInv,
  billFrom: billFrom,
  billTo: billTo,
  dispatchFrom: dispatchFrom,
  shipTo: shipTo,
  ewaybillDetails: ewaybillDetailsForInvoice
});

const ewayBillSchema = z.object({
  header: header,
  billFrom: billFrom,
  billTo: billTo,
  dispatchFrom: dispatchFrom,
  shipTo: shipTo,
  ewaybillDetails: ewaybillDetailsForBill
});

const debitNoteHeader = headerEInv.extend({
  debitNo: z.string().optional(),
  other_ref: z.string({ required_error: "Please enter Other Reference" }),
});

const creditNoteHeader = headerEInv.extend({
  creditNo: z.string().optional(),
  other_ref: z.string({ required_error: "Please enter Other Reference" }),
});

const debitNoteSchema = eInvoiceSchema.extend({
  header: debitNoteHeader,
})

const creditNoteSchema = eInvoiceSchema.extend({
  header: creditNoteHeader,
})


  export { supplyTypeOptions, subOptions , subsupplytype,docType, transportationMode, vehicleTypeOptions, transactionTypeOptions ,columnDefs ,eInvoiceSchema,debitNoteSchema,creditNoteSchema,reverseOptions,ewayBillSchema};