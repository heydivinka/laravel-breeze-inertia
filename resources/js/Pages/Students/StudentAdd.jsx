    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import StudentForm from "@/Components/Students/StudentForm";
    import StudentTable from "@/Components/Students/StudentTable";
    import api from "@/utils/api";

    export default function StudentAdd({ auth }) {
    const [selected, setSelected] = useState(null);
    const [students, setStudents] = useState([]);

    // ambil semua data siswa
    const fetchStudents = async () => {
        try {
        const res = await api.get("/students");
        setStudents(res.data);
        } catch (e) {
        console.error("fetchStudents error:", e);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <AuthenticatedLayout
        auth={auth}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Siswa</h2>}
        title="Manajemen Siswa"
        >
        <Head title="Manajemen Siswa" />

        <div className="min-h-screen bg-white text-gray-900 px-8 py-10">
            {/* Header */}
            <h1 className="text-3xl font-bold mb-6">
            {selected ? "Edit Data Siswa" : "Tambah Data Siswa"}
            </h1>

            {/* Form Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
            <StudentForm
                fetchStudents={fetchStudents}
                selected={selected}
                setSelected={setSelected}
            />
            </div>

            {/* Table Section
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Daftar Siswa</h2>
            <StudentTable
                students={students}
                fetchStudents={fetchStudents}
                setSelected={setSelected}
            />
            </div> */}
        </div>
        </AuthenticatedLayout>
    );  
    }
