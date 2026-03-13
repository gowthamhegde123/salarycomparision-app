import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔧 Setting up PostgreSQL database...\n');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      console.log('\nPlease set it in your .env file:');
      console.log('DATABASE_URL="postgresql://user:password@host:5432/database"\n');
      process.exit(1);
    }

    console.log('✅ DATABASE_URL is configured\n');

    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated\n');

    // Push schema to database
    console.log('🗄️  Pushing schema to database...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✅ Schema pushed successfully\n');

    // Test database connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Check if data exists
    const existingCount = await prisma.salary.count();
    console.log(`📊 Current salary entries in database: ${existingCount}\n`);

    if (existingCount === 0) {
      console.log('🌱 Importing salary data from CSV file...');
      console.log('This may take a few minutes for 22,770 entries...\n');
      execSync('npm run import-csv', { stdio: 'inherit' });
      
      const newCount = await prisma.salary.count();
      console.log(`\n✅ Successfully imported ${newCount} salary entries\n`);
    } else {
      console.log('✅ Database already has data, skipping import\n');
    }

    // Verify setup with sample data
    const sampleData = await prisma.salary.findMany({
      take: 5,
      orderBy: { baseSalary: 'desc' },
      select: {
        jobTitle: true,
        location: true,
        baseSalary: true,
        experienceLevel: true
      }
    });

    console.log('📋 Sample high-paying jobs in database:');
    sampleData.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.jobTitle} (${entry.experienceLevel}) - ₹${entry.baseSalary.toLocaleString()} - ${entry.location}`);
    });

    // Show statistics
    const stats = await prisma.salary.groupBy({
      by: ['location'],
      _count: true,
      orderBy: {
        _count: {
          location: 'desc'
        }
      },
      take: 5
    });

    console.log('\n📈 Top 5 locations by job count:');
    stats.forEach((stat, index) => {
      console.log(`   ${index + 1}. ${stat.location}: ${stat._count} jobs`);
    });

    console.log('\n🎉 PostgreSQL setup complete!');
    console.log('Your backend can now communicate with PostgreSQL and fetch data.\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if PostgreSQL is running');
    console.log('2. Verify DATABASE_URL is correct in .env file');
    console.log('3. Ensure database exists and user has permissions');
    console.log('4. For cloud databases, check if IP is whitelisted\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();