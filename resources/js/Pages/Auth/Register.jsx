    import { useState } from 'react';
    import { Head, useForm } from '@inertiajs/react';
    import { FiUser , FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
    import { motion, AnimatePresence } from 'framer-motion';

    export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
        onError: () => {
            // Bisa tambahkan toast notification di sini
        },
        });
    };

    return (
        <>
        <Head title="Register" />
        <motion.div
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: '100% 50%' }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black bg-[length:200%_200%]"
        >
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-md bg-black/80 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.15)] border border-gray-700 p-12 relative"
            style={{
                boxShadow:
                '0 0 20px 3px rgba(255, 255, 255, 0.1), 0 0 40px 10px rgba(255, 255, 255, 0.05)',
            }}
            >
            <h2
                className="text-4xl font-extrabold mb-10 text-center text-white"
                style={{
                textShadow:
                    '0 0 8px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)',
                }}
            >
                Create Account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div className="relative group">
                <FiUser 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300"
                    size={22}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-black/70 placeholder:text-gray-400 text-white rounded-xl border border-gray-700 focus:border-white focus:bg-black/90 focus:outline-none transition-all duration-300"
                    required
                    autoComplete="name"
                    style={{
                    boxShadow:
                        '0 0 8px rgba(255, 255, 255, 0.15), inset 0 0 6px rgba(255, 255, 255, 0.1)',
                    }}
                />
                <AnimatePresence>
                    {errors.name && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-red-500 text-sm mt-1 select-none"
                    >
                        {errors.name}
                    </motion.p>
                    )}
                </AnimatePresence>
                </div>

                {/* Email */}
                <div className="relative group">
                <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300"
                    size={22}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-black/70 placeholder:text-gray-400 text-white rounded-xl border border-gray-700 focus:border-white focus:bg-black/90 focus:outline-none transition-all duration-300"
                    required
                    autoComplete="email"
                    style={{
                    boxShadow:
                        '0 0 8px rgba(255, 255, 255, 0.15), inset 0 0 6px rgba(255, 255, 255, 0.1)',
                    }}
                />
                <AnimatePresence>
                    {errors.email && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-red-500 text-sm mt-1 select-none"
                    >
                        {errors.email}
                    </motion.p>
                    )}
                </AnimatePresence>
                </div>

                {/* Password */}
                <div className="relative group">
                <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300"
                    size={22}
                />
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-black/70 placeholder:text-gray-400 text-white rounded-xl border border-gray-700 focus:border-white focus:bg-black/90 focus:outline-none transition-all duration-300"
                    required
                    autoComplete="new-password"
                    style={{
                    boxShadow:
                        '0 0 8px rgba(255, 255, 255, 0.15), inset 0 0 6px rgba(255, 255, 255, 0.1)',
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                </button>
                <AnimatePresence>
                    {errors.password && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-red-500 text-sm mt-1 select-none"
                    >
                        {errors.password}
                    </motion.p>
                    )}
                </AnimatePresence>
                </div>

                {/* Password Confirmation */}
                <div className="relative group">
                <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300"
                    size={22}
                />
                <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-black/70 placeholder:text-gray-400 text-white rounded-xl border border-gray-700 focus:border-white focus:bg-black/90 focus:outline-none transition-all duration-300"
                    required
                    autoComplete="new-password"
                    style={{
                    boxShadow:
                        '0 0 8px rgba(255, 255, 255, 0.15), inset 0 0 6px rgba(255, 255, 255, 0.1)',
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label={showPasswordConfirm ? 'Hide password confirmation' : 'Show password confirmation'}
                >
                    {showPasswordConfirm ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                </button>
                <AnimatePresence>
                    {errors.password_confirmation && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-red-500 text-sm mt-1 select-none"
                    >
                        {errors.password_confirmation}
                    </motion.p>
                    )}
                </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                type="submit"
                disabled={processing}
                whileHover={{
                    scale: 1.05,
                    boxShadow:
                    '0 0 15px 3px rgba(255, 255, 255, 0.6), 0 0 30px 6px rgba(255, 255, 255, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white font-extrabold rounded-2xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                style={{
                    textShadow:
                    '0 0 6px rgba(255, 255, 255, 0.4), 0 0 12px rgba(255, 255, 255, 0.2)',
                }}
                >
                {processing ? 'Registering...' : 'Register'}
                </motion.button>
            </form>

            <p className="mt-8 text-center text-gray-400 select-none">
                Already have an account?{' '}
                <a
                href="/login"
                className="font-semibold text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-300"
                >
                Login
                </a>
            </p>
            </motion.div>
        </motion.div>
        </>
    );
    }
