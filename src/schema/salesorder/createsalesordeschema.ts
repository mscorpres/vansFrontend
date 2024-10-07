import { z } from "zod";

// Define schema for "headers" with custom error messages
const createSalesFormSchema = z.object({
  channels: z.string().optional(),
  customer: z.string().optional(),
  project: z.string().optional(),
  cost_center: z.string().optional(),
  delivery_term: z.string().optional(),
  payment_term: z.string().optional(),
  comment: z.string().optional(),
  customer_branch: z.string().optional(),
  customer_address: z.string().optional(),
  bill_id: z.string().optional(),
  billing_address: z.string().optional(),
  shipping_id: z.string().optional(),
  shipping_address: z.string().optional(),
  shipping_state: z.string().optional(),
  due_day: z.string().optional(),
  terms_condition: z.string().optional(),
  quotation_detail: z.string().optional(),
  shipping_pinCode: z.string().optional(),
  shipping_name: z.string().optional(),
  shipping_pan: z.string().optional(),
  shipping_gstin_uin: z.string().optional(),
  dispatch_pincode: z.string().optional(),
  pan: z.string().optional(),
  dispatch_gstin_uin: z.string().optional(),
  dispatch_address: z.string().optional(),
  bill_from_address: z.string().optional(),
  project_id: z.string().optional(),
  project_description: z.string().optional(),
  client_gst: z.string().optional(),
  company:z.string().optional(),
  gstin:z.string().optional(),
  address:z.string().optional(),
  statecode:z.string().optional(),



});

// Define schema for "materials" with custom error messages
const materialsSchema = z.object({
  so_type: z.array(z.string()).min(1, { message: "At least one SO Type is required" }),
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
