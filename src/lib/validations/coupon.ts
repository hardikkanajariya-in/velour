import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrderValue: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
  validFrom: z.string().or(z.date()),
  validUntil: z.string().or(z.date()),
  applicableGender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]).optional(),
  firstOrderOnly: z.boolean().default(false),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  orderValue: z.number().positive(),
  userId: z.string().optional(),
});

export type CouponInput = z.infer<typeof couponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
