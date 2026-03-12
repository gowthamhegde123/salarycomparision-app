import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize database with sample data (for production deployment)
router.post('/init-db', async (req, res) => {
  try {
    // Check if data already exists
    const existingCount = await prisma.salary.count();
    
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: `Database already has ${existingCount} salary entries`,
        count: existingCount
      });
    }

    // Import and run the seed data
    const { seedData } = await import('../prisma/seed-data.js');
    
    // Insert seed data
    for (const data of seedData) {
      await prisma.salary.create({ data });
    }

    const newCount = await prisma.salary.count();

    res.json({
      success: true,
      message: `Successfully initialized database with ${newCount} salary entries`,
      count: newCount
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize database',
      details: error.message
    });
  }
});

// Check database status
router.get('/db-status', async (req, res) => {
  try {
    const count = await prisma.salary.count();
    const sampleData = await prisma.salary.findMany({
      take: 3,
      select: {
        jobTitle: true,
        location: true,
        baseSalary: true,
        experienceLevel: true
      }
    });

    res.json({
      success: true,
      count,
      hasData: count > 0,
      sample: sampleData
    });

  } catch (error) {
    console.error('Database status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check database status',
      details: error.message
    });
  }
});

export default router;