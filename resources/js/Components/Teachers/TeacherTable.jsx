import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, PencilLine, Plus } from "lucide-react";

// Komponen utama untuk menampilkan data guru dalam bentuk tabel dengan fitur sorting dan pagination.
// Menambahkan prop onAdd untuk menangani navigasi/aksi penambahan data baru.
export default function TeacherTable({ data = [], onDelete, onEdit, onAdd }) {
    // Memastikan data adalah array, menghindari error.
    const safeData = Array.isArray(data) ? data : [];

    // State untuk sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10 baris per halaman

    // Definisi header kolom yang lengkap sesuai dengan TeacherController
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

    // Logika untuk mengubah konfigurasi sorting
    const requestSort = (key) => {
        let direction = "asc";
        // Jika kolom yang sama diklik dan arahnya 'asc', ubah ke 'desc'
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Logika sorting data
    const sortedData = [...safeData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Normalisasi untuk sorting (kasus sensitif)
        const normalize = (val) => (typeof val === 'string' ? val.toLowerCase() : val);

        if (normalize(aVal) < normalize(bVal)) return sortConfig.direction === "asc" ? -1 : 1;
        if (normalize(aVal) > normalize(bVal)) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Logika pagination
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = sortedData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);


    return (
        <div className="w-full">
             {/* Kontrol di atas tabel: Tombol Tambah dan Judul */}
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-gray-800">Data Guru</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                    title="Tambah Data Guru Baru"
                >
                    <Plus size={20} />
                    Tambah Guru
                </button>
            </div>

            <div className="overflow-x-auto w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <table className="min-w-full text-gray-800 divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-sm text-gray-700 uppercase select-none">
                        <tr>
                            <th className="px-5 py-3 text-left font-bold">No.</th>
                            {/* Render semua header yang telah didefinisikan */}
                            {headers.map((h) => (
                                <th
                                    key={h.key}
                                    onClick={() => requestSort(h.key)}
                                    className="px-5 py-3 cursor-pointer hover:bg-gray-100 transition-colors text-left font-bold whitespace-nowrap"
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
                            <th className="px-5 py-3 text-left font-bold">Aksi</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {currentData.length > 0 ? (
                            currentData.map((t, index) => (
                                <tr
                                    key={t.id || index}
                                    className="hover:bg-gray-50 transition-colors text-sm"
                                >
                                    {/* Kolom No. Urut (non-sortable) */}
                                    <td className="px-5 py-3 text-gray-600">
                                        {indexOfFirst + index + 1}
                                    </td>
                                    
                                    {/* Kolom Data (sesuai urutan headers) */}
                                    <td className="px-5 py-3 font-mono text-xs">{t.id}</td>
                                    <td className="px-5 py-3">{t.nip}</td>
                                    <td className="px-5 py-3 font-semibold whitespace-nowrap">{t.nama_lengkap}</td>
                                    <td className="px-5 py-3">{t.jabatan}</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{t.no_hp}</td>
                                    <td className="px-5 py-3">{t.email}</td>
                                    <td className="px-5 py-3 truncate max-w-xs">{t.alamat}</td>
                                    
                                    {/* Kolom Status */}
                                    <td className="px-5 py-3">
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

                                    {/* Kolom Aksi */}
                                    <td className="px-5 py-3 flex gap-2">
                                        <button
                                            onClick={() => onEdit && onEdit(t)}
                                            title="Edit data"
                                            className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:scale-105 transition-transform duration-150 shadow-md"
                                        >
                                            <PencilLine size={18} />
                                        </button>

                                        <button
                                            // Memanggil onDelete langsung (tanpa konfirmasi SweetAlert2)
                                            onClick={() => onDelete && onDelete(t.id)} 
                                            title="Hapus data"
                                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105 transition-transform duration-150 shadow-md"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={headers.length + 2} // +2 untuk 'No.' dan 'Aksi'
                                    className="text-center py-10 text-gray-500 italic bg-gray-50"
                                >
                                    <p className="text-lg font-medium">Data Guru Tidak Ditemukan</p>
                                    <p className="text-sm">Pastikan data telah diunggah atau filter telah direset.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 px-5 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Baris per halaman:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1); // Reset ke halaman 1 saat mengubah rowsPerPage
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
