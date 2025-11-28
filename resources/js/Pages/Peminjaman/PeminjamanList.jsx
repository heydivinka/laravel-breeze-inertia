import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PeminjamanTable from "@/Components/Peminjaman/PeminjamanTable";
import api from "@/utils/api";
import Swal from "sweetalert2";

export default function PeminjamanList({ auth, peminjaman: initialData }) {
    const [peminjaman, setPeminjaman] = useState(Array.isArray(initialData) ? initialData : []);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/peminjaman");
            setPeminjaman(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setPeminjaman([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!peminjaman || peminjaman.length === 0) fetchData();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus data ini?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        });
        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/peminjaman/${id}`);
            Swal.fire("Terhapus!", "Data peminjaman berhasil dihapus.", "success");
            setPeminjaman((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
    };

    const handleEdit = (row) => {
        router.get(route("peminjaman.edit", row.id));
    };

    const handleAdd = () => {
        router.get(route("peminjaman.add"));   // FIXED
    };

    return (
        <AuthenticatedLayout auth={auth} header="Daftar Peminjaman" title="Daftar Peminjaman">
            <Head title="Daftar Peminjaman" />
            <div className="min-h-screen bg-white text-slate-900 px-8 py-10 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Daftar Peminjaman</h1>
                {loading ? (
                    <div className="text-center mt-10 text-gray-500">Memuat data...</div>
                ) : (
                    <PeminjamanTable
                        data={peminjaman}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAdd={handleAdd}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
