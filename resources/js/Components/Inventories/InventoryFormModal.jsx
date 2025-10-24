import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { X, Package, Layers, ClipboardList, Hash, MapPin, CheckCircle } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import api from "@/utils/api";
import Swal from "sweetalert2";

export default function InventoryFormModal({ isOpen, onClose, inventory, refresh }) {
    const [formData, setFormData] = useState({
        kode_barang: "",
        nama_barang: "",
        kategori: "",
        jumlah: "",
        deskripsi: "",
        lokasi_barang: "",
        status: "",
        is_active: true,
    });

    useEffect(() => {
        if (inventory) {
            setFormData({
                kode_barang: inventory.kode_barang || "",
                nama_barang: inventory.nama_barang || "",
                kategori: inventory.kategori || "",
                jumlah: inventory.jumlah || "",
                deskripsi: inventory.deskripsi || "",
                lokasi_barang: inventory.lokasi_barang || "",
                status: inventory.status || "",
                is_active: inventory.is_active ?? true,
            });
        }
    }, [inventory]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!inventory?.id) {
                Swal.fire({
                    icon: "error",
                    title: "Data barang tidak ditemukan",
                    text: "Pastikan data yang ingin diedit valid.",
                });
                return;
            }

            await api.put(`/inventories/${inventory.id}`, formData);

            Swal.fire({
                icon: "success",
                title: "Data diperbarui!",
                timer: 1500,
                showConfirmButton: false,
            });

            refresh();
            onClose();
        } catch (error) {
            console.error("Update gagal:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui data",
                text: "Periksa kembali inputan Anda atau koneksi server.",
            });
        }
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-8 bg-white rounded-2xl shadow-2xl relative border border-gray-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 rounded-full bg-gray-50 hover:bg-red-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2 border-b pb-3">
                    <Package className="text-indigo-500" size={24} />
                    Edit Data Barang
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Kode & Nama Barang */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="kode_barang"
                                placeholder="Kode Barang"
                                value={formData.kode_barang}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="nama_barang"
                                placeholder="Nama Barang"
                                value={formData.nama_barang}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <ClipboardList size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Kategori & Jumlah */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="kategori"
                                placeholder="Kategori"
                                value={formData.kategori}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Layers size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="number"
                                name="jumlah"
                                placeholder="Jumlah"
                                value={formData.jumlah}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <ClipboardList size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                            <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Toggle aktif */}
                    <div className="flex items-center space-x-3 pt-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="active_toggle"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <label
                            htmlFor="active_toggle"
                            className="relative block w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full cursor-pointer"
                        ></label>
                        <span className="text-base font-semibold text-gray-700 flex items-center gap-1">
                            <CheckCircle size={18} className={formData.is_active ? "text-green-500" : "text-gray-400"} />
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
