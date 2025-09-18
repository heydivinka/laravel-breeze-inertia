    // Sidebar.jsx
    import { motion } from 'framer-motion';
    import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
    import { Inertia } from '@inertiajs/inertia';

    export default function Sidebar({ role }) {
    const links = role === 'admin'
        ? [
            { name: 'Users', icon: <FiUser />, href: '#' },
            { name: 'Settings', icon: <FiSettings />, href: '#' },
        ]
        : [
            { name: 'Profile', icon: <FiUser />, href: '#' },
        ];

    return (
        <motion.div initial={{ x: -200 }} animate={{ x: 0 }} className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Dashboard {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
        <nav className="flex flex-col gap-4">
            {links.map((link) => (
            <a key={link.name} href={link.href} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                {link.icon} {link.name}
            </a>
            ))}
            <button
            onClick={(e) => { e.preventDefault(); Inertia.post('/logout'); }}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 mt-auto"
            >
            <FiLogOut /> Logout
            </button>
        </nav>
        </motion.div>
    );
    }
