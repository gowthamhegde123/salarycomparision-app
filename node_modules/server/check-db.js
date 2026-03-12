import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const topJobs = await prisma.salary.groupBy({
    by: ['jobTitle'],
    _count: { jobTitle: true },
    orderBy: { _count: { jobTitle: 'desc' } },
    take: 20
  });
  console.log('Top jobs in DB: ');
  topJobs.forEach(j => console.log(j.jobTitle, j._count.jobTitle));
}
main().finally(() => prisma.$disconnect());
