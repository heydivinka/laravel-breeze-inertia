import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { X, User, Phone, Mail, MapPin, Briefcase, CheckCircle } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import api from "@/utils/api";
import Swal from "sweetalert2";

export default function TeacherFormModal({ isOpen, onClose, teacher, onSaved }) {
    const [formData, setFormData] = useState({
        nip: "",
        nama_lengkap: "",
        jabatan: "",
        no_hp: "",
        email: "",
        alamat: "",
        is_active: true,
    });

    useEffect(() => {
        if (teacher) {
            setFormData({
                nip: teacher.nip || "",
                nama_lengkap: teacher.nama_lengkap || "",
                jabatan: teacher.jabatan || "",
                no_hp: teacher.no_hp || "",
                email: teacher.email || "",
                alamat: teacher.alamat || "",
                is_active: teacher.is_active ?? true,
            });
        }
    }, [teacher]);

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "nip") {
        // hanya ambil angka dan maksimal 18 digit
        const numbersOnly = value.replace(/\D/g, "").slice(0, 18);
        setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
    } else if (name === "no_hp") {
        // opsional: batasi nomor HP misal maksimal 12 digit
        const numbersOnly = value.replace(/\D/g, "").slice(0, 12);
        setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
    } else if (type === "checkbox") {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
};


    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if (!teacher?.id) {
            Swal.fire({
                icon: "error",
                title: "Data guru tidak ditemukan",
                text: "Pastikan data yang ingin diedit valid.",
            });
            return;
        }

        const response = await api.put(`/teachers/${teacher.id}`, formData);
        const savedTeacher = response.data;

        // panggil callback onSaved dari parent
        if (onSaved) onSaved(savedTeacher);

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
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 rounded-full bg-gray-50 hover:bg-red-100"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2 border-b pb-3">
                    <User className="text-indigo-500" size={24} />
                    Edit Data Guru
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* NIP & Nama */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="nip"
                                placeholder="NIP"
                                value={formData.nip}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="nama_lengkap"
                                placeholder="Nama Lengkap"
                                value={formData.nama_lengkap}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Jabatan & Nomor HP */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="jabatan"
                                placeholder="Jabatan"
                                value={formData.jabatan}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="no_hp"
                                placeholder="No. HP"
                                value={formData.no_hp}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Email & Alamat */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="alamat"
                                placeholder="Alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Toggle Aktif */}
                    <div className="flex items-center space-x-3 pt-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="teacher_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <label
                            htmlFor="teacher_active"
                            className="relative block w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full cursor-pointer"
                        ></label>
                        <span className="text-base font-semibold text-gray-700 flex items-center gap-1">
                            <CheckCircle size={18} className={formData.is_active ? "text-green-500" : "text-gray-400"} />
                            Status Aktif
                        </span>
                    </div>

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
