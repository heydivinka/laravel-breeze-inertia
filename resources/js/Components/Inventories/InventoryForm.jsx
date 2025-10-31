import { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  Package,
  Layers,
  Hash,
  MapPin,
  FileText,
} from "lucide-react";
import Swal from "sweetalert2";
import { createInventory, updateInventory } from "../../utils/inventory";

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
  required,
  type = "text",
  readOnly = false,
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
      required={required}
      maxLength={maxLength}
      readOnly={readOnly}
      className={`bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 
      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 
      py-2.5 pr-4 pl-10 w-full ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
  </div>
);

export default function InventoryForm({ fetchItems, selected, setSelected }) {
  const defaultForm = {
    kode_barang: "",
    nama_barang: "",
    category_id: "",
    jumlah: "",
    kondisi: "",
    lokasi: "",
    deskripsi: "",
    is_active: true,
  };

  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);

  // Ambil kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };
    fetchCategories();
  }, []);

  // Isi form saat mode edit
  useEffect(() => {
    if (selected) {
      setForm({
        kode_barang: selected.kode_barang || "",
        nama_barang: selected.nama_barang || "",
        category_id: selected.category_id || "",
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

  // Auto fetch data ketika scan barcode
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (form.kode_barang.trim() !== "" && !selected) {
        try {
          const res = await fetch(`/api/inventories/barcode/${form.kode_barang}`);
          if (!res.ok) throw new Error("Barang tidak ditemukan");
          const data = await res.json();

          setForm({
            ...form,
            nama_barang: data.nama_barang || "",
            category_id: data.category_id || "",
            jumlah: data.jumlah || "",
            kondisi: data.status || "",
            lokasi: data.lokasi_barang || "",
            deskripsi: data.deskripsi || "",
            is_active: data.is_active ?? true,
          });

          Swal.fire({
            icon: "success",
            title: "Data berhasil diambil dari barcode!",
            timer: 1200,
            showConfirmButton: false,
          });
        } catch (err) {
          // barcode not found -> silent or notify
          Swal.fire({
            icon: "warning",
            title: "Barcode tidak dikenali",
            text: "Silakan isi data secara manual.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [form.kode_barang, selected]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleClear = () => {
    setForm(defaultForm);
    setSelected && setSelected(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mapping payload agar sesuai backend
      const payload = {
        kode_barang: form.kode_barang,
        nama_barang: form.nama_barang,
        category_id: form.category_id ? Number(form.category_id) : null,
        jumlah: Number(form.jumlah) || 0,
        status: form.kondisi,
        lokasi_barang: form.lokasi,
        deskripsi: form.deskripsi || "-",
        is_active: form.is_active ?? true,
      };

      if (selected) {
        await updateInventory(selected.id, payload);
        Swal.fire({
          icon: "success",
          title: "Data inventaris berhasil diperbarui!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createInventory(payload);
        Swal.fire({
          icon: "success",
          title: "Inventaris baru berhasil ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      if (fetchItems) fetchItems();
      handleClear();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: err.response?.data?.error || "Periksa kembali inputan atau koneksi server.",
      });
    }
  };

  const title = selected
    ? `Edit Barang: ${selected.nama_barang || "..."}`
    : "Tambah Barang Inventaris";

  return (
    <ContentCard title={title}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kode Barang */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Kode Barang (Scan Barcode)
          </label>
          <InputWithIcon
            Icon={Hash}
            name="kode_barang"
            placeholder="Scan barcode di sini..."
            value={form.kode_barang}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nama Barang */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Barang</label>
          <InputWithIcon
            Icon={Package}
            name="nama_barang"
            placeholder="Contoh: Laptop ASUS A15"
            value={form.nama_barang}
            onChange={handleChange}
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Kategori</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))
            ) : (
              <option disabled>Memuat kategori...</option>
            )}
          </select>
        </div>

        {/* Jumlah */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Jumlah</label>
          <InputWithIcon
            Icon={Layers}
            type="number"
            name="jumlah"
            placeholder="Contoh: 10"
            value={form.jumlah}
            onChange={handleChange}
            required
          />
        </div>

        {/* Lokasi */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Lokasi Barang</label>
          <InputWithIcon
            Icon={MapPin}
            name="lokasi"
            placeholder="Contoh: Ruang Lab Komputer"
            value={form.lokasi}
            onChange={handleChange}
            required
          />
        </div>

        {/* Deskripsi */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Deskripsi</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Deskripsi barang..."
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Status Aktif */}
        <div className="col-span-1 md:col-span-2 flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="is_active_check"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-5 h-5 accent-indigo-500 bg-white border-gray-400 rounded cursor-pointer focus:ring-indigo-500"
          />
          <label htmlFor="is_active_check" className="text-gray-700 font-medium select-none">
            Aktif
          </label>
        </div>

        {/* Tombol */}
        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-gray-100">
          {(selected || form.nama_barang) && (
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
  );
}
