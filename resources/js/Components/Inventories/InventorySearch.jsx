    // src/components/Inventories/InventorySearch.jsx
    export default function InventorySearch({ searchTerm, setSearchTerm }) {
    return (
        <div className="mb-5 relative">
        <input
            type="text"
            placeholder='Cari: "#1" untuk ID, "AUTO-123456" untuk Kode Barang, "Laptop" untuk Nama Barang, "Elektronik" untuk Kategori...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        </div>
    );
    }
