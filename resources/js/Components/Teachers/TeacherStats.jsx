    // src/components/Teachers/TeacherStats.jsx
    export default function TeacherStats({ teachers }) {
    const total = teachers.length;
    const aktif = teachers.filter((t) => t.is_active).length;
    const nonaktif = total - aktif;

    return (
        <div className="grid grid-cols-3 gap-6">
        <div className="bg-neutral-800 rounded-lg p-6 text-center">
            <p className="text-neutral-400">Total Guru</p>
            <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-emerald-600 rounded-lg p-6 text-center">
            <p className="text-neutral-900 font-medium">Aktif</p>
            <p className="text-3xl font-bold">{aktif}</p>
        </div>
        <div className="bg-red-600 rounded-lg p-6 text-center">
            <p className="text-neutral-900 font-medium">Nonaktif</p>
            <p className="text-3xl font-bold">{nonaktif}</p>
        </div>
        </div>
    );
    }
