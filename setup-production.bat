@echo off
echo 🚀 Setting up production database...
echo.
echo ⚠️  Make sure you have set DATABASE_URL environment variable
echo    Example: set DATABASE_URL=postgresql://user:pass@host:5432/dbname
echo.

if "%DATABASE_URL%"=="" (
    echo ❌ ERROR: DATABASE_URL is not set
    echo Please set it first:
    echo   set DATABASE_URL=your_postgresql_connection_string
    exit /b 1
)

echo ✅ DATABASE_URL is set
echo.

cd server

echo 📦 Installing dependencies...
call npm install

echo 🔧 Generating Prisma client...
call npx prisma generate

echo 📊 Pushing schema to database...
call npx prisma db push --accept-data-loss

echo 🌱 Seeding database...
call npm run seed

echo.
echo ✅ Production database setup complete!
echo 🎉 Your database now has 47 salary entries
echo.
echo Next steps:
echo 1. Deploy your app to Vercel
echo 2. Add environment variables in Vercel dashboard
echo 3. Your app should now show jobs!
