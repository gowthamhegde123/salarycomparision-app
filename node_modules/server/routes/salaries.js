import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { jobTitle, location, industry, experienceLevel, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (jobTitle) where.jobTitle = { contains: jobTitle };
    if (location) where.location = { contains: location };
    if (industry) where.industry = { contains: industry };
    if (experienceLevel) where.experienceLevel = experienceLevel;

    const [rawSalaries, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.salary.count({ where })
    ]);

    // Strip out userId to ensure data privacy
    const salaries = rawSalaries.map(s => {
      const { userId, ...rest } = s;
      return rest;
    });

    res.json({
      salaries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salaries' });
  }
});

router.get('/all-jobs', async (req, res) => {
  try {
    const jobTitles = await prisma.$queryRaw`
      SELECT DISTINCT jobTitle, COUNT(*) as count 
      FROM Salary 
      GROUP BY jobTitle 
      ORDER BY count DESC 
      LIMIT 50
    `;
    
    res.json(jobTitles.map(j => j.jobTitle));
  } catch (error) {
    console.error('All jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch job titles' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const jobTitles = await prisma.$queryRaw`
      SELECT jobTitle, COUNT(*) as count 
      FROM Salary 
      WHERE LOWER(jobTitle) LIKE ${'%' + q.toLowerCase() + '%'}
      GROUP BY jobTitle 
      ORDER BY count DESC 
      LIMIT 10
    `;
    
    res.json(jobTitles.map(j => j.jobTitle));
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

const optionalAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.userId = null;
    return next();
  }
  import('jsonwebtoken').then(jwt => {
    try {
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      req.userId = null;
      next();
    }
  });
};

router.get('/compare', async (req, res) => {
  try {
    const { jobs } = req.query;
    const jobTitles = jobs.split(',');

    const comparisons = await Promise.all(
      jobTitles.map(async (jobTitle) => {
        const salaries = await prisma.salary.findMany({
          where: { jobTitle: { contains: jobTitle.trim() } }
        });

        if (salaries.length === 0) return null;

        const sorted = salaries.map(s => s.baseSalary).sort((a, b) => a - b);
        const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
        const median = sorted[Math.floor(sorted.length / 2)];

        return {
          jobTitle: jobTitle.trim(),
          count: salaries.length,
          min: Math.min(...sorted),
          max: Math.max(...sorted),
          avg: Math.round(avg),
          median: Math.round(median)
        };
      })
    );

    res.json(comparisons.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Comparison failed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const salary = await prisma.salary.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!salary) {
      return res.status(404).json({ error: 'Salary not found' });
    }

    const similar = await prisma.salary.findMany({
      where: {
        jobTitle: salary.jobTitle,
        id: { not: salary.id }
      },
      take: 5
    });

    // Strip out userId for privacy
    const { userId: currentUserId, ...safeSalary } = salary;
    const safeSimilar = similar.map(s => {
      const { userId, ...rest } = s;
      return rest;
    });

    res.json({ salary: safeSalary, similar: safeSimilar });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary' });
  }
});

router.post('/', optionalAuth, async (req, res) => {
  try {
    const salary = await prisma.salary.create({
      data: {
        jobTitle: req.body.jobTitle,
        industry: req.body.industry,
        location: req.body.location,
        country: req.body.country,
        experienceLevel: req.body.experienceLevel,
        baseSalary: parseFloat(req.body.baseSalary),
        bonus: req.body.bonus ? parseFloat(req.body.bonus) : null,
        currency: req.body.currency || 'USD',
        companySize: req.body.companySize,
        year: parseInt(req.body.year) || new Date().getFullYear(),
        userId: req.userId || null
      }
    });
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create salary' });
  }
});

export default router;
