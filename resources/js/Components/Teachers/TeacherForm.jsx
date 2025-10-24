    import { useEffect, useState } from "react";
    import { Save, RefreshCw, Fingerprint, User, Briefcase, Phone, Mail, MapPin } from "lucide-react";
    import Swal from "sweetalert2";
    import api from "@/utils/api"; // pastikan path utils/api.js sudah benar

    // ContentCard untuk style kartu form
    const ContentCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6 border-gray-100">
        {title}
        </h2>
        {children}
    </div>
    );

    // Input dengan icon
    const InputWithIcon = ({ Icon, name, placeholder, value, onChange, required, type = "text", maxLength }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        className="bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 py-2.5 pr-4 pl-10 w-full"
        />
    </div>
    );

    export default function TeacherForm({ fetchTeachers, selected, setSelected }) {
    const defaultFormData = {
        nip: "",
        nama_lengkap: "",
        jabatan: "",
        no_hp: "",
        email: "",
        alamat: "",
        is_active: true,
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (selected) {
        setFormData({ ...defaultFormData, ...selected });
        } else {
        setFormData(defaultFormData);
        }
    }, [selected]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "nip") {
        const numbers = value.replace(/\D/g, "").slice(0, 18);
        setFormData({ ...formData, [name]: numbers });
        } else if (name === "no_hp") {
        const numbers = value.replace(/\D/g, "").slice(0, 12);
        setFormData({ ...formData, [name]: numbers });
        } else if (type === "checkbox") {
        setFormData({ ...formData, [name]: checked });
        } else {
        setFormData({ ...formData, [name]: value });
        }
    };

    const handleClear = () => {
        setFormData(defaultFormData);
        setSelected(null);
        setMessage(null);
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let savedTeacher;
        if (selected) {
            const res = await api.put(`/teachers/${selected.id}`, formData);
            savedTeacher = res.data;
            Swal.fire({
                icon: "success",
                title: "Data guru berhasil diperbarui!",
                timer: 1500,
                showConfirmButton: false,
            });
        } else {
            const res = await api.post("/teachers", formData);
            savedTeacher = res.data;
            Swal.fire({
                icon: "success",
                title: "Guru baru berhasil ditambahkan!",
                timer: 1500,
                showConfirmButton: false,
            });
        }

        if (fetchTeachers) fetchTeachers();
        handleClear();
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Terjadi kesalahan",
            text: "Periksa kembali inputan atau koneksi server.",
        });
    }
};


    const title = selected ? `Edit Guru: ${selected.nama_lengkap || "..."}` : "Tambah Guru Baru";

    const MessageToast = () => {
        if (!message) return null;
        const base = "fixed top-4 right-4 p-4 rounded-lg shadow-xl text-white font-medium z-[100]";
        return (
        <div className={`${base} ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {message.text}
        </div>
        );
    };

    return (
        <>
        <MessageToast />
        <ContentCard title={title}>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NIP */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">NIP</label>
                <InputWithIcon
                Icon={Fingerprint}
                name="nip"
                placeholder="NIP (max 18 digit)"
                value={formData.nip}
                onChange={handleChange}
                required
                />
            </div>

            {/* Nama Lengkap */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Lengkap</label>
                <InputWithIcon
                Icon={User}
                name="nama_lengkap"
                placeholder="Nama Lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                required
                />
            </div>

            {/* Jabatan */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Jabatan</label>
                <InputWithIcon
                Icon={Briefcase}
                name="jabatan"
                placeholder="Jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                required
                />
            </div>

            {/* No HP */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nomor HP</label>
                <InputWithIcon
                Icon={Phone}
                name="no_hp"
                placeholder="No HP"
                value={formData.no_hp}
                onChange={handleChange}
                required
                />
            </div>

            {/* Email */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <InputWithIcon
                Icon={Mail}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>

            {/* Alamat */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Alamat</label>
                <InputWithIcon
                Icon={MapPin}
                name="alamat"
                placeholder="Alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                />
            </div>

            {/* Status Aktif */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-3 pt-2">
                <input
                type="checkbox"
                id="is_active_check"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 accent-indigo-500 bg-white border-gray-400 rounded cursor-pointer focus:ring-indigo-500"
                />
                <label htmlFor="is_active_check" className="text-gray-700 font-medium select-none">Aktif</label>
            </div>

            {/* Buttons */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-gray-100">
                {(selected || formData.nip || formData.nama_lengkap) && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 py-2.5 px-6 rounded-lg transition-all duration-200 font-medium hover:bg-indigo-50/50 hover:shadow-md"
                >
                    <RefreshCw size={18} /> {selected ? "Batal Edit" : "Bersihkan"}
                </button>
                )}
                <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-indigo-500/30"
                >
                <Save size={18} /> {selected ? "Update Data" : "Tambah Data"}
                </button>
            </div>
            </form>
        </ContentCard>
        </>
    );
    }
