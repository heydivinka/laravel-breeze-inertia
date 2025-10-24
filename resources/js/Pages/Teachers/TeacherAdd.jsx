    import { useEffect, useState } from "react";
    import { Head } from "@inertiajs/react";
    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import TeacherForm from "@/Components/Teachers/TeacherForm";
    import api from "@/utils/api";

    export default function TeacherAdd({ auth }) {
        // We only need 'selected' if this page were also used for 'Edit'. 
        // Since the path suggests 'Add', we can simplify or keep it ready for dual use.
        const [selected, setSelected] = useState(null);

        // Optional fetch if needed by form (kept for reference, though unused for 'add')
        const fetchTeachers = async () => {
            try {
                await api.get("/teachers");
            } catch (e) {
                // ignore
            }
        };

        useEffect(() => {
            fetchTeachers();
        }, []);

        // FIXES:
        // 1. Removed the inner <div> and its redundant styling (bg-black, text-white, p-6).
        // 2. The main page heading (h1) is removed, as it's handled by the 'header' prop in AuthenticatedLayout.
        // 3. The header prop now uses a string, which is cleaner and is styled by AuthenticatedLayout.
        return (
            <AuthenticatedLayout 
                auth={auth} 
                header="Tambah Data Guru" // Clean String passed for Emerald styling
                title="Tambah Guru" 
            >
                <Head title="Tambah Guru" />
                
                {/* The TeacherForm component is now responsible for its own styling (via ContentCard wrapper) */}
                <TeacherForm 
                    fetchTeachers={fetchTeachers} 
                    selected={selected} 
                    setSelected={setSelected} 
                />
                
                {/* Note: If you want to use the TeacherForm in a standard page context 
                (not in a ContentCard inside the form itself), 
                you should call ContentCard here:
                
                <ContentCard title="Formulir Guru Baru">
                    <TeacherForm fetchTeachers={fetchTeachers} selected={selected} setSelected={setSelected} />
                </ContentCard>

                ...However, since we wrapped TeacherForm itself, the current approach is fine.
                */}

            </AuthenticatedLayout>
        );
    }