        import { useEffect, useState } from "react";
        import {
        Save,
        RefreshCw,
        CalendarDays,
        User,
        Tag,
        FileText,
        Key,
        Check,
        } from "lucide-react";
        import Swal from "sweetalert2";
        import api from "@/utils/api";

        const ContentCard = ({ title, children }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6 border-gray-100">
            {title}
            </h2>
            {children}
        </div>
        );

        const InputWithIcon = ({
        Icon,
        name,
        placeholder,
        value,
        onChange,
        type = "text",
        required,
        maxLength,
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
            className="bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 py-2.5 pr-20 pl-10 w-full"
            />
        </div>
        );

        export default function PeminjamanForm({ fetchPeminjaman, selected, setSelected }) {
        // 🚨 PERBAIKAN: Simplifikasi state management
        const defaultFormData = {
        peminjam_id: "",
        peminjam_input: "",  // <-- WAJIB
        role: "",
        inventory_id: "",
        tanggal_pinjam: "",
        tanggal_kembali: "",
        keterangan: "",
    };

            const [formData, setFormData] = useState(defaultFormData);
            const [peminjamInfo, setPeminjamInfo] = useState(null); // Untuk info nama dll
            const [loadingCheck, setLoadingCheck] = useState(false);
            const [loadingSubmit, setLoadingSubmit] = useState(false);

        const formatDateTimeLocal = (isoString) => {
            if (!isoString) return "";
            const date = new Date(isoString);
            if (isNaN(date)) return "";
            const pad = (n) => String(n).padStart(2, "0");
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
                date.getDate()
            )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        const toSQLDateTime = (value) => {
            const d = new Date(value);
            if (isNaN(d)) return null;
            const pad = (n) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
                d.getDate()
            )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };

        useEffect(() => {
    if (selected) {
        setFormData({
            ...defaultFormData,
            peminjam_id: selected.peminjam_id,
            role: selected.role,                           // WAJIB
            inventory_id: selected.inventory_id,
            peminjam_input: selected.peminjam_id,          // supaya bisa dicek ulang
            tanggal_pinjam: selected.tanggal_pinjam,
            tanggal_kembali: selected.tanggal_kembali,
            keterangan: selected.keterangan,
        });
    } else {
        setFormData(defaultFormData);
    }
}, [selected]);


        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };

        const handleClear = () => {
            setFormData(defaultFormData);
            setSelected(null);
        };

    // =============================================
    //  CEK NISIN / NIP (VERSI BENAR, HARUS DIPAKAI)
    // =============================================
    const checkPeminjamID = async () => {
        if (!formData.peminjam_input || !formData.role) {
            return Swal.fire({
                icon: "warning",
                title: "Pilih role & isi NISIN / NIP terlebih dahulu",
            });
        }

        try {
            setLoadingCheck(true);

            let endpoint =
                formData.role === "murid"
                    ? `/students/find/nisin/${formData.peminjam_input}`
                    : `/teachers/find/nip/${formData.peminjam_input}`;

            const res = await api.get(endpoint);

            const data = res.data?.data || res.data;

            if (!data) {
                return Swal.fire({ icon: "error", title: "Data tidak ditemukan" });
            }

            Swal.fire({
                icon: "success",
                title: `Data valid: ${data.nama_lengkap}`,
            });

            setFormData((prev) => ({
                ...prev,
                peminjam_id: prev.role === "murid"
            ? data.nisin
            : data.nip, // WAJIB kirim identitas unik sesuai backend
            }));
        } catch (err) {
            Swal.fire({ icon: "error", title: "Data tidak ditemukan" });
        } finally {
            setLoadingCheck(false);
        }
    };



        // ===== CEK ID BARANG =====
        const checkInventoryID = async () => {
            if (!formData.inventory_id) {
            return Swal.fire({
                icon: "warning",
                title: "Masukkan ID Barang terlebih dahulu",
            });
            }
            try {
            setLoadingCheck(true);
            const res = await api.get(`/inventories/${formData.inventory_id}`);
            if (res.data) {
                Swal.fire({
                icon: "success",
                title: `ID Barang valid: ${res.data.nama_barang}`,
                });
            } else {
                Swal.fire({
                icon: "error",
                title: "ID Barang tidak ditemukan",
                });
            }
            } catch {
            Swal.fire({ icon: "error", title: "Gagal mengecek ID Barang" });
            } finally {
            setLoadingCheck(false);
            }
        };

        // ==================================================
        //  SUBMIT DATA
        // ==================================================
        const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("FORM DATA SAAT SUBMIT", formData);

        try {
            if (!formData.tanggal_pinjam || !formData.tanggal_kembali) {
                return Swal.fire({
                    icon: "warning",
                    title: "Tanggal pinjam & kembali wajib diisi",
                });
            }
                const toSQLDate = (value) => {
                const d = new Date(value);
                if (isNaN(d)) return null;
                const pad = (n) => String(n).padStart(2, "0");
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                };
            const payload = {
                peminjam_id: formData.peminjam_id,
                role: formData.role,
                inventory_id: formData.inventory_id,
                tanggal_pinjam: toSQLDateTime(formData.tanggal_pinjam),
                tanggal_kembali: toSQLDateTime(formData.tanggal_kembali),
                keterangan: formData.keterangan,
                added_by: 1   // atau ambil dari auth
            };
            console.log("PAYLOAD:", payload);
            await api.post("/peminjaman", payload);

            Swal.fire({
                icon: "success",
                title: "Peminjaman berhasil ditambahkan!",
            });

            setFormData(defaultFormData);
            setSelected(null);
            fetchPeminjaman?.();
        } catch (error) {
            console.error("ERROR DETAIL:", error.response?.data); // <--- TAMBAHKAN
            Swal.fire({
                icon: "error",
                title: "Gagal menambahkan peminjaman",
                text: error.response?.data?.message || "Terjadi kesalahan di server",
            });
        }
    };


        const title = selected
            ? `Edit Data Peminjaman (ID: ${selected.id})`
            : "Tambah Peminjaman Baru";

        return (
            <ContentCard title={title}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ROLE */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Role Peminjam
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Pilih Role</option>
                                <option value="guru">Guru (NIP)</option>
                                <option value="murid">Murid (NISN)</option>
                            </select>
                        </div>
                    </div>

                    {/* NISN / NIP */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <InputWithIcon
                                Icon={Key}
                                name="peminjam_input"
                                placeholder={formData.role === "murid" ? "Masukkan NISN" : "Masukkan NIP"}
                                value={formData.peminjam_input}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={checkPeminjamID}
                            disabled={loadingCheck}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-white ${
                                loadingCheck
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            <Check size={16} /> Cek
                        </button>
                    </div>

                {/* ID Barang */}
                <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                    <InputWithIcon
                    Icon={Tag}
                    name="inventory_id"
                    placeholder="Masukkan ID Barang"
                    value={formData.inventory_id}
                    onChange={handleChange}
                    required
                    />
                </div>
                <button
                    type="button"
                    onClick={checkInventoryID}
                    disabled={loadingCheck}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-white ${
                    loadingCheck
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    <Check size={16} /> Cek
                </button>
                </div>

                {/* Tanggal Pinjam */}
                <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tanggal & Waktu Pinjam
                </label>
                <InputWithIcon
                    Icon={CalendarDays}
                    type="date"
                    name="tanggal_pinjam"
                    value={formData.tanggal_pinjam}
                    onChange={handleChange}
                    required
                />
                </div>

                {/* Tanggal Kembali */}
                <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tanggal & Waktu Kembali
                </label>
                <InputWithIcon
                    Icon={CalendarDays}
                    type="date"
                    name="tanggal_kembali"
                    value={formData.tanggal_kembali}
                    onChange={handleChange}
                    required
                />
                </div>

                {/* Keterangan */}
                <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Keterangan
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <textarea
                    name="keterangan"
                    placeholder="Tambahkan keterangan (opsional)"
                    value={formData.keterangan}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                    />
                </div>
                </div>

                {/* Tombol */}
                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 py-2.5 px-6 rounded-lg transition-all duration-200 font-medium hover:bg-indigo-50/50 hover:shadow-md"
                >
                    <RefreshCw size={18} /> Bersihkan
                </button>

                <button
                    type="submit"
                    disabled={loadingSubmit}
                    className={`flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg transition-all duration-200 font-medium shadow-lg ${
                    loadingSubmit
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30"
                    }`}
                >
                    <Save size={18} /> Tambah Data
                </button>
                </div>
            </form>
            </ContentCard>
        );
        }
