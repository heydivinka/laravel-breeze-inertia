    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import StudentTable from "@/Components/Students/StudentTable";
    import StudentSearch from "@/Components/Students/StudentSearch";
    import StudentFormModal from "@/Components/Students/StudentFormModal";
    import api from "@/utils/api";
    import Swal from "sweetalert2";

    export default function StudentList({ auth }) {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

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
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
        title: "Hapus data ini?",
        text: "Data yang dihapus tidak bisa dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
        await api.delete(`/students/${id}`);
        await Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            timer: 1500,
            showConfirmButton: false,
        });
        fetchStudents();
        } catch (e) {
        console.error("delete student", e);
        Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Terjadi kesalahan saat menghapus data.",
        });
        }
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const filtered = students.filter((s) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
        (s.nisin || "").toLowerCase().includes(term) ||
        (s.nama_lengkap || "").toLowerCase().includes(term) ||
        (s.jurusan || "").toLowerCase().includes(term)
        );
    });

    return (
        <AuthenticatedLayout auth={auth} title="Daftar Students">
        <Head title="Daftar Students" />
        <div className="min-h-screen px-8 py-10 bg-white text-gray-900">
            <h1 className="text-3xl font-bold mb-6">Daftar Students</h1>

            <StudentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {loading ? (
            <div className="text-center mt-10 text-gray-500 animate-pulse">
                Loading data...
            </div>
            ) : (
            <StudentTable
                data={filtered}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
            )}
        </div>

        {/* ✅ Modal sekarang sudah pakai prop yang benar */}
        <StudentFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            student={selectedStudent}
            refresh={fetchStudents}
        />
        </AuthenticatedLayout>
    );
    }
