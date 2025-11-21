import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Boxes,
    Settings,
    LogOut,
    UserCircle,
    ChevronLeft,
    ChevronDown,
    BookOpen,
    Calendar,
    BarChart2,
    Archive,
    Bell,
    FileText,
    CreditCard,
    Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- SIMULASI INERTIA.JS UNTUK KOMPILASI STABIL ---
// Mocking components and functions
const Link = ({ href, className, children }) => (<a href={href} className={className}>{children}</a>);
const route = (name) => {
    const routes = { 'logout': '/logout' };
    return routes[name] || '#';
};
const router = { 
    post: (path) => { 
        console.log(`Simulasi POST request ke: ${path}.`);
        if (typeof window !== 'undefined') { window.location.pathname = '/'; }
    } 
};
const usePage = () => ({ url: typeof window !== 'undefined' ? window.location.pathname : '/' });

/* ------------------------- */
/* Framer Motion Variants    */
/* ------------------------- */
const itemHoverVariants = {
    hover: { scale: 1.02, x: 6, transition: { type: "spring", stiffness: 300, damping: 20 } },
    rest: { scale: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

const submenuVariants = {
    open: { opacity: 1, height: "auto", transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.35 } },
    closed: { opacity: 0, height: 0, transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.25 } },
};

// Varian untuk menghilangkan teks dengan sangat cepat (duration 0.1)
const textTransitionVariants = {
    enter: { opacity: 1, transition: { duration: 0.1 } }, // Sangat cepat saat muncul
    exit: { opacity: 0, transition: { duration: 0.1 } }, // Sangat cepat saat hilang
};

/* ------------------------- */
/* SubMenu Component         */
/* ------------------------- */
const SubMenu = ({ item, open, toggleSubmenu, activeSubmenu, url }) => {
    const isSubmenuOpen = activeSubmenu === item.name;
    // Menggunakan startsWith karena kita tidak memiliki fungsi Inertia.js route() yang sebenarnya
    const isAnySubActive = item.submenu.some((sub) => url.startsWith(sub.path) && sub.path !== "/");
    const isCurrentlyActive = isSubmenuOpen || isAnySubActive;

    return (
        <div key={item.name} className="overflow-hidden">
            <motion.button
                type="button"
                onClick={() => toggleSubmenu(item.name)}
                variants={itemHoverVariants}
                whileHover="hover"
                initial="rest"
                className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left ${
                    isCurrentlyActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "hover:bg-gray-100 text-gray-700"
                }`}
            >
                <span className="flex items-center gap-3">
                    <span className="text-indigo-600">{item.icon}</span>
                    {open && <span className="truncate">{item.name}</span>}
                </span>

                {open && (
                    // Mempercepat rotasi ikon
                    <motion.div animate={{ rotate: isSubmenuOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                        <ChevronDown size={16} className="text-gray-500" />
                    </motion.div>
                )}
            </motion.button>

            <AnimatePresence initial={false}>
                {isSubmenuOpen && open && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={submenuVariants}
                        className="flex flex-col pl-10 mt-1 gap-1 overflow-hidden"
                    >
                        {item.submenu.map((sub) => {
                            const isSubActive = url === sub.path;
                            return (
                                <Link
                                    key={sub.name}
                                    href={sub.path}
                                    className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                                        isSubActive
                                            ? "bg-indigo-100 text-indigo-700 font-semibold border-l-4 border-indigo-300"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {sub.name}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ------------------------- */
/* NavItem Component         */
/* ------------------------- */
const NavItem = ({ item, open, url }) => {
    const isActive = url === item.path;
    return (
        <motion.div key={item.name} variants={itemHoverVariants} whileHover="hover" initial="rest">
            <Link
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "hover:bg-gray-100 text-gray-700"
                }`}
            >
                <span className="text-indigo-600">{item.icon}</span>
                <AnimatePresence>
                    {open && (
                        <motion.span 
                            variants={textTransitionVariants} // Gunakan varian yang lebih cepat
                            initial="exit" 
                            animate="enter" 
                            exit="exit"
                        >
                            {item.name}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
    );
};

/* ------------------------- */
/* Sidebar Component         */
/* ------------------------- */
export default function Sidebar({ isOpen, toggleSidebar }) {
    // Tetapkan nilai prop isOpen ke variabel lokal untuk kemudahan
    const open = isOpen; 
    
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const { url } = usePage();
    const sidebarRef = useRef(null);

    // Efek untuk menutup submenu ketika sidebar dikecilkan
    useEffect(() => {
        if (!open) setActiveSubmenu(null);
    }, [open]);

    const toggleSubmenu = (name) => {
        setActiveSubmenu((prev) => (prev === name ? null : name));
    };

    const handleLogout = async () => {
        // Mengganti alert/confirm dengan custom modal
        if (typeof window !== 'undefined' && window.confirm("Anda yakin ingin logout?")) {
            try {
                router.post(route("logout"));
            } catch (err) {
                console.error("Logout error", err);
            }
        }
    };

    /* ------------------------- */
    /* Navigation Items          */
    /* ------------------------- */
    const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    {
        name: "Students",
        icon: <Users size={20} />,
        submenu: [
            { name: "List Students", path: "/students" },
            { name: "Add Student", path: "/students/add" },
        ],
    },
    {
        name: "Teachers",
        icon: <GraduationCap size={20} />,
        submenu: [
            { name: "List Teachers", path: "/teachers" },
            { name: "Add Teacher", path: "/teachers/add" },
        ],
    },
    {
        name: "Inventories",
        icon: <Boxes size={20} />,
        submenu: [
            { name: "List Inventory", path: "/inventories" },
            { name: "Add Inventory", path: "/inventories/add" },
        ],
    },
    {
    name: "Category",
    icon: <Calendar size={20} />,
    submenu: [
        { name: "Category Page", path: "/categories" },
        { name: "Category Show", path: "/categories/1" }, // Contoh default path ke 1
    ],
},
{
    name: "Peminjaman",
    icon: <BookOpen size={20} />,
    submenu: [
        { name: "List Peminjaman", path: "/peminjaman" },
        { name: "Add Peminjaman", path: "/peminjaman/add" },
    ],
},

    {
        name: "Analytics",
        icon: <BarChart2 size={20} />,
        submenu: [{ name: "Overview", path: "/analytics" }],
    },
    {
        name: "Archive",
        icon: <Archive size={20} />,
        submenu: [{ name: "Old Records", path: "/archive" }],
    },
];


    /* ------------------------- */
    /* Render                    */
    /* ------------------------- */
    return (
        <aside
            ref={sidebarRef}
            // PENTING: top-[64px] dan h-[calc(100vh-64px)] agar dimulai tepat di bawah Navbar
            className={`
                fixed top-[64px] left-0 
                h-[calc(100vh-64px)] 
                bg-white border-r border-gray-200 text-gray-900 shadow-xl z-30 
                transition-all duration-300 
                ${open ? "w-64" : "w-20"}
                // Sembunyikan di mobile, biarkan muncul hanya di desktop (lg:)
                hidden lg:block
            `}
        >
            {/* Header / Logo */}
            <div className="p-5 flex items-center justify-between relative border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {open && (
                            <motion.span
                                // Mempercepat animasi teks logo saat keluar
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
                                className="font-extrabold text-lg tracking-wide text-indigo-600 select-none"
                            >
                                PRO-APP
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {!open && (
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-50">
                            <svg
                                className="w-5 h-5 text-indigo-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M3 12h18M3 6h18M3 18h18"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Tombol Toggle yang memanggil props toggleSidebar */}
                <button
                    onClick={toggleSidebar} 
                    aria-label={open ? "Collapse Sidebar" : "Expand Sidebar"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                    <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.15 }}>
                        <ChevronLeft size={18} />
                    </motion.div>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-4 flex flex-col gap-2 px-3 overflow-y-auto">
                {navItems.map((item) =>
                    item.submenu ? (
                        <SubMenu
                            key={item.name}
                            item={item}
                            open={open}
                            toggleSubmenu={toggleSubmenu}
                            activeSubmenu={activeSubmenu}
                            url={url}
                        />
                    ) : (
                        <NavItem key={item.name} item={item} open={open} url={url} />
                    )
                )}
            </nav>

            {/* Footer */}
            <div className="p-3 mt-auto border-t border-gray-200 flex flex-col gap-2">
                <Link
                    href="/settings"
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                        url === "/settings" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                    <span className="text-indigo-600">
                        <Settings size={18} />
                    </span>
                    <AnimatePresence>
                        {open && (
                             <motion.span 
                                variants={textTransitionVariants} // Gunakan varian yang lebih cepat
                                initial="exit" 
                                animate="enter" 
                                exit="exit"
                            >
                                Settings
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>

                {open && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="p-3 rounded-xl bg-gray-50 flex items-center overflow-hidden"
                    >
                        <UserCircle size={40} className="text-indigo-600 flex-shrink-0" />
                        <motion.div
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15 }}
                            className="ml-3 truncate"
                        >
                            <p className="text-sm font-semibold truncate">Jane Doe</p>
                            <p className="text-xs text-gray-500 truncate">Admin</p>
                        </motion.div>
                        <button
                            onClick={handleLogout}
                            className="ml-auto p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </motion.div>
                )}
            </div>
        </aside>
    );
}
