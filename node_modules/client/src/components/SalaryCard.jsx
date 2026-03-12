import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SalaryCard({ salary, index = 0 }) {
  const total = salary.baseSalary + (salary.bonus || 0);
  const formattedSalary = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(total);

  const lakhs = (total / 100000).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="glass glass-hover rounded-xl p-6 cursor-pointer shadow-soft hover:shadow-medium"
    >
      <Link to={`/salary/${salary.id}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">
              {salary.jobTitle}
            </h3>
            <p className="text-slate-400 text-sm">
              {salary.location}, {salary.country}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium border border-primary-500/20">
            {salary.experienceLevel}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-primary-400 mb-1">
            ₹{lakhs}L
          </div>
          <div className="text-sm text-slate-300 mb-2">{formattedSalary}</div>
          <div className="flex gap-4 text-sm text-slate-400">
            <span>{salary.industry}</span>
            <span>•</span>
            <span>{salary.companySize || 'N/A'}</span>
          </div>
        </div>

        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary-500 to-emerald-500"
          />
        </div>
      </Link>
    </motion.div>
  );
}
