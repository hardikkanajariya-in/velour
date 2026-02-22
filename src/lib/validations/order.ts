import { z } from "zod";

export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().default("India"),
  }),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  couponCode: z.string().optional(),
  shippingMethod: z
    .enum(["standard", "express", "sameday"])
    .default("standard"),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  notes: z.string().optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURNED",
  ]),
  message: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
