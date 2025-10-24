    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import InventoryForm from "@/Components/Inventories/InventoryForm";
    import api from "@/utils/api";

    export default function InventoryAdd({ auth }) {
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);

    const fetchItems = async () => {
        try {
        const res = await api.get("/api/inventories");
        setItems(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
        console.error("fetchInventories", e);
        setItems([]);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <AuthenticatedLayout auth={auth} header={<h2>Tambah Inventory</h2>} title="Tambah Inventory">
        <Head title="Tambah Inventory" />
        <div className="p-6 min-h-screen bg-black text-white">
            <h1 className="text-2xl font-bold mb-4">Tambah Inventory</h1>
            <InventoryForm fetchItems={fetchItems} selected={selected} setSelected={setSelected} />
        </div>
        </AuthenticatedLayout>
    );
    }
