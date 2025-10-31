    // src/Pages/Inventories/InventoryAdd.jsx
    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import InventoryForm from "@/Components/Inventories/InventoryForm";
    import api from "@/utils/api";

    export default function InventoryAdd({ auth }) {
    const [selected, setSelected] = useState(null);

    // Optional fetch if needed by form (kept consistent with TeacherAdd)
    const fetchItems = async () => {
        try {
        await api.get("/inventories");
        } catch (e) {
        console.error("fetchInventories", e);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <AuthenticatedLayout
        auth={auth}
        header="Tambah Data Inventory"
        title="Tambah Inventory"
        >
        <Head title="Tambah Inventory" />

        {/* InventoryForm sudah punya styling internal seperti ContentCard di TeacherForm */}
        <InventoryForm
            fetchItems={fetchItems}
            selected={selected}
            setSelected={setSelected}
        />
        </AuthenticatedLayout>
    );
    }
