import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export default prisma;
