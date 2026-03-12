# Deployment Guide for Vercel

## Important: Database Setup

Your app is currently using SQLite which **doesn't work on Vercel** (serverless environment). You need to use a cloud database.

## Option 1: Use PostgreSQL (Recommended)

### Step 1: Get a PostgreSQL Database

Choose one of these free options:
- **Vercel Postgres** (easiest): https://vercel.com/docs/storage/vercel-postgres
- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com

### Step 2: Update Prisma Schema

Change `server/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3: Set Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your-super-secret-jwt-key-change-this
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Step 4: Deploy and Seed Database

After deploying, run these commands locally to seed your production database:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your_postgresql_connection_string"

# Generate Prisma client
cd server
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed the database
npm run seed
```

## Option 2: Quick Fix - Deploy Backend Separately

If you want to keep SQLite for now:

### Deploy Backend on Railway/Render

1. **Railway.app** (Recommended):
   - Sign up at https://railway.app
   - Create new project from GitHub
   - Select only the `server` folder
   - Railway will automatically detect Node.js
   - Add environment variables in Railway dashboard
   - Railway provides persistent storage for SQLite

2. **Update Client API URL**:

In `client/vite.config.js`, update the proxy or create `client/.env`:

```env
VITE_API_URL=https://your-backend.railway.app
```

Update `client/src/api/client.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});
```

## Current Issue

Your Vercel deployment has no jobs because:
1. SQLite database file doesn't persist on Vercel (serverless)
2. The seed data is lost after each deployment
3. You need a persistent database solution

## Recommended Solution

**Use Vercel Postgres** (simplest):

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Add Vercel Postgres
vercel postgres create

# This will give you a DATABASE_URL
# Add it to your environment variables
```

Then update your schema to PostgreSQL and redeploy.

## Alternative: Use Vercel KV + Prisma Accelerate

For a simpler setup, you can use Vercel's built-in storage solutions.

---

**Need help?** Let me know which option you prefer and I'll guide you through it!
