import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Login - SkanicPinjam" />
      <motion.div
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: '100% 50%' }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-50 via-emerald-50 to-white p-4"
      >
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex flex-col items-center"
          >
            <div className="relative w-96 h-96">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Background shapes */}
                <defs>
                  <radialGradient id="bgGrad" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.1"/>
                    <stop offset="70%" stopColor="#34d399" stopOpacity="0.05"/>
                    <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <circle cx="200" cy="200" r="180" fill="url(#bgGrad)" opacity="0.6"/>
                
                {/* Student figure */}
                <g transform="translate(100, 180)">
                  <circle cx="50" cy="30" r="25" fill="#3b82f6"/>
                  <circle cx="35" cy="25" r="4" fill="white"/>
                  <circle cx="65" cy="25" r="4" fill="white"/>
                  <path d="M35 35 Q50 45 65 35" stroke="black" strokeWidth="2" fill="none"/>
                  <rect x="30" y="55" width="40" height="60" rx="20" fill="#1e40af"/>
                  <rect x="25" y="115" width="50" height="40" rx="10" fill="#1e3a8a"/>
                </g>

                {/* Teacher figure */}
                <g transform="translate(250, 150)">
                  <circle cx="50" cy="30" r="28" fill="#eab308"/>
                  <circle cx="38" cy="25" r="4" fill="white"/>
                  <circle cx="62" cy="25" r="4" fill="white"/>
                  <path d="M38 35 Q50 48 62 35" stroke="black" strokeWidth="2" fill="none"/>
                  <rect x="20" y="58" width="60" height="70" rx="25" fill="#b45309"/>
                  <path d="M30 128 L70 128 M50 135 L50 170" stroke="#92400e" strokeWidth="8" strokeLinecap="round"/>
                </g>

                {/* Book/Inventory stack */}
                <g transform="translate(175, 280)">
                  <rect x="0" y="0" width="60" height="80" rx="8" fill="#ec4899"/>
                  <rect x="5" y="5" width="50" height="70" rx="5" fill="#be185d" opacity="0.8"/>
                  <rect x="65" y="0" width="50" height="60" rx="6" fill="#8b5cf6"/>
                  <rect x="70" y="5" width="40" height="50" rx="4" fill="#7c3aed" opacity="0.8"/>
                  <rect x="125" y="20" width="40" height="40" rx="4" fill="#06b6d4"/>
                  <rect x="130" y="25" width="30" height="30" rx="3" fill="#0891b2" opacity="0.8"/>
                </g>

                {/* Decorative elements */}
                <circle cx="80" cy="80" r="40" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.7">
                  <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="20s" repeatCount="indefinite"/>
                </circle>
                <circle cx="320" cy="100" r="30" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" from="0 320 100" to="360 320 100" dur="25s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-gray-800 text-center">School Management System</h2>
            <p className="text-gray-600 text-center mt-2">Manage students, teachers & inventory</p>
          </motion.div>

          {/* Right Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 p-10"
          >
            {/* Branding */}
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-4"
              >
                SkanicPinjam
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold"
              >
                🔐 Admin Panel Login
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-lg"
                  required
                  autoComplete="email"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-sm mt-2 pl-12">
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-lg"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-sm mt-2 pl-12">
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={processing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-2xl shadow-xl focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {processing ? 'Signing In...' : 'Sign In to Admin'}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-gray-500 text-sm">
              Single admin account. Contact administrator for access.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
