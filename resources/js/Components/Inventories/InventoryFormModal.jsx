import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import {
    X,
    Package,
    Layers,
    ClipboardList,
    Hash,
    MapPin,
    CheckCircle,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import api from "@/utils/api";
import Swal from "sweetalert2";

export default function InventoryFormModal({
    isOpen,
    onClose,
    inventory,
    refresh,
    categories = [],
}) {
    const [formData, setFormData] = useState({
        kode_barang: "",
        nama_barang: "",
        category_id: "",
        jumlah: "",
        deskripsi: "",
        lokasi_barang: "",
        status: "",
        is_active: true,
    });

    // Sinkronisasi data dari props `inventory`
    useEffect(() => {
        if (inventory) {
            setFormData({
                kode_barang: inventory.kode_barang ?? "",
                nama_barang: inventory.nama_barang ?? "",
                category_id: inventory.category_id ?? "",
                jumlah: inventory.jumlah ?? "",
                deskripsi: inventory.deskripsi ?? "",
                lokasi_barang: inventory.lokasi_barang ?? "",
                status: inventory.status ?? "",
                is_active: inventory.is_active ?? true,
            });
        }
    }, [inventory]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "kode_barang") {
            const sanitized = value.replace(/\s/g, "").toUpperCase().slice(0, 20);
            setFormData((prev) => ({ ...prev, [name]: sanitized }));
        } else if (name === "jumlah") {
            const numbersOnly = value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inventory?.id) {
            Swal.fire({
                icon: "error",
                title: "Data tidak ditemukan",
                text: "Barang yang ingin diedit tidak valid.",
            });
            return;
        }

        if (!formData.nama_barang.trim() || !formData.kode_barang.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Input tidak lengkap",
                text: "Nama dan kode barang wajib diisi.",
            });
            return;
        }

        try {
            const response = await api.put(`/inventories/${inventory.id}`, formData);
            const updated = response.data;

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data barang berhasil diperbarui.",
                timer: 1200,
                showConfirmButton: false,
            });

            if (refresh) refresh();

            // Delay agar user sempat lihat notifikasi sukses
            setTimeout(() => onClose(), 500);
        } catch (error) {
            console.error("Gagal update:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui data",
                text: error.response?.data?.message || "Periksa kembali inputan Anda.",
            });
        }
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-8 bg-white rounded-2xl shadow-2xl relative border border-gray-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 rounded-full bg-gray-50 hover:bg-red-100 transition"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2 border-b pb-3">
                    <Package className="text-indigo-500" size={24} />
                    Edit Data Barang
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Kode Barang & Nama Barang */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="kode_barang"
                                placeholder="Kode Barang"
                                value={formData.kode_barang}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Hash
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="nama_barang"
                                placeholder="Nama Barang"
                                value={formData.nama_barang}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <ClipboardList
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Kategori & Jumlah */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <select
                                name="category_id"
                                value={formData.category_id || ""}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
                            <Layers
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="number"
                                name="jumlah"
                                placeholder="Jumlah"
                                value={formData.jumlah}
                                onChange={handleChange}
                                min="0"
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <ClipboardList
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Lokasi & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="lokasi_barang"
                                placeholder="Lokasi Barang"
                                value={formData.lokasi_barang}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <MapPin
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="status"
                                placeholder="Status Barang"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Package
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="relative">
                        <textarea
                            name="deskripsi"
                            placeholder="Deskripsi Barang"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            rows={3}
                            className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                        <ClipboardList
                            size={18}
                            className="absolute left-3 top-4 text-gray-400"
                        />
                    </div>

                    {/* Toggle aktif */}
                    <div className="flex items-center space-x-3 pt-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="inventory_active"
                            checked={!!formData.is_active}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <label
                            htmlFor="inventory_active"
                            className="relative block w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full cursor-pointer"
                        ></label>
                        <span className="text-base font-semibold text-gray-700 flex items-center gap-1">
                            <CheckCircle
                                size={18}
                                className={
                                    formData.is_active
                                        ? "text-green-500"
                                        : "text-gray-400"
                                }
                            />
                            Status Aktif
                        </span>
                    </div>

                    {/* Tombol */}
                    <div className="mt-8 flex justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Batal
                        </button>
                        <PrimaryButton type="submit" className="rounded-xl">
                            Simpan Perubahan
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
