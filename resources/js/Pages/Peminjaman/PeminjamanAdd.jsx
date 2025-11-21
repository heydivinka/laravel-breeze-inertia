import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PeminjamanForm from "@/Components/Peminjaman/PeminjamanForm";
import api from "@/utils/api";

export default function PeminjamanAdd({ auth }) {
    const [selected, setSelected] = useState(null);

    // Optional: Fetch data peminjaman jika diperlukan
    const fetchPeminjaman = async () => {
        try {
            await api.get("/peminjaman");
        } catch (e) {
            // ignore
        }
    };

    useEffect(() => {
        fetchPeminjaman();
    }, []);

    return (
        <AuthenticatedLayout 
            auth={auth} 
            header="Tambah Data Peminjaman"
            title="Tambah Peminjaman"
        >
            <Head title="Tambah Peminjaman" />
            <PeminjamanForm 
                fetchPeminjaman={fetchPeminjaman} 
                selected={selected} 
                setSelected={setSelected} 
            />
        </AuthenticatedLayout>
    );
}
