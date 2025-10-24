    // components/Header.jsx
    import { UserPlus } from "lucide-react";

    export default function PageHeader({ title, icon }) {
    return (
        <div className="flex items-center gap-3 mb-6">
        {icon}
        <h1 className="text-3xl font-bold">{title}</h1>
        </div>
    );
    }

// nanti dipanggil:
// <PageHeader title="Data Siswa" icon={<UserPlus className="w-8 h-8 text-white" />} />
