import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function setupPostgreSQL() {
  try {
    console.log('🔧 Setting up PostgreSQL database...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      console.log('Please set it to your PostgreSQL connection string:');
      console.log('export DATABASE_URL="postgresql://username:password@localhost:5432/database_name"');
      process.exit(1);
    }

    console.log('✅ DATABASE_URL is configured');

    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push schema to database
    console.log('🗄️  Pushing schema to database...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

    // Test database connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if data exists
    const existingCount = await prisma.salary.count();
    console.log(`📊 Current salary entries in database: ${existingCount}`);

    if (existingCount === 0) {
      console.log('🌱 Seeding database with sample data...');
      execSync('npm run seed', { stdio: 'inherit' });
      
      const newCount = await prisma.salary.count();
      console.log(`✅ Successfully seeded ${newCount} salary entries`);
    } else {
      console.log('✅ Database already has data, skipping seed');
    }

    // Verify setup
    const sampleData = await prisma.salary.findMany({
      take: 3,
      select: {
        jobTitle: true,
        location: true,
        baseSalary: true,
        experienceLevel: true
      }
    });

    console.log('\n📋 Sample data from database:');
    sampleData.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.jobTitle} (${entry.experienceLevel}) in ${entry.location} - ₹${entry.baseSalary.toLocaleString()}`);
    });

    console.log('\n🎉 PostgreSQL setup complete!');
    console.log('Your backend can now communicate with the database and fetch data.');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupPostgreSQL();