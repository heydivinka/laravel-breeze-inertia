    // src/components/StudentStats.jsx
    import { Users, UserCheck, UserX } from "lucide-react";

    export default function StudentStats({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:bg-neutral-800 transition-all">
            <Users className="w-10 h-10 text-white" />
            <div>
            <h2 className="text-lg opacity-80">Total Siswa</h2>
            <p className="text-3xl font-semibold">{stats.total}</p>
            </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:bg-neutral-800 transition-all">
            <UserCheck className="w-10 h-10 text-green-400" />
            <div>
            <h2 className="text-lg opacity-80">Siswa Aktif</h2>
            <p className="text-3xl font-semibold text-green-400">{stats.aktif}</p>
            </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:bg-neutral-800 transition-all">
            <UserX className="w-10 h-10 text-red-400" />
            <div>
            <h2 className="text-lg opacity-80">Tidak Aktif</h2>
            <p className="text-3xl font-semibold text-red-400">{stats.tidakAktif}</p>
            </div>
        </div>
        </div>
    );
    }
