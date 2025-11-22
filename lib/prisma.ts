import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Debug logging
console.log("🔍 [Prisma Debug] === Starting Prisma Initialization ===");
console.log("🔍 [Prisma Debug] NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 [Prisma Debug] DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("🔍 [Prisma Debug] DATABASE_URL preview:", 
  process.env.DATABASE_URL 
    ? `${process.env.DATABASE_URL.substring(0, 30)}...` 
    : "NOT SET"
);

if (!process.env.DATABASE_URL) {
  console.error("❌ [Prisma Debug] CRITICAL: DATABASE_URL is not set!");
  throw new Error("DATABASE_URL environment variable is required");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

console.log("🔍 [Prisma Debug] Creating PostgreSQL connection pool...");

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;
console.log("🔍 [Prisma Debug] Connection string length:", connectionString.length);

const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: connectionString,
  // Neon requires SSL
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("🔍 [Prisma Debug] Pool created");
console.log("🔍 [Prisma Debug] Creating PostgreSQL adapter...");

// Create adapter using the pool
const adapter = new PrismaPg(pool);

console.log("🔍 [Prisma Debug] Adapter created");
console.log("🔍 [Prisma Debug] Creating PrismaClient instance with adapter...");

// In Prisma 7, we use an adapter for database connections
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Pass the adapter for PostgreSQL
    adapter,
    log: ["query", "error", "warn"],
    errorFormat: "pretty",
  });

console.log("🔍 [Prisma Debug] PrismaClient instance created successfully");
console.log("🔍 [Prisma Debug] Testing database connection...");

// Test connection
prisma.$connect()
  .then(() => {
    console.log("✅ [Prisma Debug] Database connected successfully!");
    console.log("✅ [Prisma Debug] === Prisma Initialization Complete ===");
  })
  .catch((error) => {
    console.error("❌ [Prisma Debug] Database connection failed:");
    console.error("❌ [Prisma Debug] Error name:", error.name);
    console.error("❌ [Prisma Debug] Error message:", error.message);
    console.error("❌ [Prisma Debug] Error code:", error.code);
    console.error("❌ [Prisma Debug] Full error:", error);
    console.error("❌ [Prisma Debug] Stack:", error.stack);
  });

if (process.env.NODE_ENV !== "production") {
  console.log("🔍 [Prisma Debug] Caching Prisma instance globally (dev mode)");
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
