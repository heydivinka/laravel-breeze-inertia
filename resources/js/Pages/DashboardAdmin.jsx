    import { Inertia } from '@inertiajs/inertia';
    import { motion } from 'framer-motion';
    import { FiUser , FiSettings, FiLogOut } from 'react-icons/fi';

    export default function DashboardAdmin({ user }) {
    return (
        <div className="min-h-screen flex text-white bg-gradient-to-r from-black via-gray-900 to-black">
        {/* Sidebar */}
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="w-64 bg-black/80 backdrop-blur-md border border-gray-700 shadow-lg p-6 flex flex-col"
            style={{
            boxShadow:
                '0 0 20px 3px rgba(255, 255, 255, 0.1), 0 0 40px 10px rgba(255, 255, 255, 0.05)',
            }}
        >
            <h1 className="text-2xl font-bold mb-8 text-white">Admin Panel</h1>
            <nav className="flex flex-col gap-4 flex-1">
            <a
                href="#users"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
                <FiUser  /> Users
            </a>
            <a
                href="#settings"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
                <FiSettings /> Settings
            </a>
            <button
                onClick={(e) => {
                e.preventDefault();
                Inertia.post('/logout');
                }}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 mt-auto transition-colors"
            >
                <FiLogOut /> Logout
            </button>
            </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-black/80 backdrop-blur-md rounded-3xl m-6 border border-gray-700 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            >
            <h2 className="text-3xl font-semibold text-white">Welcome, {user.name}</h2>
            <p className="text-gray-400">Role: {user.role}</p>
            </motion.div>

            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
            <div className="bg-black/70 rounded-xl p-6 hover:scale-105 transition-transform border border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">Total Users</h3>
                <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-black/70 rounded-xl p-6 hover:scale-105 transition-transform border border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">Active Sessions</h3>
                <p className="text-2xl font-bold">7</p>
            </div>
            <div className="bg-black/70 rounded-xl p-6 hover:scale-105 transition-transform border border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">Pending Requests</h3>
                <p className="text-2xl font-bold">3</p>
            </div>
            </motion.div>
        </div>
        </div>
    );
    }
