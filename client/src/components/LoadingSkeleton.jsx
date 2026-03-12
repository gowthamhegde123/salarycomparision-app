import { motion } from 'framer-motion';

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-xl p-6 shadow-soft"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-6 bg-slate-200 rounded w-48" />
                <div className="h-4 bg-slate-200 rounded w-32" />
              </div>
              <div className="h-6 bg-slate-200 rounded w-20" />
            </div>
            <div className="h-8 bg-slate-200 rounded w-32" />
            <div className="h-2 bg-slate-200 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
