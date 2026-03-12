import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/compare', label: 'Compare' },
    { path: '/predictor', label: 'Predictor' },
    { path: '/submit', label: 'Submit' }
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-800/60 backdrop-blur-xl shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-2xl text-primary-400">
            SalaryCompare
          </Link>

          <div className="flex gap-6 items-center">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary-500"
                  />
                )}
              </Link>
            ))}
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 font-medium transition-colors text-primary-400 hover:text-primary-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
