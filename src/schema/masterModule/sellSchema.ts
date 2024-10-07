import { z } from 'zod';

 export const headersSchema = z.object({
    customer: z.string().min(1, { message: "Customer is required" }),
    project: z.string().min(1, { message: "Project is required" }),
    cost_center: z.string().min(1, { message: "Cost Center is required" }),
    delivery_term: z.string().optional().nullable(),
    payment_term: z.string().optional().nullable(),
    comment: z.string().optional().nullable(),
    customer_branch: z.string().optional().nullable(),
    customer_address: z.string().optional().nullable(),
    bill_id: z.string().min(1, { message: "Bill ID is required" }),
    billing_address: z.string().optional().nullable(),
    shipping_id: z.string().min(1, { message: "Shipping ID is required" }),
    shipping_address: z.string().optional().nullable(),
    shipping_state: z.string().optional().nullable(),
    due_day: z.string().optional().nullable(),
    terms_condition: z.string().optional().nullable(),
    quotation_detail: z.string().optional().nullable(),
    shipping_pinCode: z.string().optional().nullable(),
  });
  
  // Define schema for "materials" with custom error messages
 export  const materialsSchema = z.object({
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