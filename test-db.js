// Quick database connection test for Neon Postgres
require('dotenv').config();

console.log("\n🧪 Testing Database Connection...\n");
console.log("Environment Variables:");
console.log("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("- DATABASE_URL format:", 
  process.env.DATABASE_URL 
    ? (process.env.DATABASE_URL.startsWith('postgresql://') || 
       process.env.DATABASE_URL.startsWith('postgres://') 
       ? '✅ Valid format (postgresql://...)' 
       : '❌ Invalid format (should start with postgresql:// or postgres://)')
    : '❌ NOT SET'
);

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log("\nConnection Details:");
    console.log("- Protocol:", url.protocol);
    console.log("- Host:", url.hostname);
    console.log("- Port:", url.port || "default");
    console.log("- Database:", url.pathname.substring(1));
    console.log("- Has SSL params:", url.searchParams.has('sslmode') || url.searchParams.has('ssl'));
    
    if (url.hostname.includes('neon') || url.searchParams.get('sslmode')) {
      console.log("\n💡 Detected Neon Postgres configuration");
    }
  } catch (e) {
    console.error("\n❌ Error parsing DATABASE_URL:", e.message);
  }
}

console.log("\n📋 Next Steps:");
if (!process.env.DATABASE_URL) {
  console.log("1. ❌ Add DATABASE_URL to your .env file");
  console.log("   Example for Neon:");
  console.log("   DATABASE_URL=\"postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require\"");
} else {
  console.log("1. ✅ DATABASE_URL is set");
  console.log("2. Run: npx prisma generate");
  console.log("3. Run: npx prisma db push (to sync your schema with Neon)");
  console.log("4. Restart your dev server");
}
