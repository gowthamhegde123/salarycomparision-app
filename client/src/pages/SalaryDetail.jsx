import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { salaryAPI } from '../api/client';

export default function SalaryDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    salaryAPI.getById(id).then(res => setData(res.data));
  }, [id]);

  if (!data) return (
    <div className="min-h-screen text-slate-50">
      <div className="text-center py-20 text-slate-600">Loading...</div>
    </div>
  );

  const { salary, similar } = data;
  const total = salary.baseSalary + (salary.bonus || 0);
  
  const formatINR = (amount) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const chartData = [
    { name: 'Base Salary', value: salary.baseSalary },
    { name: 'Bonus', value: salary.bonus || 0 },
    { name: 'Total', value: total }
  ];

  return (
    <div className="min-h-screen text-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/search" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block font-medium">
            ← Back to Search
          </Link>

          <motion.div 
            className="glass rounded-2xl p-8 mb-8 relative overflow-hidden shadow-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <motion.h1 
                  className="font-display text-5xl mb-2 text-slate-50"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                >
                  {salary.jobTitle}
                </motion.h1>
                <p className="text-xl text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  {salary.location}, {salary.country}
                </p>
              </div>
              <motion.span 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 font-medium border border-primary-500/20"
              >
                {salary.experienceLevel}
              </motion.span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-slate-800 border border-slate-700 shadow-soft"
              >
                <p className="text-slate-400 mb-2 text-sm font-medium">Base Salary</p>
                <p className="text-3xl font-display text-slate-50">
                  {formatINR(salary.baseSalary)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ₹{salary.baseSalary.toLocaleString('en-IN')}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-slate-800 border border-slate-700 shadow-soft"
              >
                <p className="text-slate-400 mb-2 text-sm font-medium">Bonus</p>
                <p className="text-3xl font-display text-amber-400">
                  {formatINR(salary.bonus || 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ₹{(salary.bonus || 0).toLocaleString('en-IN')}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 shadow-soft"
              >
                <p className="text-emerald-400 mb-2 text-sm font-medium">Total Compensation</p>
                <p className="text-3xl font-display text-emerald-400">
                  {formatINR(total)}
                </p>
                <p className="text-xs text-emerald-500/70 mt-1">
                  ₹{total.toLocaleString('en-IN')}
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm relative z-10">
              <div>
                <p className="text-slate-400 font-medium">Industry</p>
                <p className="font-semibold text-slate-100">{salary.industry}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Company Size</p>
                <p className="font-semibold text-slate-100">{salary.companySize || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Currency</p>
                <p className="font-semibold text-slate-100">{salary.currency}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Year</p>
                <p className="font-semibold text-slate-100">{salary.year}</p>
              </div>
            </div>
          </motion.div>

          <div className="glass rounded-2xl p-8 mb-8 shadow-medium">
            <h2 className="font-display text-3xl mb-6 text-slate-50">Compensation Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                  itemStyle={{
                      color: '#f8fafc'
                  }}
                />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {similar.length > 0 && (
            <div>
              <h2 className="font-display text-3xl mb-6 text-slate-50">Similar Roles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similar.map((s) => (
                  <Link
                    key={s.id}
                    to={`/salary/${s.id}`}
                    className="glass glass-hover rounded-xl p-6 shadow-soft hover:shadow-medium text-left"
                  >
                    <h3 className="text-lg font-bold mb-2 text-slate-100">{s.jobTitle}</h3>
                    <p className="text-slate-400 text-sm mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {s.location}
                    </p>
                    <p className="text-2xl font-display text-emerald-400">
                      {formatINR(s.baseSalary + (s.bonus || 0))}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
