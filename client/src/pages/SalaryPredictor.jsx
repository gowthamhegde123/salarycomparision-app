import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function SalaryPredictor() {
  const [step, setStep] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    currentJobTitle: '',
    currentSalary: '',
    currentCompanySize: 'mid',
    currentExperienceLevel: 'mid',
    currentIndustry: 'Tech',
    currentLocation: 'Bangalore',
    targetJobTitle: '',
    targetCompanySize: 'enterprise',
    targetExperienceLevel: 'senior',
    targetIndustry: 'Tech',
    targetLocation: 'Bangalore'
  });

  const formatINR = (amount) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/predictor/predict', formData, {
        withCredentials: true
      });
      setPrediction(response.data);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.error || 'Please login to use this feature');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPrediction(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="font-display text-6xl mb-4">
            SALARY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">PREDICTOR</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get personalized salary predictions for your next job switch based on market data and your experience
          </p>
        </div>

        {step === 1 ? (
          <motion.form
            onSubmit={handlePredict}
            className="glass rounded-2xl p-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Current Job Section */}
              <div className="space-y-6">
                <h2 className="font-display text-3xl text-amber-500 mb-6">CURRENT JOB</h2>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Job Title *</label>
                  <input
                    type="text"
                    name="currentJobTitle"
                    required
                    value={formData.currentJobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-100 placeholder-slate-400 border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Current Salary (₹) *</label>
                  <input
                    type="number"
                    name="currentSalary"
                    required
                    value={formData.currentSalary}
                    onChange={handleChange}
                    placeholder="e.g. 1200000"
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-100 placeholder-slate-400 border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Company Size *</label>
                  <select
                    name="currentCompanySize"
                    value={formData.currentCompanySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="startup">Startup</option>
                    <option value="mid">Mid-size</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Experience Level *</label>
                  <select
                    name="currentExperienceLevel"
                    value={formData.currentExperienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Industry *</label>
                  <select
                    name="currentIndustry"
                    value={formData.currentIndustry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Location *</label>
                  <select
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
              </div>

              {/* Target Job Section */}
              <div className="space-y-6">
                <h2 className="font-display text-3xl text-emerald-500 mb-6">TARGET JOB</h2>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Job Title *</label>
                  <input
                    type="text"
                    name="targetJobTitle"
                    required
                    value={formData.targetJobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-100 placeholder-slate-400 border border-slate-700"
                  />
                </div>

                <div className="h-[72px]"></div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Company Size *</label>
                  <select
                    name="targetCompanySize"
                    value={formData.targetCompanySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="startup">Startup</option>
                    <option value="mid">Mid-size</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Experience Level *</label>
                  <select
                    name="targetExperienceLevel"
                    value={formData.targetExperienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Industry *</label>
                  <select
                    name="targetIndustry"
                    value={formData.targetIndustry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Location *</label>
                  <select
                    name="targetLocation"
                    value={formData.targetLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 border border-slate-700"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl font-bold text-slate-900 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all relative overflow-hidden disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? 'Calculating...' : 'Predict My Salary 🚀'}
              </span>
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Prediction Result */}
            <div className="glass rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
              
              <div className="text-center mb-8 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block"
                >
                  <div className="text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500 mb-2">
                    {formatINR(prediction.prediction.expectedSalary)}
                  </div>
                  <div className="text-2xl text-slate-400 mb-4">
                    ₹{prediction.prediction.expectedSalary.toLocaleString('en-IN')}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border border-emerald-500/30"
                >
                  <span className="text-2xl font-bold text-emerald-400">
                    +{prediction.prediction.hikePercentage}% Hike
                  </span>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-xl bg-slate-800/80 border border-slate-700"
                >
                  <p className="text-slate-400 text-sm mb-2">Minimum Expected</p>
                  <p className="text-2xl font-display text-slate-50">
                    {formatINR(prediction.prediction.minSalary)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-amber-500/10 border border-emerald-500/30"
                >
                  <p className="text-slate-400 text-sm mb-2">Most Likely</p>
                  <p className="text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500">
                    {formatINR(prediction.prediction.expectedSalary)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-6 rounded-xl bg-slate-800/80 border border-slate-700"
                >
                  <p className="text-slate-400 text-sm mb-2">Maximum Expected</p>
                  <p className="text-2xl font-display text-slate-50">
                    {formatINR(prediction.prediction.maxSalary)}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 relative z-10"
              >
                <p className="text-blue-400 text-sm">
                  <span className="font-bold">Confidence: {prediction.prediction.confidence}%</span>
                  {prediction.marketData && ` • Based on ${prediction.marketData.dataPoints} similar roles in our database`}
                </p>
              </motion.div>
            </div>

            {/* Factors Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="font-display text-3xl mb-6">IMPACT FACTORS</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Company Size</p>
                  <p className="text-xl font-bold text-emerald-400">{prediction.factors.companyImpact}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Experience</p>
                  <p className="text-xl font-bold text-amber-400">{prediction.factors.experienceImpact}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Industry</p>
                  <p className="text-xl font-bold text-emerald-400">{prediction.factors.industryImpact}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Location</p>
                  <p className="text-xl font-bold text-amber-400">{prediction.factors.locationImpact}</p>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetForm}
              className="w-full px-8 py-4 glass glass-hover rounded-xl font-bold transition-all"
            >
              Calculate Another Prediction
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
