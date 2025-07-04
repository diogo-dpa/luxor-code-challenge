import { NextRequest } from "next/server";
import { z } from "zod";

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (
    request: NextRequest
  ): Promise<{ data: T; error: null } | { data: null; error: string }> => {
    try {
      const body = await request.json();
      const data = schema.parse(body);
      return { data, error: null };
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return { data: null, error: errorMessage };
      }
      return { data: null, error: "Invalid request data" };
    }
  };
}
