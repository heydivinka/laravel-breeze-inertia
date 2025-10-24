    // src/components/StudentForm.jsx
    import { useEffect, useState } from "react";
    import Swal from "sweetalert2";
    import api from "../../utils/api";
    import { Save } from "lucide-react";

    export default function StudentForm({ fetchStudents, selected, setSelected }) {
    const [formData, setFormData] = useState({
        nisin: "",
        nama_lengkap: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        alamat: "",
        jurusan: "",
        angkatan: "",
        no_hp: "",
        added_by: "Admin",
        is_active: true,
        // photo: null, // dihapus sementara
    });

    useEffect(() => {
        if (selected) {
        setFormData({ ...selected });
        }
    }, [selected]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "nisin") {
        const onlyNumbers = value.replace(/\D/g, "");
        if (onlyNumbers.length <= 10)
            setFormData({ ...formData, [name]: onlyNumbers });
        } else if (name === "no_hp") {
        const onlyNumbers = value.replace(/\D/g, "");
        if (onlyNumbers.length <= 12)
            setFormData({ ...formData, [name]: onlyNumbers });
        } else if (type === "checkbox") {
        setFormData({ ...formData, [name]: checked });
        } else {
        setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.nisin.length !== 10) {
        Swal.fire("Gagal!", "NISN harus 10 digit.", "error");
        return;
        }

        if (formData.no_hp.length < 10 || formData.no_hp.length > 12) {
        Swal.fire("Gagal!", "Nomor HP harus 10–12 digit.", "error");
        return;
        }

        try {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) {
            if (key === "angkatan") data.append(key, Number(formData[key]));
            else if (key === "is_active") data.append(key, formData[key] ? 1 : 0);
            else data.append(key, formData[key]);
            }
        });

        if (selected) {
            await api.post(`/students/${selected.id}?_method=PUT`, data);
            Swal.fire("Updated!", "Data berhasil diperbarui!", "success");
        } else {
            await api.post("/students", data);
            Swal.fire("Added!", "Data berhasil ditambahkan!", "success");
        }

        fetchStudents();
        setFormData({
            nisin: "",
            nama_lengkap: "",
            tempat_lahir: "",
            tanggal_lahir: "",
            alamat: "",
            jurusan: "",
            angkatan: "",
            no_hp: "",
            added_by: "Admin",
            is_active: true,
            // photo: null,
        });
        setSelected(null);
        } catch (error) {
        console.error(error.response?.data || error);
        Swal.fire("Gagal!", "Periksa input data.", "error");
        }
    };

    const inputClass =
        "bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 w-full";

    const jurusanOptions = [
        { value: "", label: "Pilih Jurusan" },
        { value: "Animasi", label: "Animasi" },
        { value: "Broadcasting", label: "Broadcasting" },
        { value: "PPLG", label: "PPLG" },
        { value: "Teknik Otomotif", label: "Teknik Otomotif" },
        { value: "TPFL", label: "TPFL" },
    ];

    const angkatanOptions = Array.from({ length: 18 }, (_, i) => 18 - i);

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-neutral-900 p-6 rounded-xl shadow-lg">
        {/* NISN */}
        <input
            type="text"
            name="nisin"
            placeholder="NISN (10 digit)"
            value={formData.nisin}
            onChange={handleChange}
            required
            maxLength={10}
            className={inputClass}
        />

        {/* Nama Lengkap */}
        <input
            type="text"
            name="nama_lengkap"
            placeholder="Nama Lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            required
            className={inputClass}
        />

        {/* Tempat Lahir */}
        <input
            type="text"
            name="tempat_lahir"
            placeholder="Tempat Lahir"
            value={formData.tempat_lahir}
            onChange={handleChange}
            required
            className={inputClass}
        />

        {/* Tanggal Lahir */}
        <input
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            required
            className={inputClass}
        />

        {/* Alamat */}
        <input
            type="text"
            name="alamat"
            placeholder="Alamat"
            value={formData.alamat}
            onChange={handleChange}
            required
            className={`col-span-2 ${inputClass}`}
        />

        {/* Jurusan */}
        <select
            name="jurusan"
            value={formData.jurusan}
            onChange={handleChange}
            required
            className={`${inputClass} appearance-none`}
        >
            {jurusanOptions.map((option) => (
            <option key={option.value} value={option.value} disabled={option.value === ""}>
                {option.label}
            </option>
            ))}
        </select>

        {/* Angkatan */}
        <div className="relative">
            <select
            name="angkatan"
            value={formData.angkatan}
            onChange={handleChange}
            required
            className={`${inputClass} appearance-none w-[120px] text-sm bg-black text-white border border-neutral-700 rounded-lg py-2.5 pl-3 pr-6 max-h-[130px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-900`}
            >
            <option value="" disabled>
                Pilih Angkatan
            </option>
            {angkatanOptions.map((num) => (
                <option key={num} value={num}>
                {num}
                </option>
            ))}
            </select>
        </div>

        {/* Nomor HP */}
        <input
            type="text"
            name="no_hp"
            placeholder="No HP (contoh: 0895xxxxxxx)"
            value={formData.no_hp}
            onChange={handleChange}
            required
            maxLength={12}
            className={inputClass}
        />

        {/* Checkbox is_active */}
        <div className="col-span-2 flex items-center gap-2">
            <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-5 h-5 accent-emerald-500"
            />
            <label>Aktif</label>
        </div>

        {/* Tombol Submit */}
        <button
            type="submit"
            className="col-span-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md"
        >
            <Save size={18} />
            {selected ? "Update Data" : "Tambah Data"}
        </button>
        </form>
    );
    }
