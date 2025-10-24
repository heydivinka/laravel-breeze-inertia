import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, PencilLine } from "lucide-react";
import Swal from "sweetalert2";

export default function StudentTable({ data = [], onDelete, onEdit }) {
    // ✅ Pastikan data selalu berupa array
    const safeData = Array.isArray(data) ? data : [];

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
        setSortConfig({ key, direction });
    };

    const sortedData = [...safeData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = sortedData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    const confirmDelete = (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed && onDelete) onDelete(id);
        });
    };

    const headers = [
        { label: "NISN", key: "nisin" },
        { label: "Nama Lengkap", key: "nama_lengkap" },
        { label: "Jurusan", key: "jurusan" },
        { label: "Angkatan", key: "angkatan" },
        { label: "Status", key: "is_active" },
    ];

    return (
        <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md border border-gray-200">
            <table className="w-full text-gray-800">
                <thead className="bg-gray-50 text-sm text-gray-700 uppercase select-none">
                    <tr>
                        {headers.map((h) => (
                            <th
                                key={h.key}
                                onClick={() => requestSort(h.key)}
                                className="px-5 py-3 cursor-pointer hover:bg-gray-100 transition-colors text-left font-semibold"
                            >
                                <div className="flex items-center gap-1">
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
                        <th className="px-5 py-3 text-left font-semibold">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((s, index) => (
                            <tr
                                key={s.id || index}
                                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-5 py-3">{s.nisin}</td>
                                <td className="px-5 py-3">{s.nama_lengkap}</td>
                                <td className="px-5 py-3">{s.jurusan}</td>
                                <td className="px-5 py-3">{s.angkatan}</td>
                                <td className="px-5 py-3">
                                    {s.is_active ? (
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Nonaktif
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-3 flex gap-3">
                                    <button
                                        onClick={() => onEdit && onEdit(s)}
                                        title="Edit data"
                                        className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:scale-105 transition-transform duration-150"
                                    >
                                        <PencilLine size={18} />
                                    </button>

                                    <button
                                        onClick={() => confirmDelete(s.id)}
                                        title="Hapus data"
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105 transition-transform duration-150"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length + 1} className="text-center py-8 text-gray-400">
                                Tidak ada data ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 px-5 py-4 bg-gray-50 border-t border-gray-200">
                <div>
                    <span className="text-sm text-gray-600">Baris per halaman:</span>{" "}
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-white border border-gray-300 text-gray-800 px-2 py-1 rounded shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 transition-all"
                    >
                        Prev
                    </button>
                    <span className="px-2 py-1 text-sm text-gray-700">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
