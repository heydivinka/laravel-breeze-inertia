// resources/js/Pages/Category/CategoryShow.jsx
import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InventoryTable from "@/Components/Inventories/InventoryTable";
import InventorySearch from "@/Components/Inventories/InventorySearch";
import InventoryFormModal from "@/Components/Inventories/InventoryFormModal";
import api from "@/utils/api";
import Swal from "sweetalert2";

export default function CategoryShow({ auth, category: initialCategory }) {
    const [category] = useState(initialCategory);
    const [inventories, setInventories] = useState(category.inventories || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // ✅ PERBAIKAN UTAMA: Hilangkan '/api' di URL
    const fetchInventories = async (status = "all") => {
        setLoading(true);
        try {
            const url =
                status === "all"
                    ? `/categories/${category.id}/inventories`
                    : `/categories/${category.id}/inventories?status=${status}`;

            const res = await api.get(url);
            setInventories(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error("fetchInventories", e);
            setInventories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventories(filterStatus);
    }, [filterStatus]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus inventaris ini?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        });
        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/inventories/${id}`);
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
            setInventories((prev) => prev.filter((inv) => inv.id !== id));
        } catch (err) {
            console.error("delete inventory", err);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
    };

    const handleEdit = (inventory) => {
        setSelectedInventory(inventory);
        setModalOpen(true);
    };

    const handleAddInventory = () => {
        setSelectedInventory(null);
        setModalOpen(true);
    };

    const handleSaved = (savedInventory) => {
        if (!savedInventory) {
            fetchInventories(filterStatus);
            return;
        }

        const exists = inventories.find((inv) => inv.id === savedInventory.id);
        setInventories((prev) =>
            exists
                ? prev.map((inv) =>
                      inv.id === savedInventory.id ? savedInventory : inv
                  )
                : [savedInventory, ...prev]
        );

        Swal.fire(
            "Berhasil!",
            exists
                ? "Inventaris berhasil diperbarui."
                : "Inventaris baru berhasil ditambahkan.",
            "success"
        );
    };

    const filtered = inventories.filter((inv) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        if (term.startsWith("#")) {
            const idSearch = term.slice(1);
            return inv.id.toString() === idSearch;
        }

        return (
            (inv.kode_barang || "").toLowerCase().includes(term) ||
            (inv.nama_barang || "").toLowerCase().includes(term) ||
            (inv.deskripsi || "").toLowerCase().includes(term)
        );
    });

    return (
        <AuthenticatedLayout
            auth={auth}
            header={`Kategori: ${category.category_name}`}
            title={`Kategori ${category.category_name}`}
        >
            <Head title={`Kategori: ${category.category_name}`} />
            <div className="min-h-screen bg-white text-slate-900 px-8 py-10 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">
                    Kategori: {category.category_name}
                </h1>

                <div className="mb-4 flex items-center gap-4">
                    <InventorySearch
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="all">Semua Status</option>
                        <option value="Tersedia">Tersedia</option>
                        <option value="Tidak ada">Tidak ada</option>
                        <option value="Di Pinjam">Di Pinjam</option>
                    </select>
                    <button
                        onClick={handleAddInventory}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Tambah Inventaris
                    </button>
                </div>

                {loading ? (
                    <div className="text-center mt-10 text-gray-500">
                        Memuat data...
                    </div>
                ) : (
                    <InventoryTable
                        data={filtered}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            <InventoryFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedInventory(null);
                }}
                inventory={selectedInventory}
                categoryId={category.id}
                onSaved={handleSaved}
            />
        </AuthenticatedLayout>
    );
}
