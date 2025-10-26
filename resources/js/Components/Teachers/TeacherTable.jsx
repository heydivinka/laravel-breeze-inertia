import { useState } from "react";
import {
    ChevronUp,
    ChevronDown,
    Trash2,
    PencilLine,
    Plus,
} from "lucide-react";

/**
 * Komponen utama untuk menampilkan data guru dalam bentuk tabel
 * dengan fitur sorting, pagination, dan desain responsif tanpa scroll horizontal.
 */
export default function TeacherTable({ data = [], onDelete, onEdit, onAdd }) {
    const safeData = Array.isArray(data) ? data : [];

    // Sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const headers = [
        { label: "ID", key: "id" },
        { label: "NIP", key: "nip" },
        { label: "Nama Lengkap", key: "nama_lengkap" },
        { label: "Jabatan", key: "jabatan" },
        { label: "No HP", key: "no_hp" },
        { label: "Email", key: "email" },
        { label: "Alamat", key: "alamat" },
        { label: "Status", key: "is_active" },
    ];

    // Mengatur arah sorting
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Sorting logic
    const sortedData = [...safeData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        const normalize = (val) =>
            typeof val === "string" ? val.toLowerCase() : val;

        if (normalize(aVal) < normalize(bVal))
            return sortConfig.direction === "asc" ? -1 : 1;
        if (normalize(aVal) > normalize(bVal))
            return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination logic
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = sortedData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    return (
        <div className="w-full overflow-hidden">
            {/* Header dan tombol tambah */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-extrabold text-gray-800">
                    Data Guru
                </h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    <Plus size={20} />
                    Tambah Guru
                </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto md:overflow-x-hidden w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="min-w-full">
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-50 text-sm text-gray-700 uppercase select-none">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold w-10">
                                    No.
                                </th>
                                {headers.map((h) => (
                                    <th
                                        key={h.key}
                                        onClick={() => requestSort(h.key)}
                                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors text-left font-bold"
                                    >
                                        <div className="flex items-center gap-1 flex-nowrap">
                                            {h.label}
                                            {sortConfig.key === h.key &&
                                                (sortConfig.direction === "asc" ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                ))}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-left font-bold">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 text-sm">
                            {currentData.length > 0 ? (
                                currentData.map((t, index) => (
                                    <tr
                                        key={t.id || index}
                                        className="hover:bg-gray-50 transition-colors align-top"
                                    >
                                        <td className="px-4 py-3 text-gray-600">
                                            {indexOfFirst + index + 1}
                                        </td>

                                        {/* ID */}
                                        <td className="px-4 py-3 font-mono text-xs break-words max-w-[80px]">
                                            {t.id}
                                        </td>

                                        {/* NIP */}
                                        <td className="px-4 py-3 break-words max-w-[120px]">
                                            {t.nip}
                                        </td>

                                        {/* Nama Lengkap */}
                                        <td className="px-4 py-3 font-semibold break-words max-w-[150px]">
                                            {t.nama_lengkap}
                                        </td>

                                        {/* Jabatan */}
                                        <td className="px-4 py-3 break-words max-w-[120px]">
                                            {t.jabatan}
                                        </td>

                                        {/* No HP */}
                                        <td className="px-4 py-3 break-words max-w-[130px]">
                                            {t.no_hp}
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3 break-words max-w-[160px]">
                                            {t.email}
                                        </td>

                                        {/* Alamat */}
                                        <td className="px-4 py-3 break-words max-w-[250px]">
                                            {t.alamat}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            {t.is_active ? (
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>

                                        {/* Tombol Aksi */}
                                        <td className="px-4 py-3 flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => onEdit && onEdit(t)}
                                                title="Edit data"
                                                className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:scale-105 transition-transform duration-150 shadow-sm"
                                            >
                                                <PencilLine size={18} />
                                            </button>

                                            <button
                                                onClick={() => onDelete && onDelete(t.id)}
                                                title="Hapus data"
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105 transition-transform duration-150 shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={headers.length + 2}
                                        className="text-center py-10 text-gray-500 italic bg-gray-50"
                                    >
                                        <p className="text-lg font-medium">
                                            Data Guru Tidak Ditemukan
                                        </p>
                                        <p className="text-sm">
                                            Pastikan data telah diunggah atau filter
                                            telah direset.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 px-5 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">
                            Baris per halaman:
                        </span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-white border border-gray-300 text-gray-800 px-3 py-1.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                        >
                            {[5, 10, 25, 50].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 items-center">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span className="hidden sm:inline">Sebelumnya</span>
                            <span className="sm:hidden">&lt;</span>
                        </button>

                        <span className="px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-200">
                            Halaman {currentPage} dari {totalPages || 1}
                        </span>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span className="hidden sm:inline">Berikutnya</span>
                            <span className="sm:hidden">&gt;</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
