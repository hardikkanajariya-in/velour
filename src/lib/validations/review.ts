import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
  images: z.array(z.string()).default([]),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
