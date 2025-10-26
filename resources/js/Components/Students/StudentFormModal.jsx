    import { useState, useEffect } from "react";
    import Modal from "@/Components/Modal";
    import { X, User, BookOpen, Clock, CheckCircle } from "lucide-react";
    import PrimaryButton from "@/Components/PrimaryButton";
    import api from "@/utils/api";
    import Swal from "sweetalert2";

    export default function StudentFormModal({ isOpen, onClose, student, refresh }) {
    const [formData, setFormData] = useState({
        nisn: "",
        nama_lengkap: "",
        jurusan: "",
        angkatan: "",
        is_active: true,
    });

    useEffect(() => {
        if (student) {
        setFormData({
            nisn: student.nisn || "",
            nama_lengkap: student.nama_lengkap || "",
            jurusan: student.jurusan || "",
            angkatan: student.angkatan || "",
            is_active: student.is_active ?? true,
        });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!student?.id) {
        Swal.fire({
            icon: "error",
            title: "Data siswa tidak ditemukan",
            text: "Pastikan data yang ingin diedit valid.",
        });
        return;
        }

        try {
        await api.put(`/students/${student.id}`, formData);
        Swal.fire({
            icon: "success",
            title: "Data berhasil diperbarui!",
            timer: 1500,
            showConfirmButton: false,
        });

        refresh();
        onClose();
        } catch (error) {
        console.error("Gagal update:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal memperbarui data",
            text: "Periksa koneksi atau inputan Anda.",
        });
        }
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
        <div className="p-8 bg-white rounded-2xl shadow-xl relative border border-gray-100">
            {/* Tombol Tutup */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-100 transition"
            >
            <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b pb-3">
            <User size={26} className="text-indigo-600" />
            <h2 className="text-2xl font-bold text-indigo-700">Edit Data Siswa</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* NISN */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                NISN
                </label>
                <div className="relative">
                <BookOpen
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                />
                </div>
            </div>

            {/* Nama Lengkap */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
                </label>
                <div className="relative">
                <User
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                />
                </div>
            </div>

            {/* Jurusan dan Angkatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jurusan
                </label>
                <div className="relative">
                    <BookOpen
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Angkatan
                </label>
                <div className="relative">
                    <Clock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                    type="number"
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                    />
                </div>
                </div>
            </div>

            {/* Status Aktif */}
            <div className="flex items-center gap-3 pt-3">
                <input
                type="checkbox"
                id="is_active_toggle"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="sr-only peer"
                />
                <label
                htmlFor="is_active_toggle"
                className="relative block w-14 h-8 bg-gray-200 rounded-full cursor-pointer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full"
                ></label>
                <span className="text-base font-semibold text-gray-700 flex items-center gap-1">
                <CheckCircle
                    size={18}
                    className={formData.is_active ? "text-green-500" : "text-gray-400"}
                />
                Status Aktif
                </span>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-3 border-t pt-5 mt-8">
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
