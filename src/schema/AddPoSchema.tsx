import { z } from 'zod';

export const rowData2Schema = z.object({
  index: z.number(),
  material: z.string(),
  asinNumber: z.string(),
  ordQty: z.number(),
  rate: z.number(),
  gstRate: z.number(),
  isNew: z.boolean().optional(),
});
