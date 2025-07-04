import { z } from "zod";
import { Status } from "../../../prisma/generated/prisma";

export const createBidSchema = z.object({
  collectionId: z.number().int().positive("Valid collection ID required"),
  userId: z.number().int().positive("Valid user ID required"),
  price: z.number().positive("Price must be positive"),
});

// updateBid is to update price only
export const updateBidSchema = z
  .object({
    id: z.number().int().positive("Valid bid ID required"),
    price: z.number().positive("Price must be positive"),
  })
  .partial();

export const updateStatusSchema = z
  .object({
    status: z
      .enum([Status.PENDING, Status.ACCEPTED, Status.REJECTED])
      .describe("Status must be one of PENDING, ACCEPTED, or REJECTED"),
  })
  .partial();
