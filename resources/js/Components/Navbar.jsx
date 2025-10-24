import { useState } from 'react';
import { Bell, User, ChevronDown, LogOut, Settings, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- SIMULASI INERTIA.JS UNTUK KOMPILASI STABIL ---
// Mocking the Inertia router and Link components to ensure stable execution
const Link = ({ href, className, children, onClick }) => (
    <a href={href} className={className} onClick={onClick}>
        {children}
    </a>
);

const route = (name) => {
    const routes = {
        'logout': '/logout',
        'profile.edit': '/profile/edit'
    };
    return routes[name] || '#';
};

const router = {
    post: (path) => {
        console.log(`Simulasi POST request ke: ${path}. (Aksi logout disimulasikan)`);
        // Simulate a redirect after logout
        if (typeof window !== 'undefined') {
             window.location.pathname = '/'; 
        }
    }
};

// --- Navbar Component ---
// Navbar now accepts fixedWidth as a prop from AuthenticatedLayout (simulated as 'w-full')
export default function Navbar({ auth = { user: { name: 'Jane Doe', role: 'System Administrator' } }, fixedWidth = 'w-full' }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Using mock auth data if not provided
    const userName = auth?.user?.name || "User";
    const userRole = auth?.user?.role || "Admin"; 

    // Framer Motion variants for the dropdown animation
    const dropdownVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.95, 
            y: -5, 
            transition: { type: 'spring', stiffness: 300, damping: 30 } 
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            transition: { type: 'spring', stiffness: 300, damping: 20 } 
        },
    };

    const handleLogout = (e) => {
        e.preventDefault(); // Prevent default link behavior if Link was used
        router.post(route("logout"));
        setDropdownOpen(false);
    };

    return (
        // WHITE THEME: bg-white, border-slate-200, text-slate-700
        <header className={`fixed top-0 right-0 ${fixedWidth} h-16 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center text-slate-700 z-50 shadow-md shadow-slate-100/50`}>
            
            {/* Navigasi Kiri (Biasanya Title Halaman atau Search Bar) */}
            <div className="flex items-center gap-6">
                <div className="text-xl font-extrabold tracking-wider text-emerald-600">
                    PRO-APP
                </div>
                {/* Simulated Search Bar for professional feel */}
                <input 
                    type="text"
                    placeholder="Search modules, users, or reports..."
                    className="hidden lg:block w-72 h-10 px-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                />
            </div>

            {/* Ikon Kanan & Profile Area */}
            <div className="flex items-center gap-4">
                
                {/* Reports Icon (New) */}
                <BarChart3 
                    className="text-slate-500 hover:text-emerald-600 cursor-pointer transition duration-200" 
                    size={20} 
                    title="Reports"
                />

                {/* Notification Icon */}
                <div className="relative">
                    <Bell 
                        className="text-slate-500 hover:text-emerald-600 cursor-pointer transition duration-200" 
                        size={20} 
                        title="Notifications"
                    />
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                </div>
                
                {/* Profile Dropdown Trigger */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        // White Theme: Button BG transparent/light, hover BG light emerald
                        className="flex items-center gap-2 px-3 py-2 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-emerald-50"
                    >
                        {/* Icon color to dark emerald */}
                        <User className="text-emerald-600" size={20} />
                        <span className="text-sm font-medium text-slate-800 hidden sm:inline">{userName}</span>
                        <ChevronDown 
                            className={`text-slate-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                            size={16} 
                        />
                    </button>
                    
                    {/* Functional Dropdown Menu */}
                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={dropdownVariants}
                                // White Theme: Menu BG white, border light
                                className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-20 origin-top-right"
                            >
                                {/* User Info Header */}
                                <div className="p-4 border-b border-slate-200 bg-slate-50">
                                    <p className="font-bold text-sm truncate text-slate-800">{userName}</p>
                                    {/* Accent color to dark emerald */}
                                    <p className="text-xs text-emerald-600">{userRole}</p>
                                </div>
                                
                                {/* Menu Links */}
                                <Link 
                                    href={route('profile.edit')} 
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition duration-150 w-full"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <Settings size={16} className="text-slate-500 group-hover:text-emerald-600" /> 
                                    Profile Settings
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 w-full text-left border-t border-slate-200"
                                >
                                    <LogOut size={16} /> 
                                    Log Out
                                </button>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
