TinyLink — URL Shortener

TinyLink is a minimal, fast, and modern URL shortener built with:

Next.js 16 (App Router + Server Actions)
Prisma ORM v7
Neon Serverless PostgreSQL
TypeScript
TailwindCSS
nanoid
Anonymous session-based link ownership




Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/tinylink.git
cd tinylink

2️⃣ Install dependencies
pnpm install

3️⃣ Create .env
DATABASE_URL="your_neon_connection_string"
BASE_URL="http://localhost:3000"

4️⃣ Prisma Setup

Prisma v7 uses prisma.config.ts.

Run:

npx prisma generate


(Optional: apply schema)

npx prisma db push

5️⃣ Start the development server
pnpm dev



