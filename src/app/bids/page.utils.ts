import { z } from "zod";
import { FormConfig } from "./page-types";

export const bidFormSchema = z.object({
  price: z.coerce.number().min(0.01, {
    message: "Price must be at least 0.01.",
  }),
});

export const bidConfig: FormConfig[] = [
  {
    label: "Price",
    placeholder: "Example: 200.00",
    description: "This is the price of your bid.",
    name: "price",
  },
];
