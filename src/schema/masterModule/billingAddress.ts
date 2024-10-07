import { z } from 'zod';

const formSchema = z.object({
  warehouseName: z.string().min(1, { message: "Warehouse Name is required" }),
  companyName: z.string().min(1, { message: "Company Name is required" }),
  panNo: z.string().min(1, { message: "Pan No. is required" }),
  gstNo: z.string().min(1, { message: "GST No. is required" }),
  cinNo: z.string().min(1, { message: "CIN No. is required" }),
  selectCity: z.string().min(1, { message: "City selection is required" }),
  selectAddress: z.string().min(1, { message: "Address is required" }),
});

export default formSchema;
