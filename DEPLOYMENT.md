# Deployment Guide

## The Issue: No Data in Production

When you deploy to Vercel or other platforms, the app shows no salary data because:

1. **Database is empty** - Production uses PostgreSQL, not the local SQLite file
2. **No automatic seeding** - The seed script doesn't run during deployment
3. **Environment variables** - Production needs proper database connection

## Solution: Deploy with Database Setup

### Step 1: Set up PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Create a new Postgres database
5. Copy the `DATABASE_URL` connection string

**Option B: External PostgreSQL (Neon, Supabase, etc.)**
1. Create a PostgreSQL database on your preferred provider
2. Get the connection string (DATABASE_URL)

### Step 2: Configure Environment Variables

In your Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
CLIENT_URL=https://your-app-domain.vercel.app
```

### Step 3: Deploy with Database Setup

**Method 1: Automatic (Recommended)**
The app is now configured to automatically:
- Generate Prisma client
- Push database schema
- Seed with sample data

Just deploy normally and it should work!

**Method 2: Manual Setup**
If automatic setup fails, run these commands locally with production DATABASE_URL:

```bash
# Set your production database URL
export DATABASE_URL="your_postgresql_connection_string"

# Run the production setup script
chmod +x setup-production.sh
./setup-production.sh
```

### Step 4: Verify Deployment

After deployment:
1. Visit your app URL
2. Go to the "Search" or "Compare" page
3. You should see salary data for various roles
4. Try searching for "Software Engineer" in "Bangalore"

## Troubleshooting

### Still No Data?

1. **Check Vercel Function Logs**:
   - Go to Vercel dashboard → Functions tab
   - Check for any errors during deployment

2. **Verify Database Connection**:
   - Make sure DATABASE_URL is correctly set
   - Test the connection string locally

3. **Manual Seeding**:
   ```bash
   # Connect to your production database and run:
   npm run seed
   ```

4. **Check API Endpoints**:
   - Visit: `https://your-app.vercel.app/api/salaries`
   - Should return JSON with salary data

### Common Issues

- **"Prisma Client not found"**: Run `npm run postinstall` in server directory
- **"Database connection failed"**: Check DATABASE_URL format
- **"No data returned"**: Database might be empty, run seed script

## Sample Data Included

The app comes with 80+ salary entries covering:
- 25+ Job titles (Software Engineer, Data Scientist, Product Manager, etc.)
- 10+ Indian cities (Bangalore, Mumbai, Hyderabad, Pune, Delhi, etc.)
- All experience levels (Junior, Mid, Senior, Lead)
- Multiple industries (Tech, Finance, E-commerce, etc.)
- Realistic 2024 Indian market rates

## Need Help?

If you're still having issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Try the manual setup method
4. Contact support with specific error messages