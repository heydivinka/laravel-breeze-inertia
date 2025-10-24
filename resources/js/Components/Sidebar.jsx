import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react"; 
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Framer Motion Variants ---
const itemHoverVariants = {
    hover: {
        scale: 1.01,
        x: 4, 
        transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    rest: {
        scale: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
    },
};

const submenuVariants = {
    open: {
        opacity: 1,
        height: "auto",
        transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.4 },
    },
    closed: {
        opacity: 0,
        height: 0,
        transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.3 },
    },
};

// --- Submenu Component (Modularized) ---
const SubMenu = ({ item, open, toggleSubmenu, activeSubmenu, url }) => {
    const isSubmenuOpen = activeSubmenu === item.name;
    const isAnySubActive = item.submenu.some(
        (sub) => url.startsWith(sub.path) && sub.path !== "/"
    );
    const isCurrentlyActive = isSubmenuOpen || isAnySubActive;

    return (
        <div key={item.name} className="overflow-hidden">
            <motion.button
                onClick={() => toggleSubmenu(item.name)}
                variants={itemHoverVariants}
                whileHover="hover"
                initial="rest"
                className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg font-medium transition-colors duration-300 w-full text-left
                ${
                    isCurrentlyActive
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "hover:bg-slate-700 text-slate-300"
                }`}
            >
                <span className="flex items-center gap-3">
                    {item.icon}
                    {open && item.name}
                </span>
                {open && (
                    <motion.div
                        animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={16} />
                    </motion.div>
                )}
            </motion.button>

            <AnimatePresence>
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
                                    className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 
                                        ${
                                            isSubActive
                                                ? "bg-indigo-700 text-white font-semibold border-l-4 border-indigo-300"
                                                : "hover:bg-slate-700 text-slate-300 hover:text-white"
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

// --- NavItem Component (Modularized) ---
const NavItem = ({ item, open, url }) => {
    const isActive = url === item.path; 

    return (
        <motion.div
            key={item.name}
            variants={itemHoverVariants}
            whileHover="hover"
            initial="rest"
        >
            <Link
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors duration-300 
                    ${
                        isActive
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "hover:bg-slate-700 text-slate-300"
                    }`}
            >
                {item.icon}
                <AnimatePresence>
                    {open && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {item.name}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
    );
};

// --- Main Sidebar Component ---
export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const { url } = usePage(); 

    const navItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" }, 
        {
            name: "Students",
            icon: <Users size={20} />,
            submenu: [
                { name: "List Students", path: "/students" },
                { name: "Add Student", path: "/students/add" },
                // { name: "Student Stats", path: "/students/stats" },
            ],
        },
        {
            name: "Teachers",
            icon: <GraduationCap size={20} />,
            submenu: [
                { name: "List Teachers", path: "/teachers" },
                { name: "Add Teacher", path: "/teachers/add" },
                // { name: "Teacher Stats", path: "/teachers/stats" },
            ],
        },
        {
            name: "Inventories",
            icon: <Boxes size={20} />,
            submenu: [
                { name: "List Inventory", path: "/inventories" },
                { name: "Add Inventory", path: "/inventories/add" },
                // { name: "Inventory Stats", path: "/inventories/stats" },
            ],
        },
    ];

    const toggleSubmenu = (name) => {
        setActiveSubmenu(activeSubmenu === name ? null : name);
    };

    return (
        // Key FIX: Changed h-screen to min-h-full (or h-full if parent is correct)
        <aside
            className={`bg-slate-900 border-r border-slate-700 text-white min-h-full transition-all duration-300 flex flex-col shadow-2xl z-20 
            ${
                open ? "w-64" : "w-20"
            }`}
        >
            {/* Header / Logo Section */}
            <div className="p-5 flex justify-between items-center relative border-b border-slate-800">
                <AnimatePresence>
                    {open && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-extrabold text-2xl tracking-widest text-indigo-400 select-none"
                        >
                            PRO-APP
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Collapse Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 
                            text-indigo-300 hover:text-white hover:bg-slate-700 transition-colors duration-300"
                    aria-label={open ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    <motion.div
                        animate={{ rotate: open ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <ChevronLeft size={20} />
                    </motion.div>
                </button>
            </div>

            {/* Main Navigation (flex-1 ensures it pushes the footer down) */}
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

            {/* Footer Section (mt-auto ensures this section is at the very bottom) */}
            <div className="p-3 mt-auto border-t border-slate-700 flex flex-col gap-2">
                {/* Settings Link */}
                <motion.div variants={itemHoverVariants} whileHover="hover" initial="rest">
                    <Link
                        href="/settings"
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors duration-300 
                            ${
                                url === "/settings"
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "hover:bg-slate-700 text-slate-300"
                            }`}
                    >
                        <Settings size={20} />
                        {open && "Settings"}
                    </Link>
                </motion.div>

                {/* Mock User Profile Area */}
                <div
                    className={`p-3 rounded-xl bg-slate-800 flex items-center transition-opacity duration-300 ${
                        open ? "opacity-100" : "opacity-0 h-0 p-0"
                    }`}
                >
                    <UserCircle size={40} className="text-indigo-400 flex-shrink-0" />
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="ml-3 truncate"
                            >
                                <p className="text-sm font-semibold truncate">Jane Doe</p>
                                <p className="text-xs text-slate-400 truncate">Admin</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Functional Logout Button */}
                    {open && (
                        <button
                            onClick={() => router.post(route("logout"))} 
                            className="ml-auto p-2 text-slate-400 hover:text-red-400 transition-colors duration-200"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}