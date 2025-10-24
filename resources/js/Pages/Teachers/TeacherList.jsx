    // resources/js/Pages/Teachers/TeacherList.jsx
    import React, { useEffect, useState } from "react";
    import { Head, router } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import TeacherTable from "@/Components/Teachers/TeacherTable";
    import TeacherSearch from "@/Components/Teachers/TeacherSearch";
    import TeacherFormModal from "@/Components/Teachers/TeacherFormModal";
    import api from "@/utils/api";
    import Swal from "sweetalert2";

    export default function TeacherList({ auth, teachers: initialTeachersProp }) {
    const [teachers, setTeachers] = useState(Array.isArray(initialTeachersProp) ? initialTeachersProp : []);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Fetch teachers dari API
    const fetchTeachers = async () => {
        setLoading(true);
        try {
        const res = await api.get("/teachers");
        setTeachers(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
        console.error("fetchTeachers", e);
        setTeachers([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (!teachers || teachers.length === 0) {
        fetchTeachers();
        }
    }, []);

    // Hapus guru
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
        await api.delete(`/teachers/${id}`);
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
        console.error("delete teacher", err);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
    };

    // Edit guru (buka modal)
    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setModalOpen(true);
    };

    // Tambah guru (navigasi Inertia)
    const handleAddTeacher = () => {
        router.get(route("teachers.create"));
    };

    // Callback setelah save di modal
    const handleSaved = (savedTeacher) => {
        if (!savedTeacher) {
        fetchTeachers(); // fallback refresh
        return;
        }

        const exists = teachers.find((p) => p.id === savedTeacher.id);

        setTeachers((prev) => {
        if (exists) {
            return prev.map((p) => (p.id === savedTeacher.id ? savedTeacher : p));
        } else {
            return [savedTeacher, ...prev];
        }
        });

        // SweetAlert di luar setState supaya selalu muncul
        if (exists) {
        Swal.fire("Berhasil!", "Data guru berhasil diperbarui.", "success");
        } else {
        Swal.fire("Berhasil!", "Guru baru berhasil ditambahkan.", "success");
        }
    };

    // Filter search
    const filtered = teachers.filter((t) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        if (term.startsWith("#")) {
        const idSearch = term.slice(1);
        return t.id.toString() === idSearch;
        }
        return (
        (t.nip || "").toLowerCase().includes(term) ||
        (t.nama_lengkap || "").toLowerCase().includes(term) ||
        (t.jabatan || "").toLowerCase().includes(term)
        );
    });

    return (
        <AuthenticatedLayout auth={auth} header="Daftar Teacher" title="Daftar Teacher">
        <Head title="Daftar Teacher" />
        <div className="min-h-screen bg-white text-slate-900 px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">Daftar Teacher</h1>

            <TeacherSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {loading ? (
            <div className="text-center mt-10 text-gray-500">Memuat data...</div>
            ) : (
            <TeacherTable
                data={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAddTeacher}
            />
            )}
        </div>

        <TeacherFormModal
        isOpen={isModalOpen}
        onClose={() => {
            setModalOpen(false);
            setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
        onSaved={(t) => {
            handleSaved(t);
            setModalOpen(false);
            setSelectedTeacher(null);
        }} />
        </AuthenticatedLayout>
    );
    }
