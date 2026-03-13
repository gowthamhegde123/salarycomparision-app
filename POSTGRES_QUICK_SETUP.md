# PostgreSQL Quick Setup Guide

Your app is now configured for PostgreSQL! Here's how to set it up for both local development and production.

## Option 1: Use Vercel Postgres (Easiest for Production)

### Step 1: Create Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Storage** tab
4. Click **Create Database** → **Postgres**
5. Name it `salary-db` and click **Create**

### Step 2: Get Connection String

Vercel automatically creates these environment variables:
- `POSTGRES_PRISMA_URL` ← Use this one!

### Step 3: Add to Vercel Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   DATABASE_URL = [paste POSTGRES_PRISMA_URL value]
   JWT_SECRET = your-production-secret-key
   ```

### Step 4: Deploy

```bash
git add .
git commit -m "Switch to PostgreSQL"
git push origin main
```

Vercel will automatically:
- Generate Prisma client
- Create database tables
- Import all 22,770 salary entries from CSV

**Done!** Your production app will have data in 5-10 minutes.

---

## Option 2: Use Neon (Free PostgreSQL)

### Step 1: Create Neon Database

1. Go to https://neon.tech
2. Sign up (free tier available)
3. Create a new project
4. Copy the connection string

### Step 2: Update Environment Variables

**For Vercel:**
```
DATABASE_URL = postgresql://user:pass@host.neon.tech/dbname?sslmode=require
```

**For Local (.env file):**
```
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
```

### Step 3: Setup Database

```bash
cd server
npm run setup
```

This will:
- Create tables
- Import 22,770 entries from CSV
- Verify setup

---

## Option 3: Local PostgreSQL

### Step 1: Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for `postgres` user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE salary_db;

# Exit
\q
```

### Step 3: Update .env File

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/salary_db"
```

### Step 4: Setup Database

```bash
cd server
npm run setup
```

---

## Verify Setup

### Test Database Connection

```bash
cd server
npm run test-db
```

Expected output:
```
✅ Database connection successful
📊 Total salary entries: 22770
🔍 Jobs in Bangalore: 8264
```

### Test API

```bash
# Start server
npm run dev

# In another terminal, test API
curl http://localhost:3001/api/salaries
```

### Open Prisma Studio (Database GUI)

```bash
npm run db:studio
```

Visit http://localhost:5555 to browse your data visually.

---

## Production Deployment Checklist

- [ ] PostgreSQL database created (Vercel/Neon/Supabase)
- [ ] `DATABASE_URL` added to Vercel environment variables
- [ ] `JWT_SECRET` added to Vercel environment variables
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Check build logs for "Import complete"
- [ ] Test API: `https://your-app.vercel.app/api/salaries`
- [ ] Verify data appears on website

---

## Troubleshooting

### "Connection refused" Error

**Local:**
- Check if PostgreSQL is running
- Verify port 5432 is not blocked
- Check username/password in DATABASE_URL

**Production:**
- Verify DATABASE_URL is set in Vercel
- Check if database allows connections
- Ensure SSL is enabled in connection string

### "No Data" in Production

1. Check Vercel build logs for import errors
2. Verify CSV file is in repository
3. Manually run import:
   ```bash
   # Set production DATABASE_URL locally
   export DATABASE_URL="your_production_url"
   cd server
   npm run import-csv
   ```

### Import Takes Too Long

The CSV import of 22,770 entries takes 5-10 minutes. This is normal.

If it times out during Vercel build:
1. Deploy without data first
2. Import data manually after deployment
3. Or use a smaller dataset for testing

---

## Current Status

✅ **Schema**: Configured for PostgreSQL
✅ **Import Script**: Ready to import 22,770 entries
✅ **Build Script**: Automatically runs on deployment
⚠️ **Database**: Needs to be created (Vercel/Neon/Local)

## Next Steps

1. **Choose a database option** (Vercel Postgres recommended)
2. **Create the database** (5 minutes)
3. **Add DATABASE_URL** to environment variables
4. **Deploy or run setup** locally
5. **Verify data** appears in your app

Your app will then work perfectly with PostgreSQL! 🎉