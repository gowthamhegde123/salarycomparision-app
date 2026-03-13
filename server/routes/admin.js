import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

const ADMIN_KEY = process.env.ADMIN_KEY || 'change-this-key';

const checkAdminKey = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function determineExperienceLevel(jobTitle, salary) {
  const title = jobTitle.toLowerCase();
  if (title.includes('intern') || title.includes('trainee')) return 'junior';
  if (title.includes('senior') || title.includes('sr.') || title.includes('lead')) return 'senior';
  if (title.includes('principal') || title.includes('architect') || title.includes('director')) return 'lead';
  if (title.includes('junior') || title.includes('jr.') || title.includes('fresher')) return 'junior';
  
  if (salary < 500000) return 'junior';
  if (salary < 1500000) return 'mid';
  if (salary < 3000000) return 'senior';
  return 'lead';
}

function determineIndustry(companyName, jobRole) {
  const combined = `${companyName} ${jobRole}`.toLowerCase();
  if (combined.includes('bank') || combined.includes('finance') || combined.includes('insurance')) return 'Finance';
  if (combined.includes('ecommerce') || combined.includes('retail') || combined.includes('shop')) return 'E-commerce';
  if (combined.includes('consult')) return 'Consulting';
  if (combined.includes('health') || combined.includes('medical') || combined.includes('pharma')) return 'Healthcare';
  if (combined.includes('education') || combined.includes('learning') || combined.includes('academy')) return 'Education';
  return 'Tech';
}

function determineCompanySize(rating, companyName) {
  const name = companyName.toLowerCase();
  const enterprises = ['google', 'microsoft', 'amazon', 'ibm', 'oracle', 'samsung'];
  if (enterprises.some(e => name.includes(e))) return 'enterprise';
  if (rating >= 4.5) return 'enterprise';
  if (rating >= 3.5) return 'mid';
  return 'startup';
}

router.get('/status', checkAdminKey, async (req, res) => {
  try {
    const count = await prisma.salary.count();
    const sampleData = await prisma.salary.findMany({
      take: 3,
      select: { jobTitle: true, location: true, baseSalary: true }
    });

    res.json({
      success: true,
      count,
      hasData: count > 0,
      sample: sampleData,
      message: count > 0 ? 'Database has data' : 'Database is empty'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/import-csv', checkAdminKey, async (req, res) => {
  try {
    const csvPath = path.join(__dirname, '../../Salary Dataset.csv');
    
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({
        success: false,
        error: 'CSV file not found',
        path: csvPath
      });
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    await prisma.salary.deleteMany({});
    
    let imported = 0;
    let skipped = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        if (values.length < 8) {
          skipped++;
          continue;
        }
        
        const [rating, companyName, jobTitle, salary, , location, , jobRoles] = values;
        const parsedSalary = parseFloat(salary.replace(/[^0-9.]/g, ''));
        
        if (isNaN(parsedSalary) || parsedSalary <= 0) {
          skipped++;
          continue;
        }
        
        await prisma.salary.create({
          data: {
            jobTitle: jobTitle.trim(),
            industry: determineIndustry(companyName, jobRoles),
            location: location.trim() || 'Bangalore',
            country: 'India',
            experienceLevel: determineExperienceLevel(jobTitle, parsedSalary),
            baseSalary: parsedSalary,
            bonus: parsedSalary * 0.1,
            currency: 'INR',
            companySize: determineCompanySize(parseFloat(rating), companyName),
            year: 2024
          }
        });
        
        imported++;
      } catch (error) {
        skipped++;
      }
    }
    
    res.json({
      success: true,
      imported,
      skipped,
      total: lines.length - 1,
      message: `Successfully imported ${imported} salary entries`
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;