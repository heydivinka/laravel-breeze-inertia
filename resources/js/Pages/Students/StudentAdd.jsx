import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StudentForm from "@/Components/Students/StudentForm";
import api from "@/utils/api";

export default function StudentAdd({ auth }) {
    const [selected, setSelected] = useState(null);

    // Optional: fetch data jika diperlukan untuk validasi atau pre-load dropdown
    const fetchStudents = async () => {
        try {
            await api.get("/students");
        } catch (e) {
            // intentionally ignored
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <AuthenticatedLayout
            auth={auth}
            header="Tambah Data Siswa" // disamakan formatnya dengan TeacherAdd.jsx
            title="Tambah Siswa"
        >
            <Head title="Tambah Siswa" />

            {/* StudentForm sekarang tanggung jawab styling sendiri (mirip TeacherForm) */}
            <StudentForm
                fetchStudents={fetchStudents}
                selected={selected}
                setSelected={setSelected}
            />

            {/* 
                Jika nanti ingin bungkus manual dengan ContentCard, formatnya sama seperti:
                <ContentCard title="Formulir Siswa Baru">
                    <StudentForm fetchStudents={fetchStudents} selected={selected} setSelected={setSelected} />
                </ContentCard>
            */}
        </AuthenticatedLayout>
    );
}
