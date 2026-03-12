# Quick Fix: No Jobs on Vercel

## The Problem
SQLite doesn't work on Vercel because it's a serverless platform. Your database file gets deleted after each request.

## Quick Solution (5 minutes)

### Option 1: Use Vercel Postgres (Easiest)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Create Vercel Postgres:**
```bash
vercel postgres create salary-db
```

3. **Get your DATABASE_URL:**
   - Go to Vercel Dashboard → Storage → Your Database
   - Copy the connection string

4. **Update Schema:**
   - Open `server/prisma/schema.prisma`
   - Change line 6 from `provider = "sqlite"` to `provider = "postgresql"`

5. **Seed Production Database:**
```bash
# Set your DATABASE_URL (from step 3)
set DATABASE_URL=your_connection_string_here

# Run setup
cd server
npx prisma generate
npx prisma db push
npm run seed
```

6. **Add Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `DATABASE_URL` = your connection string
     - `JWT_SECRET` = any random string
     - `CLIENT_URL` = your vercel app URL

7. **Redeploy:**
```bash
vercel --prod
```

### Option 2: Use Neon (Free PostgreSQL)

1. **Sign up at https://neon.tech**

2. **Create a new project**

3. **Copy your connection string**

4. **Follow steps 4-7 from Option 1**

### Option 3: Deploy Backend Separately on Railway

1. **Sign up at https://railway.app**

2. **Create new project from GitHub**

3. **Select your repository**

4. **Railway will auto-deploy your backend**

5. **Add environment variables in Railway:**
   - `DATABASE_URL` = `file:./dev.db` (Railway supports SQLite!)
   - `JWT_SECRET` = any random string
   - `CLIENT_URL` = your vercel frontend URL

6. **Get your Railway backend URL**

7. **Update your Vercel frontend:**
   - Add environment variable: `VITE_API_URL` = your railway backend URL

8. **Update `client/src/api/client.js`:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});
```

## Why This Happens

Vercel is **serverless** - it doesn't keep files between requests. SQLite is a file-based database, so it gets deleted. You need a cloud database that persists data.

## Recommended: Vercel Postgres

It's the easiest because:
- ✅ Integrated with Vercel
- ✅ Free tier available
- ✅ Automatic backups
- ✅ No separate deployment needed

---

**Need help?** Run into issues? Let me know which option you chose!
