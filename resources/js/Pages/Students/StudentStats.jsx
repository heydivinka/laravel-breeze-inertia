    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import StudentStats from "@/Components/Students/StudentStats";
    import api from "@/utils/api";

    export default function StudentStatsPage({ auth }) {
    const [stats, setStats] = useState({ total: 0, aktif: 0, tidakAktif: 0 });

    const fetchStats = async () => {
        try {
        const res = await api.get("/students");
        const data = Array.isArray(res.data) ? res.data : [];
        const aktif = data.filter((s) => s.is_active === 1 || s.is_active === true || s.is_active === "1").length;
        setStats({ total: data.length, aktif, tidakAktif: data.length - aktif });
        } catch (e) {
        console.error("fetchStats", e);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <AuthenticatedLayout auth={auth} header={<h2>Statistik Siswa</h2>} title="Statistik Siswa">
        <Head title="Statistik Siswa" />
        <div className="min-h-screen bg-black text-white px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">Statistik Siswa</h1>
            <StudentStats stats={stats} />
        </div>
        </AuthenticatedLayout>
    );
    }
