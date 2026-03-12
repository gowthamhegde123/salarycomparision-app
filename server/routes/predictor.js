import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Salary growth multipliers based on company size transition
const companyMultipliers = {
  'startup-to-mid': 1.15,
  'startup-to-enterprise': 1.30,
  'mid-to-startup': 0.95,
  'mid-to-enterprise': 1.20,
  'enterprise-to-startup': 0.90,
  'enterprise-to-mid': 0.95,
  'same': 1.10 // Same company size, different company
};

// Experience level progression multipliers
const experienceLevelMultipliers = {
  'junior-to-mid': 1.40,
  'mid-to-senior': 1.50,
  'senior-to-lead': 1.35,
  'same': 1.15 // Same level
};

// Industry multipliers
const industryMultipliers = {
  'Tech': 1.0,
  'Finance': 1.15,
  'E-commerce': 1.05,
  'Healthcare': 0.95,
  'Consulting': 1.10
};

// Location multipliers (compared to Bangalore baseline)
const locationMultipliers = {
  'Bangalore': 1.0,
  'Mumbai': 1.05,
  'Hyderabad': 0.95,
  'Pune': 0.93,
  'Delhi': 0.97,
  'Chennai': 0.92
};

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

router.post('/predict', optionalAuth, async (req, res) => {
  try {
    const {
      currentJobTitle,
      currentSalary,
      currentCompanySize,
      currentExperienceLevel,
      currentIndustry,
      currentLocation,
      targetJobTitle,
      targetCompanySize,
      targetExperienceLevel,
      targetIndustry,
      targetLocation
    } = req.body;

    // Get market data for similar roles
    const similarRoles = await prisma.salary.findMany({
      where: {
        jobTitle: { contains: targetJobTitle },
        experienceLevel: targetExperienceLevel,
        companySize: targetCompanySize
      }
    });

    let predictedSalary = parseFloat(currentSalary);

    // Apply company size transition multiplier
    const companyTransition = `${currentCompanySize}-to-${targetCompanySize}`;
    const companyMultiplier = companyMultipliers[companyTransition] || companyMultipliers['same'];
    predictedSalary *= companyMultiplier;

    // Apply experience level progression multiplier
    const experienceTransition = `${currentExperienceLevel}-to-${targetExperienceLevel}`;
    const experienceMultiplier = experienceLevelMultipliers[experienceTransition] || experienceLevelMultipliers['same'];
    predictedSalary *= experienceMultiplier;

    // Apply industry multiplier
    const industryChange = (industryMultipliers[targetIndustry] || 1.0) / (industryMultipliers[currentIndustry] || 1.0);
    predictedSalary *= industryChange;

    // Apply location multiplier
    const locationChange = (locationMultipliers[targetLocation] || 1.0) / (locationMultipliers[currentLocation] || 1.0);
    predictedSalary *= locationChange;

    // Calculate market-based range if we have data
    let marketMin, marketMax, marketMedian;
    if (similarRoles.length > 0) {
      const salaries = similarRoles.map(s => s.baseSalary + (s.bonus || 0)).sort((a, b) => a - b);
      marketMin = Math.min(...salaries);
      marketMax = Math.max(...salaries);
      marketMedian = salaries[Math.floor(salaries.length / 2)];

      // Adjust prediction to be within market range (weighted average)
      predictedSalary = (predictedSalary * 0.6) + (marketMedian * 0.4);
    }

    // Calculate confidence based on available data
    const confidence = similarRoles.length > 0 
      ? Math.min(95, 60 + (similarRoles.length * 5))
      : 50;

    // Calculate range (±15%)
    const minSalary = Math.round(predictedSalary * 0.85);
    const maxSalary = Math.round(predictedSalary * 1.15);
    predictedSalary = Math.round(predictedSalary);

    // Calculate expected hike percentage
    const hikePercentage = ((predictedSalary - currentSalary) / currentSalary * 100).toFixed(1);

    res.json({
      prediction: {
        expectedSalary: predictedSalary,
        minSalary,
        maxSalary,
        hikePercentage: parseFloat(hikePercentage),
        confidence
      },
      marketData: similarRoles.length > 0 ? {
        dataPoints: similarRoles.length,
        marketMin,
        marketMax,
        marketMedian
      } : null,
      factors: {
        companyTransition: companyTransition,
        companyImpact: ((companyMultiplier - 1) * 100).toFixed(1) + '%',
        experienceImpact: ((experienceMultiplier - 1) * 100).toFixed(1) + '%',
        industryImpact: ((industryChange - 1) * 100).toFixed(1) + '%',
        locationImpact: ((locationChange - 1) * 100).toFixed(1) + '%'
      }
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to predict salary' });
  }
});

// Update user's current job info
router.post('/update-profile', authenticate, async (req, res) => {
  try {
    const { currentJob, currentSalary, yearsExperience, currentCompany } = req.body;

    const parsedSalary = currentSalary ? parseFloat(currentSalary) : null;
    const parsedExp = yearsExperience ? parseFloat(yearsExperience) : null;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        currentJob: currentJob || null,
        currentSalary: isNaN(parsedSalary) ? null : parsedSalary,
        yearsExperience: isNaN(parsedExp) ? null : parsedExp,
        currentCompany: currentCompany || null
      }
    });

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        currentJob: user.currentJob,
        currentSalary: user.currentSalary,
        yearsExperience: user.yearsExperience,
        currentCompany: user.currentCompany
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's current job info
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        currentJob: true,
        currentSalary: true,
        yearsExperience: true,
        currentCompany: true
      }
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
