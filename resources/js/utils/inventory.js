    import api from "./api";

    // Ambil semua data inventaris
    export const getInventories = async () => {
    const res = await api.get("/inventories");
    return Array.isArray(res.data.data) ? res.data.data : [];
    };

    // Tambah data baru
    export const createInventory = async (data) => {
    const payload = {
        kode_barang: data.kode_barang || `AUTO-${Date.now()}`,
        nama_barang: data.nama_barang,
        kategori: data.kategori,
        jumlah: Number(data.jumlah),
        status: data.kondisi,
        lokasi_barang: data.lokasi,
        deskripsi: data.deskripsi || "-",
        is_active: data.is_active ?? true,
    };
    const res = await api.post("/inventories", payload);
    return res.data;
    };

    // Update data berdasarkan ID
    export const updateInventory = async (id, data) => {
    const payload = {
        kode_barang: data.kode_barang || `AUTO-${Date.now()}`,
        nama_barang: data.nama_barang,
        kategori: data.kategori,
        jumlah: Number(data.jumlah),
        status: data.kondisi,
        lokasi_barang: data.lokasi,
        deskripsi: data.deskripsi || "-",
        is_active: data.is_active ?? true,
    };
    const res = await api.put(`/inventories/${id}`, payload);
    return res.data;
    };

    // Hapus data berdasarkan ID
    export const deleteInventory = async (id) => {
    await api.delete(`/inventories/${id}`);
    };
