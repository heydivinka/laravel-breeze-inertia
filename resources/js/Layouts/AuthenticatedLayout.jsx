import { useState } from "react";
import { Head } from "@inertiajs/react";
// Pastikan path ini benar
import Navbar from "@/Components/Navbar"; 
import Footer from "@/Components/Footer";
import Sidebar from "@/Components/Sidebar"; 

export default function AuthenticatedLayout({ auth, header, children, title = "App" }) {
    // STATE sentral untuk mengontrol status sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fungsi TOGGLE
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // Kelas padding yang mendorong konten utama sesuai lebar sidebar
    // W-64 (Sidebar Buka) -> ml-64 (Hanya di layar besar/desktop)
    // W-20 (Sidebar Tutup) -> ml-20 (Hanya di layar besar/desktop)
    // Di mobile (tanpa prefix), padding/margin akan 0
    const sidebarPushClass = isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'; 

    // Tinggi Navbar (misalnya 60px)
    const NAVBAR_HEIGHT = '60px'; // Gunakan nilai yang konsisten

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Head title={title} />

            {/* ===== 1. NAVBAR (Header) ===== */}
            {/* Navbar harus menggunakan z-index yang lebih tinggi dari Sidebar (z-30 vs z-20) */}
            <Navbar
                auth={auth}
                className={`fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white border-b border-gray-800 shadow-md flex items-center justify-between px-6 py-3 transition-all duration-300 h-[${NAVBAR_HEIGHT}]`}
            >
                {/* Tombol Toggle Sidebar (Pertahankan ini untuk Mobile) */}
                <button
                    onClick={toggleSidebar}
                    className="text-gray-300 hover:text-white focus:outline-none lg:hidden" // Tampilkan di mobile, sembunyikan di desktop
                >
                    {isSidebarOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>

                <h1 className="text-lg font-semibold">Dashboard</h1>
            </Navbar>

            {/* ===== 2. MAIN WRAPPER (Sidebar & Content) ===== */}
            {/* Memberi padding atas sebesar tinggi navbar */}
            <div className={`flex flex-1 pt-[${NAVBAR_HEIGHT}]`}> 
                
                {/* 2a. SIDEBAR */}
                {/* Hapus tag <aside> yang membungkus <Sidebar>, karena logika 'fixed' dan lebar sudah ada di dalam komponen Sidebar */}
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    toggleSidebar={toggleSidebar} // Ganti 'onToggle' menjadi 'toggleSidebar' agar konsisten
                />

                {/* 2b. CONTENT */}
                <main
                    className={`
                        flex-1 bg-gray-100 min-h-screen transition-all duration-300 overflow-x-hidden 
                        ${sidebarPushClass} // Gunakan prefix lg:ml- untuk desktop
                        ml-0 // Pastikan margin 0 di mobile
                    `}
                >
                    {/* Header dan konten utama */}
                    <div className="p-6">
                        {header && (
                            <header className="mb-6 pb-3 border-b border-gray-200">
                                {header}
                            </header>
                        )}
                        {children}
                    </div>
                </main>
            </div>

            {/* ===== 3. FOOTER ===== */}
            <Footer className="bg-gray-900 text-gray-400 border-t border-gray-800 text-center py-4" />
        </div>
    );
}