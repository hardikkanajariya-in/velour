import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode is required'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
