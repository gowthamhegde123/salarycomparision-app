import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Function to parse CSV line (handles commas in quotes)
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

// Function to determine experience level from job title and salary
function determineExperienceLevel(jobTitle, salary) {
  const title = jobTitle.toLowerCase();
  
  // Check for explicit indicators in title
  if (title.includes('intern') || title.includes('trainee')) return 'junior';
  if (title.includes('senior') || title.includes('sr.') || title.includes('lead')) return 'senior';
  if (title.includes('principal') || title.includes('architect') || title.includes('director')) return 'lead';
  if (title.includes('junior') || title.includes('jr.') || title.includes('fresher')) return 'junior';
  
  // Determine by salary ranges (in INR)
  if (salary < 500000) return 'junior';
  if (salary < 1500000) return 'mid';
  if (salary < 3000000) return 'senior';
  return 'lead';
}

// Function to extract industry from company name or job role
function determineIndustry(companyName, jobRole) {
  const combined = `${companyName} ${jobRole}`.toLowerCase();
  
  if (combined.includes('bank') || combined.includes('finance') || combined.includes('insurance')) return 'Finance';
  if (combined.includes('ecommerce') || combined.includes('retail') || combined.includes('shop')) return 'E-commerce';
  if (combined.includes('consult')) return 'Consulting';
  if (combined.includes('health') || combined.includes('medical') || combined.includes('pharma')) return 'Healthcare';
  if (combined.includes('education') || combined.includes('learning') || combined.includes('academy')) return 'Education';
  
  return 'Tech'; // Default to Tech
}

// Function to determine company size from rating and other factors
function determineCompanySize(rating, companyName) {
  const name = companyName.toLowerCase();
  
  // Known large companies
  const enterprises = ['google', 'microsoft', 'amazon', 'ibm', 'oracle', 'samsung', 'intel', 'cisco', 'walmart', 'jp morgan', 'deloitte', 'accenture', 'tcs', 'infosys', 'wipro', 'cognizant'];
  if (enterprises.some(e => name.includes(e))) return 'enterprise';
  
  // Based on rating
  if (rating >= 4.5) return 'enterprise';
  if (rating >= 3.5) return 'mid';
  return 'startup';
}

async function importCSV() {
  try {
    console.log('📂 Reading CSV file...');
    
    // Read CSV file from root directory
    const csvPath = path.join(__dirname, '../../Salary Dataset.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    console.log(`📊 Found ${lines.length} lines in CSV`);
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    console.log('📋 Headers:', headers);
    
    // Clear existing data
    console.log('🗑️  Clearing existing salary data...');
    await prisma.salary.deleteMany({});
    
    // Parse and insert data
    console.log('💾 Importing salary data...');
    let imported = 0;
    let skipped = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        if (values.length < 8) {
          skipped++;
          continue;
        }
        
        const [rating, companyName, jobTitle, salary, salariesReported, location, employmentStatus, jobRoles] = values;
        
        // Parse salary (remove any non-numeric characters)
        const parsedSalary = parseFloat(salary.replace(/[^0-9.]/g, ''));
        
        if (isNaN(parsedSalary) || parsedSalary <= 0) {
          skipped++;
          continue;
        }
        
        // Determine additional fields
        const experienceLevel = determineExperienceLevel(jobTitle, parsedSalary);
        const industry = determineIndustry(companyName, jobRoles);
        const companySize = determineCompanySize(parseFloat(rating), companyName);
        
        // Create salary entry
        await prisma.salary.create({
          data: {
            jobTitle: jobTitle.trim(),
            industry: industry,
            location: location.trim() || 'Bangalore',
            country: 'India',
            experienceLevel: experienceLevel,
            baseSalary: parsedSalary,
            bonus: parsedSalary * 0.1, // Estimate 10% bonus
            currency: 'INR',
            companySize: companySize,
            year: 2024
          }
        });
        
        imported++;
        
        // Progress indicator
        if (imported % 1000 === 0) {
          console.log(`   ✓ Imported ${imported} entries...`);
        }
        
      } catch (error) {
        skipped++;
        if (skipped % 100 === 0) {
          console.log(`   ⚠️  Skipped ${skipped} invalid entries...`);
        }
      }
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`   📊 Successfully imported: ${imported} salary entries`);
    console.log(`   ⚠️  Skipped: ${skipped} invalid entries`);
    
    // Show summary statistics
    const totalCount = await prisma.salary.count();
    const uniqueJobs = await prisma.salary.groupBy({
      by: ['jobTitle'],
      _count: true
    });
    const uniqueLocations = await prisma.salary.groupBy({
      by: ['location'],
      _count: true
    });
    
    console.log(`\n📈 Database Summary:`);
    console.log(`   Total entries: ${totalCount}`);
    console.log(`   Unique job titles: ${uniqueJobs.length}`);
    console.log(`   Unique locations: ${uniqueLocations.length}`);
    
    // Show sample data
    const sampleData = await prisma.salary.findMany({
      take: 5,
      orderBy: { baseSalary: 'desc' },
      select: {
        jobTitle: true,
        location: true,
        baseSalary: true,
        experienceLevel: true,
        companySize: true
      }
    });
    
    console.log(`\n📋 Sample high-paying jobs:`);
    sampleData.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.jobTitle} (${entry.experienceLevel}) - ₹${entry.baseSalary.toLocaleString()} - ${entry.location}`);
    });
    
    console.log(`\n🎉 Your database is now populated with real salary data!`);
    console.log(`   Backend can now fetch and display jobs with salaries`);
    console.log(`   Salary prediction model can use this data for predictions`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importCSV();