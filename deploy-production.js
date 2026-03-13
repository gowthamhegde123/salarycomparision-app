import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting production deployment setup...\n');

// Step 1: Switch to PostgreSQL schema
console.log('1️⃣ Switching to PostgreSQL schema...');
fs.copyFileSync('server/prisma/schema-production.prisma', 'server/prisma/schema.prisma');
console.log('✅ Schema updated for PostgreSQL\n');

// Step 2: Update environment for production
console.log('2️⃣ Updating environment configuration...');
const productionEnv = `PORT=3001
NODE_ENV=production
DATABASE_URL="postgresql://postgres:password@localhost:5432/salary_db"
JWT_SECRET=production-secret-key-change-this
CLIENT_URL=https://your-app.vercel.app
ADMIN_KEY=salary-admin-2024`;

fs.writeFileSync('server/.env.production', productionEnv);
console.log('✅ Production environment file created\n');

// Step 3: Create deployment-ready vercel.json
console.log('3️⃣ Creating deployment configuration...');
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["server/prisma/**", "Salary Dataset.csv"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('✅ Vercel configuration updated\n');

// Step 4: Add build script to server
console.log('4️⃣ Adding production build script...');
const serverPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
serverPackage.scripts.build = "prisma generate && prisma db push --accept-data-loss && npm run import-csv";
serverPackage.scripts["vercel-build"] = "prisma generate";
fs.writeFileSync('server/package.json', JSON.stringify(serverPackage, null, 2));
console.log('✅ Server build scripts added\n');

console.log('🎉 Production setup complete!\n');
console.log('📋 Next steps:');
console.log('1. Create Vercel Postgres database');
console.log('2. Add DATABASE_URL to Vercel environment variables');
console.log('3. Add ADMIN_KEY=salary-admin-2024 to Vercel');
console.log('4. Deploy: git add . && git commit -m "Production ready" && git push');
console.log('5. After deployment, visit: /api/admin/import-csv?key=salary-admin-2024');
console.log('\n✨ Your app will have all 22,770 salary entries in production!');