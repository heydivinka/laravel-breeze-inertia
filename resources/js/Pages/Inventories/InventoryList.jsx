    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import InventoryTable from "@/Components/Inventories/InventoryTable";
    import InventorySearch from "@/Components/Inventories/InventorySearch";
    import InventoryFormModal from "@/Components/Inventories/InventoryFormModal";
    import api from "@/utils/api";
    import Swal from "sweetalert2";

    export default function InventoryList({ auth }) {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
        const res = await api.get("/inventories");
        setItems(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
        console.error("fetchItems", e);
        setItems([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
        title: "Hapus item ini?",
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#d33",
        });
        if (!confirm.isConfirmed) return;

        try {
        await api.delete(`/inventories/${id}`);
        Swal.fire("Terhapus!", "Item berhasil dihapus.", "success");
        fetchItems();
        } catch (err) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const filtered = items.filter((i) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
        (i.kode_barang || "").toLowerCase().includes(term) ||
        (i.nama_barang || "").toLowerCase().includes(term) ||
        (i.kategori || "").toLowerCase().includes(term)
        );
    });

    return (
        <AuthenticatedLayout auth={auth} title="Inventory List">
        <Head title="Inventory List" />
        <div className="min-h-screen px-8 py-10 bg-white text-gray-900">
            <h1 className="text-3xl font-bold mb-6">Inventory List</h1>

            <InventorySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {loading ? (
            <div className="text-center mt-10 text-gray-500">Memuat data...</div>
            ) : (
            <InventoryTable data={filtered} onDelete={handleDelete} onEdit={handleEdit} />
            )}

            <InventoryFormModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            item={selectedItem}
            refresh={fetchItems}
            />
        </div>
        </AuthenticatedLayout>
    );
    }
