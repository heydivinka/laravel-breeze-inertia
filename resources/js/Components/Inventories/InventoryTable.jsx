    import { useState } from "react";
    import { Pencil, Trash2, X } from "lucide-react";
    import Swal from "sweetalert2";

    export default function InventoryTable({ data, onEdit, onDelete }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [editForm, setEditForm] = useState({
        kode_barang: "",
        nama_barang: "",
        kategori: "",
        jumlah: "",
        status: "",
        lokasi_barang: "",
        deskripsi: "",
    });
    const [showModal, setShowModal] = useState(false);

    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        setEditForm({
        kode_barang: item.kode_barang,
        nama_barang: item.nama_barang,
        kategori: item.kategori,
        jumlah: item.jumlah,
        status: item.status,
        lokasi_barang: item.lokasi_barang,
        deskripsi: item.deskripsi,
        });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!selectedItem) return;

        const updatedData = { ...selectedItem, ...editForm };
        onEdit(updatedData); // Kirim ke parent untuk update database
        setShowModal(false);

        Swal.fire({
        icon: "success",
        title: "Berhasil Diperbarui",
        text: "Data barang berhasil diperbarui!",
        timer: 1800,
        showConfirmButton: false,
        });
    };

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
        if (result.isConfirmed) onDelete(id);
        });
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-800 text-neutral-200">
            <tr>
                <th className="p-3 border-b border-neutral-700">ID</th>
                <th className="p-3 border-b border-neutral-700">Kode Barang</th>
                <th className="p-3 border-b border-neutral-700">Nama Barang</th>
                <th className="p-3 border-b border-neutral-700">Kategori</th>
                <th className="p-3 border-b border-neutral-700">Jumlah</th>
                <th className="p-3 border-b border-neutral-700">Kondisi</th>
                <th className="p-3 border-b border-neutral-700">Lokasi</th>
                <th className="p-3 border-b border-neutral-700">Deskripsi</th>
                <th className="p-3 border-b border-neutral-700 text-center">
                Aksi
                </th>
            </tr>
            </thead>

            <tbody>
            {data.length > 0 ? (
                data.map((item) => (
                <tr
                    key={item.id}
                    className="hover:bg-neutral-800/60 transition-colors"
                >
                    <td className="p-3 border-b border-neutral-800">{item.id}</td>
                    <td className="p-3 border-b border-neutral-800">
                    {item.kode_barang}
                    </td>
                    <td className="p-3 border-b border-neutral-800">
                    {item.nama_barang}
                    </td>
                    <td className="p-3 border-b border-neutral-800">
                    {item.kategori}
                    </td>
                    <td className="p-3 border-b border-neutral-800">
                    {item.jumlah}
                    </td>
                    <td className="p-3 border-b border-neutral-800">
                    {item.status}
                    </td>
                    <td className="p-3 border-b border-neutral-800">
                    {item.lokasi_barang}
                    </td>
                    <td className="p-3 border-b border-neutral-800">
                    {item.deskripsi}
                    </td>
                    <td className="p-3 border-b border-neutral-800 text-center flex justify-center gap-3">
                    <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => confirmDelete(item.id)}
                        className="p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td
                    colSpan="9"
                    className="text-center py-5 text-neutral-500 border-b border-neutral-800"
                >
                    Tidak ada data barang.
                </td>
                </tr>
            )}
            </tbody>
        </table>

        {/* MODAL EDIT */}
        {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-neutral-900 text-neutral-100 rounded-xl p-6 w-full max-w-lg relative">
                <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100"
                >
                <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit Data Barang</h2>

                <div className="space-y-3">
                {Object.keys(editForm).map((key) => (
                    <div key={key}>
                    <label className="block text-sm mb-1 capitalize">
                        {key.replace("_", " ")}
                    </label>
                    <input
                        type="text"
                        name={key}
                        value={editForm[key]}
                        onChange={handleChange}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    </div>
                ))}
                </div>

                <div className="mt-5 flex justify-end gap-3">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-all"
                >
                    Batal
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-all"
                >
                    Simpan
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    }
