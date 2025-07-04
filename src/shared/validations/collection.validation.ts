import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  stocks: z.number().int().min(1, "Stocks must be at least 1"),
  price: z.number().positive("Price must be positive"),
  userId: z.number().int().positive("Valid user ID required"),
});

export const updateCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long")
    .optional(),
  stocks: z.number().int().min(1, "Stocks must be at least 1").optional(),
  price: z.number().positive("Price must be positive").optional(),
});
