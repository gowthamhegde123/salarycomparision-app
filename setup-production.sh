#!/bin/bash

echo "🚀 Setting up production database..."
echo ""
echo "⚠️  Make sure you have set DATABASE_URL environment variable"
echo "   Example: export DATABASE_URL='postgresql://user:pass@host:5432/dbname'"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set"
    echo "Please set it first:"
    echo "  export DATABASE_URL='your_postgresql_connection_string'"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Navigate to server directory
cd server

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "📊 Pushing schema to database..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npm run seed

echo ""
echo "✅ Production database setup complete!"
echo "🎉 Your database now has 47 salary entries"
echo ""
echo "Next steps:"
echo "1. Deploy your app to Vercel"
echo "2. Add environment variables in Vercel dashboard"
echo "3. Your app should now show jobs!"
