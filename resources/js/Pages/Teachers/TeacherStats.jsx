    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import TeacherStats from "@/Components/Teachers/TeacherStats";
    import api from "@/utils/api";

    export default function TeacherStatsPage({ auth }) {
    const [teachers, setTeachers] = useState([]);

    const fetchTeachers = async () => {
        try {
        const res = await api.get("/api/teachers");
        setTeachers(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
        console.error("fetchTeachers", e);
        setTeachers([]);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <AuthenticatedLayout auth={auth} header={<h2>Statistik Teacher</h2>} title="Statistik Teacher">
        <Head title="Statistik Teacher" />
        <div className="min-h-screen bg-black text-white px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">Statistik Teacher</h1>
            <TeacherStats teachers={teachers} />
        </div>
        </AuthenticatedLayout>
    );
    }
