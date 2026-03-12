import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { statsAPI } from '../api/client';

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    statsAPI.getOverview().then(res => setStats(res.data));
  }, []);

  const formatINR = (amount) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      <section className="max-w-7xl mx-auto px-4 py-20 w-full flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Know Your <span className="text-gradient">Worth</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Compare salaries across industries, locations, and experience levels in India. 
            Make informed career decisions with real data.
          </p>
          <SearchBar />
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="glass glass-hover rounded-xl p-8 text-center">
              <div className="text-5xl font-bold text-primary-600">
                {stats.totalSalaries}+
              </div>
              <p className="text-slate-400 mt-2">Salary Reports</p>
            </div>
            
            <div className="glass glass-hover rounded-xl p-8 text-center">
              <div className="text-5xl font-bold text-emerald-400">
                {formatINR(stats.avgSalary)}
              </div>
              <p className="text-slate-400 mt-2">Average Salary</p>
            </div>
            
            <div className="glass glass-hover rounded-xl p-8 text-center">
              <div className="text-5xl font-bold text-primary-400">
                {stats.topJobs.length}+
              </div>
              <p className="text-slate-400 mt-2">Job Categories</p>
            </div>
          </div>
        )}

        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-10 text-slate-50">
            Top <span className="text-emerald-400">Roles</span>
          </h2>
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.topJobs.map((job) => (
                <div
                  key={job.title}
                  className="glass glass-hover rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-2 text-slate-100">{job.title}</h3>
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    {formatINR(job.avgSalary)}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {job.count} reports
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-20">
          <Link
            to="/submit"
            className="inline-block px-8 py-4 gradient-success hover:from-emerald-600 hover:to-emerald-700 rounded-lg font-semibold text-white transition-all duration-200 shadow-soft hover:shadow-medium"
          >
            Submit Your Salary
          </Link>
        </div>
      </section>
    </div>
  );
}
