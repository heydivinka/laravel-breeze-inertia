    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import InventoryStats from "@/Components/Inventories/InventoryStats";
    import api from "@/utils/api";

    export default function InventoryStatsPage({ auth }) {
    const [stats, setStats] = useState({ baikBaru: 0, rusakRingan: 0, rusakBerat: 0 });

    const fetchStats = async () => {
        try {
        const res = await api.get("/api/inventories");
        const data = Array.isArray(res.data) ? res.data : [];
        setStats({
            baikBaru: data.filter((i) => i.status === "Baru" || i.status === "Baik").length,
            rusakRingan: data.filter((i) => i.status === "Rusak Ringan").length,
            rusakBerat: data.filter((i) => i.status === "Rusak Berat").length,
        });
        } catch (e) {
        console.error("fetchInventories", e);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <AuthenticatedLayout auth={auth} header={<h2>Statistik Inventory</h2>} title="Statistik Inventory">
        <Head title="Statistik Inventory" />
        <div className="min-h-screen bg-black text-white px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">Statistik Inventaris</h1>
            <InventoryStats stats={stats} />
        </div>
        </AuthenticatedLayout>
    );
    }
