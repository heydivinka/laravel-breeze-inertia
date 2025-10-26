    import { useEffect, useState } from "react";
    import {
    Save,
    RefreshCw,
    User,
    Calendar,
    MapPin,
    Phone,
    GraduationCap,
    Home,
    } from "lucide-react";
    import Swal from "sweetalert2";
    import api from "@/utils/api";

    // =======================
    // Component: Card Wrapper
    // =======================
    const ContentCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6 border-gray-100">
        {title}
        </h2>
        {children}
    </div>
    );

    // =======================
    // Component: Input with Icon
    // =======================
    const InputWithIcon = ({
    Icon,
    name,
    placeholder,
    value,
    onChange,
    required,
    type = "text",
    maxLength,
    autoComplete,
    }) => (
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
        autoComplete={autoComplete}
        className="bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 py-2.5 pr-4 pl-10 w-full"
        />
    </div>
    );

    // =======================
    // Main Component: StudentForm
    // =======================
    export default function StudentForm({ fetchStudents, selected, setSelected }) {
    const defaultFormData = {
        nisin: "",
        nama_lengkap: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        alamat: "",
        jurusan: "",
        angkatan: "",
        no_hp: "",
        is_active: true,
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (selected) {
        setFormData({
            ...defaultFormData,
            ...selected,
            is_active: selected?.is_active ?? true,
        });
        } else {
        setFormData(defaultFormData);
        }
    }, [selected]);

    const handleChange = ({ target: { name, value, type, checked } }) => {
        if (["nisin", "no_hp", "angkatan"].includes(name)) {
        const limits = { nisin: 12, no_hp: 12, angkatan: 4 };
        setFormData({
            ...formData,
            [name]: value.replace(/\D/g, "").slice(0, limits[name]),
        });
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

        if (!formData.nisin) return showMessage("error", "NISN wajib diisi!");
        if (!formData.nama_lengkap)
        return showMessage("error", "Nama lengkap wajib diisi!");

        try {
        let res;
        if (selected) {
            res = await api.put(`/students/${selected.id}`, formData, {
            headers: { "Content-Type": "application/json" },
            });
            Swal.fire({
            icon: "success",
            title: "Data siswa berhasil diperbarui!",
            timer: 1500,
            showConfirmButton: false,
            });
        } else {
            res = await api.post("/students", formData, {
            headers: { "Content-Type": "application/json" },
            });
            Swal.fire({
            icon: "success",
            title: "Siswa baru berhasil ditambahkan!",
            timer: 1500,
            showConfirmButton: false,
            });
        }

        if (fetchStudents) fetchStudents();
        handleClear();
        } catch (err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Terjadi kesalahan",
            text:
            err.response?.data?.message ||
            "Periksa kembali inputan atau koneksi server.",
        });
        }
    };

    const title = selected
        ? `Edit Siswa: ${selected.nama_lengkap || "..."}`
        : "Tambah Siswa Baru";

    const MessageToast = () => {
        if (!message) return null;
        const base =
        "fixed top-4 right-4 p-4 rounded-lg shadow-xl text-white font-medium z-[100] transition-all duration-300";
        return (
        <div
            className={`${base} ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
            } ${message ? "opacity-100" : "opacity-0"}`}
        >
            {message.text}
        </div>
        );
    };

    return (
        <>
        <MessageToast />
        <ContentCard title={title}>
            <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
            {/* NISN */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                NISN
                </label>
                <InputWithIcon
                Icon={User}
                name="nisin"
                placeholder="NISN"
                value={formData.nisin}
                onChange={handleChange}
                required
                maxLength={12}
                />
            </div>

            {/* Nama Lengkap */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nama Lengkap
                </label>
                <InputWithIcon
                Icon={User}
                name="nama_lengkap"
                placeholder="Nama Lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                required
                />
            </div>

            {/* Tempat Lahir */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tempat Lahir
                </label>
                <InputWithIcon
                Icon={Home}
                name="tempat_lahir"
                placeholder="Tempat Lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                required
                />
            </div>

            {/* Tanggal Lahir */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tanggal Lahir
                </label>
                <InputWithIcon
                Icon={Calendar}
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                required
                />
            </div>

            {/* Alamat */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                Alamat
                </label>
                <InputWithIcon
                Icon={MapPin}
                name="alamat"
                placeholder="Alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                />
            </div>

            {/* Jurusan */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                Jurusan
                </label>
                <InputWithIcon
                Icon={GraduationCap}
                name="jurusan"
                placeholder="Jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                required
                />
            </div>

            {/* Angkatan */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                Angkatan
                </label>
                <InputWithIcon
                Icon={Calendar}
                type="number"
                name="angkatan"
                placeholder="Angkatan"
                value={formData.angkatan}
                onChange={handleChange}
                required
                maxLength={4}
                />
            </div>

            {/* Nomor HP */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                No HP
                </label>
                <InputWithIcon
                Icon={Phone}
                name="no_hp"
                placeholder="08xxxx"
                value={formData.no_hp}
                onChange={handleChange}
                required
                maxLength={12}
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
                <label
                htmlFor="is_active_check"
                className="text-gray-700 font-medium select-none"
                >
                Aktif
                </label>
            </div>

            {/* Buttons */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-gray-100">
                {(selected || formData.nisin || formData.nama_lengkap) && (
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
                disabled={!formData.nisin || !formData.nama_lengkap}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <Save size={18} /> {selected ? "Update Data" : "Tambah Data"}
                </button>
            </div>
            </form>
        </ContentCard>
        </>
    );
    }
