    // src/components/Inventories/InventorySearch.jsx
    import { X } from "lucide-react";

    export default function InventorySearch({ searchTerm, setSearchTerm }) {
    return (
        <div className="mb-6 relative">
        <input
            type="text"
            placeholder='Cari: "#1" untuk ID, "AUTO-123456" untuk Kode Barang, "Laptop" untuk Nama Barang, "Elektronik" untuk Kategori...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Tombol clear input */}
        {searchTerm && (
            <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
            <X size={18} />
            </button>
        )}
        </div>
    );
    }
