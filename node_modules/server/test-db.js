import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔌 Testing PostgreSQL connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Count total entries
    const totalCount = await prisma.salary.count();
    console.log(`📊 Total salary entries: ${totalCount}`);

    if (totalCount === 0) {
      console.log('⚠️  Database is empty. Run: npm run seed');
      return;
    }

    // Test basic queries
    const sampleData = await prisma.salary.findMany({
      take: 3,
      select: {
        id: true,
        jobTitle: true,
        location: true,
        baseSalary: true,
        experienceLevel: true,
        currency: true
      }
    });

    console.log('\n📋 Sample data:');
    sampleData.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.jobTitle} (${entry.experienceLevel}) in ${entry.location} - ${entry.currency} ${entry.baseSalary.toLocaleString()}`);
    });

    // Test search functionality
    const bangaloreJobs = await prisma.salary.count({
      where: {
        location: {
          contains: 'Bangalore'
        }
      }
    });
    console.log(`\n🔍 Jobs in Bangalore: ${bangaloreJobs}`);

    const softwareEngineers = await prisma.salary.count({
      where: {
        jobTitle: {
          contains: 'Software Engineer'
        }
      }
    });
    console.log(`👨‍💻 Software Engineer entries: ${softwareEngineers}`);

    // Test aggregations
    const avgSalary = await prisma.salary.aggregate({
      _avg: {
        baseSalary: true
      },
      where: {
        jobTitle: {
          contains: 'Software Engineer'
        },
        location: {
          contains: 'Bangalore'
        }
      }
    });

    if (avgSalary._avg.baseSalary) {
      console.log(`💰 Average Software Engineer salary in Bangalore: ₹${Math.round(avgSalary._avg.baseSalary).toLocaleString()}`);
    }

    console.log('\n🎉 Database test completed successfully!');
    console.log('✅ Backend can communicate with PostgreSQL and fetch data');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if DATABASE_URL is set correctly in .env');
    console.log('2. Ensure PostgreSQL is running');
    console.log('3. Run: npm run setup-postgres');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();