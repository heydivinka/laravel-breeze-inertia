    import { useState, useEffect } from "react";
    import { createInventory, updateInventory } from "../../utils/inventory";
    import { Save } from "lucide-react";
    import Swal from "sweetalert2";

    export default function InventoryForm({ fetchItems, selected, setSelected }) {
    const defaultForm = {
        kode_barang: "",
        nama_barang: "",
        kategori: "",
        jumlah: "",
        kondisi: "",
        lokasi: "",
        deskripsi: "",
        is_active: true,
    };

    const [form, setForm] = useState(defaultForm);

    useEffect(() => {
        if (selected) {
        setForm({
            kode_barang: selected.kode_barang || "",
            nama_barang: selected.nama_barang || "",
            kategori: selected.kategori || "",
            jumlah: selected.jumlah || "",
            kondisi: selected.status || "",
            lokasi: selected.lokasi_barang || "",
            deskripsi: selected.deskripsi || "",
            is_active: selected.is_active ?? true,
        });
        } else {
        setForm(defaultForm);
        }
    }, [selected]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        if (selected) {
            await updateInventory(selected.id, form);
            Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
        } else {
            await createInventory(form);
            Swal.fire("Berhasil", "Data berhasil disimpan", "success");
        }
        await fetchItems();
        setSelected(null);
        setForm(defaultForm);
        } catch (err) {
        console.error("Gagal simpan data:", err);
        Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
        {/* Kode Barang (readonly jika ingin auto) */}
        <div>
            <label className="block text-sm mb-2 text-neutral-300">Kode Barang</label>
            <input
            type="text"
            name="kode_barang"
            value={form.kode_barang}
            onChange={handleChange}
            placeholder="AUTO jika kosong"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            readOnly={!selected} // readonly jika create baru
            />
        </div>

        {/* Nama Barang */}
        <div>
            <label className="block text-sm mb-2 text-neutral-300">Nama Barang</label>
            <input
            type="text"
            name="nama_barang"
            value={form.nama_barang}
            onChange={handleChange}
            required
            placeholder="Contoh: Laptop ASUS A15"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>

        {/* Kategori */}
        <div>
            <label className="block text-sm mb-2 text-neutral-300">Kategori</label>
            <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
            <option value="">-- Pilih Kategori --</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Perabotan">Perabotan</option>
            <option value="Alat Tulis">Alat Tulis</option>
            <option value="Kendaraan">Kendaraan</option>
            <option value="Lainnya">Lainnya</option>
            </select>
        </div>

        {/* Jumlah */}
        <div>
            <label className="block text-sm mb-2 text-neutral-300">Jumlah</label>
            <input
            type="number"
            name="jumlah"
            value={form.jumlah}
            onChange={handleChange}
            required
            min="1"
            placeholder="Contoh: 10"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>

        {/* Kondisi */}
        <div>
            <label className="block text-sm mb-2 text-neutral-300">Kondisi</label>
            <select
            name="kondisi"
            value={form.kondisi}
            onChange={handleChange}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
            <option value="">-- Pilih Kondisi --</option>
            <option value="Baru">Baru</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
            </select>
        </div>

        {/* Lokasi */}
        <div>
            <label className="block text-sm mb-2 text-neutral-300">Lokasi Barang</label>
            <input
            type="text"
            name="lokasi"
            value={form.lokasi}
            onChange={handleChange}
            required
            placeholder="Contoh: Ruang Lab Komputer"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>

        {/* Deskripsi */}
        <div>
            <label className="block text-sm mb-2 text-neutral-300">Deskripsi</label>
            <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Deskripsi barang..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>

        <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg transition-all"
        >
            <Save size={18} /> {selected ? "Update Data" : "Simpan Data"}
        </button>
        </form>
    );
    }
