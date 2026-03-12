import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/overview', async (req, res) => {
  try {
    const [totalSalaries, avgSalary, topJobs] = await Promise.all([
      prisma.salary.count(),
      prisma.salary.aggregate({ _avg: { baseSalary: true } }),
      prisma.salary.groupBy({
        by: ['jobTitle'],
        _count: { jobTitle: true },
        _avg: { baseSalary: true },
        orderBy: { _count: { jobTitle: 'desc' } },
        take: 5
      })
    ]);

    res.json({
      totalSalaries,
      avgSalary: Math.round(avgSalary._avg.baseSalary || 0),
      topJobs: topJobs.map(j => ({
        title: j.jobTitle,
        count: j._count.jobTitle,
        avgSalary: Math.round(j._avg.baseSalary)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
