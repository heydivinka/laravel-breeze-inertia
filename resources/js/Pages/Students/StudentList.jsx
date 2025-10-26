// resources/js/Pages/Students/StudentList.jsx

import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StudentTable from "@/Components/Students/StudentTable";
import StudentSearch from "@/Components/Students/StudentSearch";
import StudentFormModal from "@/Components/Students/StudentFormModal";
import api from "@/utils/api";
import Swal from "sweetalert2";

export default function StudentList({ auth, students: initialStudentsProp }) {
    const [students, setStudents] = useState(
        Array.isArray(initialStudentsProp) ? initialStudentsProp : []
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ambil data siswa
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/students");
            setStudents(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error("fetchStudents", e);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!students || students.length === 0) {
            fetchStudents();
        }
    }, []);

    // Hapus siswa
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus data ini?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        });
        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/students/${id}`);
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("delete student", err);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
    };

    // Edit siswa
    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    // Tambah siswa (navigasi via Inertia)
    const handleAddStudent = () => {
        router.get(route("students.create"));
    };

    // Callback setelah simpan dari modal
    const handleSaved = (savedStudent) => {
        if (!savedStudent) {
            fetchStudents();
            return;
        }

        const exists = students.find((s) => s.id === savedStudent.id);

        setStudents((prev) => {
            if (exists) {
                return prev.map((s) => (s.id === savedStudent.id ? savedStudent : s));
            } else {
                return [savedStudent, ...prev];
            }
        });

        if (exists) {
            Swal.fire("Berhasil!", "Data siswa berhasil diperbarui.", "success");
        } else {
            Swal.fire("Berhasil!", "Siswa baru berhasil ditambahkan.", "success");
        }
    };

    // Filter pencarian
    const filtered = students.filter((s) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        if (term.startsWith("#")) {
            const idSearch = term.slice(1);
            return s.id.toString() === idSearch;
        }
        return (
            (s.nisin || "").toLowerCase().includes(term) ||
            (s.nama_lengkap || "").toLowerCase().includes(term) ||
            (s.jurusan || "").toLowerCase().includes(term)
        );
    });

    return (
        <AuthenticatedLayout auth={auth} header="Daftar Student" title="Daftar Student">
            <Head title="Daftar Student" />
            <div className="min-h-screen bg-white text-slate-900 px-8 py-10 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Daftar Student</h1>

                <StudentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {loading ? (
                    <div className="text-center mt-10 text-gray-500">Memuat data...</div>
                ) : (
                    <StudentTable
                        data={filtered}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAdd={handleAddStudent}
                    />
                )}
            </div>

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudent(null);
                }}
                student={selectedStudent}
                onSaved={(s) => {
                    handleSaved(s);
                    setIsModalOpen(false);
                    setSelectedStudent(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
