// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Ensure a single PrismaClient instance is used in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;