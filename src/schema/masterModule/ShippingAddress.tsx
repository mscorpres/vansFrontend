import { z } from 'zod';

export const formSchema = z.object({
  addressLabel: z.string().min(1, { message: 'Address label is required' }),
  companyName: z.string().min(1, { message: 'Company name is required' }),
  panNo: z.string().min(1, { message: 'PAN No. is required' }),
  gstin: z.string().min(1, { message: 'GSTIN is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
});
