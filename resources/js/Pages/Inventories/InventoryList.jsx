    import { useEffect, useState } from "react";
    import { Head, router } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import InventoryTable from "@/Components/Inventories/InventoryTable";
    import InventorySearch from "@/Components/Inventories/InventorySearch";
    import InventoryFormModal from "@/Components/Inventories/InventoryFormModal";
    import api from "@/utils/api";
    import Swal from "sweetalert2";

    export default function InventoryList({ auth, inventories: initialInventoriesProp }) {
    const [items, setItems] = useState(
        Array.isArray(initialInventoriesProp) ? initialInventoriesProp : []
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Fetch inventories
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
        if (!items || items.length === 0) {
        fetchItems();
        }
    }, []);

    // Hapus item
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
        title: "Hapus item ini?",
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
        Swal.fire("Terhapus!", "Item berhasil dihapus.", "success");
        setItems((prev) => prev.filter((i) => i.id !== id));
        } catch (err) {
        console.error("delete inventory", err);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
    };

    // Edit item (buka modal)
    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    // Tambah item baru (via route)
    const handleAddInventory = () => {
        router.get(route("inventories.create"));
    };

    // Callback setelah simpan
    const handleSaved = (savedItem) => {
        if (!savedItem) {
        fetchItems();
        return;
        }

        const exists = items.find((p) => p.id === savedItem.id);
        setItems((prev) => {
        if (exists) {
            return prev.map((p) => (p.id === savedItem.id ? savedItem : p));
        } else {
            return [savedItem, ...prev];
        }
        });

        if (exists) {
        Swal.fire("Berhasil!", "Data item berhasil diperbarui.", "success");
        } else {
        Swal.fire("Berhasil!", "Item baru berhasil ditambahkan.", "success");
        }
    };

    // Filter pencarian
    const filtered = items.filter((i) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        if (term.startsWith("#")) {
        const idSearch = term.slice(1);
        return i.id.toString() === idSearch;
        }
        return (
        (i.kode_barang || "").toLowerCase().includes(term) ||
        (i.nama_barang || "").toLowerCase().includes(term) ||
        (i.kategori || "").toLowerCase().includes(term)
        );
    });

    return (
        <AuthenticatedLayout auth={auth} header="Daftar Inventory" title="Daftar Inventory">
        <Head title="Daftar Inventory" />
        <div className="min-h-screen bg-white text-slate-900 px-8 py-10 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Daftar Inventory</h1>

            <InventorySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {loading ? (
            <div className="text-center mt-10 text-gray-500">Memuat data...</div>
            ) : (
            <InventoryTable
                data={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAddInventory}
            />
            )}
        </div>

        <InventoryFormModal
            isOpen={isModalOpen}
            onClose={() => {
            setModalOpen(false);
            setSelectedItem(null);
            }}
            item={selectedItem}
            onSaved={(item) => {
            handleSaved(item);
            setModalOpen(false);
            setSelectedItem(null);
            }}
        />
        </AuthenticatedLayout>
    );
    }
