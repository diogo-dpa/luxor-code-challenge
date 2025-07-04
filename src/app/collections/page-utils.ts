import { z } from "zod";
import { FormConfig } from "./page-types";

export const collectionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  stocks: z.coerce.number().min(1, {
    message: "Stocks must be at least 1.",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Price must be at least 0.01.",
  }),
});

export const collectionConfig: FormConfig[] = [
  {
    label: "Name",
    placeholder: "Example: My Collection",
    description: "This is the name of your collection.",
    name: "name",
  },
  {
    label: "Description",
    placeholder: "Example: This is my collection",
    description: "This is a short description of your collection.",
    name: "description",
  },
  {
    label: "Stocks",
    placeholder: "Example: 1000",
    description: "This is the number of stocks in your collection.",
    name: "stocks",
  },
  {
    label: "Price",
    placeholder: "Example: 100.00",
    description: "This is the price of your collection.",
    name: "price",
  },
];
