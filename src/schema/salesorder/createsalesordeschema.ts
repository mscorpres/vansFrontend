import { z } from "zod";

// Define schema for "headers" with custom error messages

const billFrom = z.object({
  address1: z.string({ required_error: "Address Line 1 is required" }),
  address2: z.string().optional(),
  billFromId: z.string({ required_error: "BillFromId is required" }),
  gstin: z.string({ required_error: "GST is required" }),
  pan: z.string({ required_error: "PAN is required" }),
  state: z.string().optional(),
});

const billTo = z.object({
  address1: z.string({ required_error: "Address Line 1 is required" }),
  address2: z.string({ required_error: "Address Line 2 is required" }),
  branch: z.string({ required_error: "Branch is required" }),
  gst: z.string({ required_error: "GST is required" }),
  pincode: z.string({ required_error: "PIN Code is required" }),
  state: z.string({ required_error: "State is required" }),
});

const shipTo = z.object({
  address1: z.string({ required_error: "Address Line 1 is required" }),
  address2: z.string({ required_error: "Address Line 2 is required" }),
  company: z.string({ required_error: "Company is required" }),
  gst: z.string({ required_error: "GST is required" }),
  panno: z.string({ required_error: "PAN Number is required" }),
  pincode: z.string({ required_error: "PIN Code is required" }),
  state: z.string({ required_error: "State is required" }),
});

const currencySchema = z.object({
  currency: z.string({ required_error: "Currency is required" }),
  exchange_rate: z.string({ required_error: "Exchange Rate is required" }),
});

const createSalesFormSchema = z.object({
  billFrom: billFrom,
  billTo: billTo,
  shipTo: shipTo,
  customer_type: z.string({ required_error: "Customer Type is required" }),
  customer_code: z.string({ required_error: "Customer Code is required" }),
  customer_name: z.string().optional(),
  costcenter_name: z.string().optional(),
  billIdName: z.string().optional(),
  po_number: z.string({ required_error: "PO Number is required" }),
  po_date: z.string({ required_error: "PO Date is required" }),
  due_date: z.string({ required_error: "PO Date is required" }),
  reference_no: z.string({ required_error: "Reference Number is required" }),
  ref_date:z.string({required_error:"Reference Date is mandatory"}),
  currency: currencySchema,
  costcenter: z.string({ required_error: "Cost Center is required" }),
  project_name: z.string().optional(),
  paymentterms: z.string().optional(),
  quotationdetail: z.string().optional(),
  so_comment: z.string().optional(),
  termscondition: z.string().optional(),
  terms_of_delivery:z.string().optional(),
  other_ref:z.string().optional(),
  supply_city:z.string().optional(),
});

// Define schema for "materials" with custom error messages
const materialsSchema = z.object({
  so_type: z
    .array(z.string())
    .min(1, { message: "At least one SO Type is required" }),
  items: z.array(z.string()).optional().nullable(),
  qty: z.array(z.number()).optional().nullable(),
  hsn: z.array(z.string()).optional().nullable(),
  price: z.array(z.number()).optional().nullable(),
  gst_rate: z.array(z.number()).optional().nullable(),
  gst_type: z.array(z.string()).optional().nullable(),
  currency: z.array(z.string()).optional().nullable(),
  exchange_rate: z.array(z.number()).optional().nullable(),
  due_date: z.array(z.string()).optional().nullable(), // Ensure format validation as needed
  remark: z.array(z.string()).optional().nullable(),
});
export { createSalesFormSchema, materialsSchema };
