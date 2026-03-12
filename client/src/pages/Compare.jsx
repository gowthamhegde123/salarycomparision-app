import { useState } from 'react';
import { motion } from 'framer-motion';
import { salaryAPI } from '../api/client';

export default function Compare() {
  const [jobs, setJobs] = useState(['', '', '']);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const formatINR = (amount) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const handleCompare = async () => {
    const validJobs = jobs.filter(j => j.trim());
    if (validJobs.length < 2) return;

    setLoading(true);
    try {
      const res = await salaryAPI.compare(validJobs);
      setComparison(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-5xl mb-6 text-slate-50">
            COMPARE <span className="text-gradient">ROLES</span>
          </h1>

          <div className="glass rounded-xl p-8 mb-8 shadow-medium">
            <p className="text-slate-400 mb-6">Enter up to 3 job titles to compare</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {jobs.map((job, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Job Title ${i + 1}`}
                  value={job}
                  onChange={(e) => {
                    const newJobs = [...jobs];
                    newJobs[i] = e.target.value;
                    setJobs(newJobs);
                  }}
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100 placeholder-slate-400"
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompare}
              disabled={loading}
              className="px-8 py-3 gradient-success hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-bold text-white shadow-soft hover:shadow-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Comparing...' : 'Compare'}
            </motion.button>
          </div>

          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-8 shadow-medium"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-4 px-4 text-slate-300 font-semibold">Metric</th>
                      {comparison.map((job) => (
                        <th key={job.jobTitle} className="text-left py-4 px-4 text-slate-300 font-semibold">
                          {job.jobTitle}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-4 px-4 text-slate-400">Average Salary</td>
                      {comparison.map((job, i) => (
                        <motion.td 
                          key={job.jobTitle} 
                          className="py-4 px-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="font-display text-2xl text-emerald-400 font-bold">
                            {formatINR(job.avg)}
                          </div>
                          <div className="text-xs text-slate-400">₹{job.avg.toLocaleString('en-IN')}</div>
                        </motion.td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-4 px-4 text-slate-400">Median Salary</td>
                      {comparison.map((job, i) => (
                        <motion.td 
                          key={job.jobTitle} 
                          className="py-4 px-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.1 }}
                        >
                          <div className="font-display text-xl text-slate-200">{formatINR(job.median)}</div>
                          <div className="text-xs text-slate-400">₹{job.median.toLocaleString('en-IN')}</div>
                        </motion.td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-4 px-4 text-slate-400">Min - Max</td>
                      {comparison.map((job, i) => (
                        <motion.td 
                          key={job.jobTitle} 
                          className="py-4 px-4 text-slate-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                        >
                          <div>{formatINR(job.min)} - {formatINR(job.max)}</div>
                        </motion.td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-slate-400">Data Points</td>
                      {comparison.map((job) => (
                        <td key={job.jobTitle} className="py-4 px-4 text-slate-300">
                          {job.count} reports
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
