import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Truncating and preparing to seed database from CSV...');
  await prisma.salary.deleteMany({});
  console.log('🗑️  Cleared existing salary data');

  const csvPath = path.resolve('../Salary Dataset.csv');
  const fileStream = fs.createReadStream(csvPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isHeader = true;
  let batch = [];
  const BATCH_SIZE = 500;
  let totalImported = 0;
  let linesRead = 0;

  try {
    for await (const line of rl) {
      linesRead++;
      if (isHeader) {
        isHeader = false;
        continue;
      }

      if (!line.trim()) continue;

      // Simple CSV split logic handling quotes broadly
      const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      const values = line.split(regex).map(val => {
        let v = val.trim();
        if (v.startsWith('"') && v.endsWith('"')) {
          v = v.slice(1, -1);
        }
        return v;
      });

      if (values.length < 8) continue;

      const [Rating, CompanyName, JobTitle, Salary, SalariesReported, Location, EmploymentStatus, JobRoles] = values;

      const s = parseFloat(Salary.replace(/,/g, ''));
      if (isNaN(s)) continue;

      let expLevel = 'mid';
      const lowerTitle = JobTitle.toLowerCase();
      const lowerStatus = EmploymentStatus ? EmploymentStatus.toLowerCase() : '';
      
      if (lowerTitle.includes('senior') || lowerTitle.includes('lead') || lowerTitle.includes('manager')) expLevel = 'senior';
      else if (lowerTitle.includes('junior') || lowerTitle.includes('fresher') || lowerTitle.includes('intern') || lowerStatus.includes('intern')) expLevel = 'junior';

      batch.push({
        jobTitle: JobTitle.substring(0, 100),
        industry: JobRoles ? JobRoles.substring(0, 100) : 'Tech',
        location: Location ? Location.substring(0, 100) : 'Unknown',
        country: 'India',
        experienceLevel: expLevel,
        baseSalary: s,
        bonus: 0,
        currency: 'INR',
        companySize: null,
        year: 2024
      });

      if (batch.length >= BATCH_SIZE) {
        await prisma.salary.createMany({ data: batch });
        totalImported += batch.length;
        console.log(`⏳ Imported ${totalImported} rows... (out of ${linesRead} lines read)`);
        batch = [];
      }
    }

    if (batch.length > 0) {
      await prisma.salary.createMany({ data: batch });
      totalImported += batch.length;
    }

    console.log(`✅ Successfully seeded ${totalImported} records from CSV.`);
  } catch (err) {
    console.error("FATAL ERROR during processing:", err.message, err.stack);
  }
}

main()
  .catch((e) => {
    console.error("Main catch error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Disconnected from DB");
  });
