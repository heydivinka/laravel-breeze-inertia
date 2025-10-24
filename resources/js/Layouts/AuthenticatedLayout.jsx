import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Sidebar from "@/Components/Sidebar";

export default function AuthenticatedLayout({ auth, header, children, title = "App" }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex"> 
            {/* Sidebar */}
            <Sidebar />

            {/* Main area */}
            <div className="flex-1 flex flex-col">
                <Head title={title} />
                <Navbar auth={auth} className="sticky top-0 z-10 shadow-lg bg-gray-900" />

                <main className="flex-1 p-6 md:p-8 bg-slate-900/90 backdrop-blur-sm">
                    {/* Header tanpa <h1> */}
                    {header && (
                        <header className="mb-6 pb-3 border-b border-indigo-500/30">
                            {header}
                        </header>
                    )}
                    {children}
                </main>

                <Footer className="border-t border-slate-700/50 p-4 text-center text-sm text-gray-500" />
            </div>
        </div>
    );
}
