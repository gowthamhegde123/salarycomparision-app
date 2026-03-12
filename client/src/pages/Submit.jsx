import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { salaryAPI } from '../api/client';

export default function Submit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    industry: '',
    location: '',
    country: '',
    experienceLevel: 'mid',
    baseSalary: '',
    bonus: '',
    currency: 'USD',
    companySize: 'mid',
    year: new Date().getFullYear()
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await salaryAPI.create(formData);
      setSuccess(true);
      setTimeout(() => navigate('/search'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Please login first.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <div className="min-h-screen text-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl mb-4 inline-block text-emerald-600"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              ✓
            </motion.div>
          </motion.div>
          <motion.h2 
            className="font-display text-4xl text-emerald-600 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            SUCCESS!
          </motion.h2>
          <motion.p 
            className="text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your salary has been submitted. Redirecting...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-5xl mb-6 text-slate-50">
            SUBMIT YOUR <span className="text-gradient">SALARY</span>
          </h1>

          <motion.form 
            onSubmit={handleSubmit} 
            className="glass rounded-xl p-8 space-y-6 relative overflow-hidden shadow-medium"
            whileHover={{ boxShadow: "0 4px 30px -5px rgba(16, 185, 129, 0.15)" }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
              >
                {error}
              </motion.div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Job Title *</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Industry *</label>
                <input
                  type="text"
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Country *</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Company Size</label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                >
                  <option value="startup">Startup</option>
                  <option value="mid">Mid-size</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Base Salary *</label>
                <input
                  type="number"
                  name="baseSalary"
                  required
                  value={formData.baseSalary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Bonus</label>
                <input
                  type="number"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="CAD">CAD</option>
                  <option value="SGD">SGD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Year *</label>
                <input
                  type="number"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 4px 25px -5px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-8 py-4 gradient-success hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-bold text-white shadow-soft hover:shadow-medium transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Submit Salary</span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
