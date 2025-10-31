import api from "./api";

// Ambil semua data inventaris
export const getInventories = async () => {
  const res = await api.get("/inventories");
  // API returns array; but keep safe if paginate used later (res.data.data)
  return Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
};

// Tambah data baru
export const createInventory = async (data) => {
  const payload = {
    kode_barang: data.kode_barang || `AUTO-${Date.now()}`,
    nama_barang: data.nama_barang,
    jumlah: Number(data.jumlah),
    deskripsi: data.deskripsi || "-",
    status: data.status ?? data.kondisi ?? null, // accept both shapes
    lokasi_barang: data.lokasi_barang ?? data.lokasi ?? null,
    is_active: data.is_active ?? true,
    category_id: data.category_id ?? null,
  };
  const res = await api.post("/inventories", payload);
  return res.data;
};

// Update data berdasarkan ID
export const updateInventory = async (id, data) => {
  const payload = {
    kode_barang: data.kode_barang || `AUTO-${Date.now()}`,
    nama_barang: data.nama_barang,
    jumlah: Number(data.jumlah),
    deskripsi: data.deskripsi || "-",
    status: data.status ?? data.kondisi ?? null,
    lokasi_barang: data.lokasi_barang ?? data.lokasi ?? null,
    is_active: data.is_active ?? true,
    category_id: data.category_id ?? null,
  };
  const res = await api.put(`/inventories/${id}`, payload);
  return res.data;
};

// Hapus data berdasarkan ID
export const deleteInventory = async (id) => {
  await api.delete(`/inventories/${id}`);
};

// Cari inventory berdasarkan barcode
export const findInventoryByBarcode = async (kode_barang) => {
  const res = await api.get(`/inventories/barcode/${kode_barang}`);
  return res.data;
};
