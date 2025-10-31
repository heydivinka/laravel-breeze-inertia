    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import {
    Users,
    UserCheck,
    Box,
    TrendingUp,
    CheckCircle2,
    } from "lucide-react";
    import { Bar } from "react-chartjs-2";
    import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    } from "chart.js";

    // Register chart elements
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    export default function DashboardUser({ auth }) {
    const [dashboardStats, setDashboardStats] = useState({
        students: 0,
        teachers: 0,
        inventories: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
        try {
            const resStudents = await fetch("/api/students");
            const dataStudents = await resStudents.json();
            const resTeachers = await fetch("/api/teachers");
            const dataTeachers = await resTeachers.json();
            const resInventories = await fetch("/api/inventories");
            const dataInventories = await resInventories.json();

            setDashboardStats({
            students: dataStudents.length,
            teachers: dataTeachers.length,
            inventories: dataInventories.length,
            });
        } catch (err) {
            console.error("Gagal fetch stats:", err);
        }
        };

        fetchStats();
    }, []);

    const barData = {
        labels: ["Students", "Teachers", "Inventories"],
        datasets: [
        {
            label: "Jumlah",
            data: [
            dashboardStats.students,
            dashboardStats.teachers,
            dashboardStats.inventories,
            ],
            backgroundColor: ["#4f46e5", "#10b981", "#8b5cf6"],
            borderRadius: 12,
            barThickness: 40,
        },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
        legend: { display: false },
        tooltip: {
            enabled: true,
            backgroundColor: "#1f2937",
            titleColor: "#f3f4f6",
            bodyColor: "#f3f4f6",
        },
        },
        scales: {
        y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
        },
        x: {
            grid: { display: false },
        },
        },
    };

    return (
        <AuthenticatedLayout auth={auth} header="Dashboard" title="Dashboard">
        <Head title="Dashboard" />

        <main className="flex-1 p-6 space-y-6">
            {/* Greeting */}
            <div className="text-2xl font-bold text-gray-800">
            Halo, <span className="text-indigo-600">{auth.user.name}</span> 👋
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
                <Users className="text-indigo-500 w-8 h-8 mb-4" />
                <h3 className="text-gray-500 font-medium">Students</h3>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.students}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
                <UserCheck className="text-emerald-500 w-8 h-8 mb-4" />
                <h3 className="text-gray-500 font-medium">Teachers</h3>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.teachers}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
                <Box className="text-purple-500 w-8 h-8 mb-4" />
                <h3 className="text-gray-500 font-medium">Inventories</h3>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.inventories}</p>
            </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-6 border border-gray-200">
            <h2 className="text-gray-700 font-semibold mb-4">Statistik Modul</h2>
            <Bar data={barData} options={barOptions} />
            </div>

            {/* Recent Activities */}
            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-6 border border-gray-200">
            <h2 className="text-gray-700 font-semibold mb-4">Aktivitas Terbaru</h2>
            <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3 hover:text-gray-900 transition-colors">
                <TrendingUp className="w-5 h-5 text-indigo-500" /> Data siswa baru ditambahkan
                </li>
                <li className="flex items-center gap-3 hover:text-gray-900 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Data guru diperbarui
                </li>
                <li className="flex items-center gap-3 hover:text-gray-900 transition-colors">
                <Box className="w-5 h-5 text-purple-500" /> Inventaris terbaru masuk
                </li>
            </ul>
            </div>
        </main>
        </AuthenticatedLayout>
    );
    }
