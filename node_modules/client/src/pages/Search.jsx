import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SalaryCard from '../components/SalaryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { salaryAPI } from '../api/client';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    jobTitle: searchParams.get('jobTitle') || '',
    location: searchParams.get('location') || '',
    industry: searchParams.get('industry') || '',
    experienceLevel: searchParams.get('experienceLevel') || ''
  });
  
  const totalSalaries = salaries.length;

  useEffect(() => {
    setLoading(true);
    salaryAPI.getAll(filters)
      .then(res => setSalaries(res.data.salaries))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen text-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-5xl font-bold text-slate-50">
              Search <span className="text-gradient">Salaries</span>
            </h1>
            {!loading && totalSalaries > 0 && (
              <div className="px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {totalSalaries} results
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-6 mb-8 shadow-medium">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Job Title"
                value={filters.jobTitle}
                onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:border-2 focus:border-primary-500 transition-all text-slate-100 placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:border-2 focus:border-primary-500 transition-all text-slate-100 placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Industry"
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:border-2 focus:border-primary-500 transition-all text-slate-100 placeholder-slate-400"
              />
              <select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:border-2 focus:border-primary-500 transition-all text-slate-100"
              >
                <option value="">All Levels</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : salaries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-slate-400">No salaries found. Try adjusting your filters.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salaries.map((salary, i) => (
              <SalaryCard key={salary.id} salary={salary} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
