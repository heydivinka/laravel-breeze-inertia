    export default function StudentSearch({ searchTerm, setSearchTerm }) {
    return (
        <div className="mb-6">
        <input
            type="text"
            placeholder="Cari siswa berdasarkan NISIN, Nama, atau Jurusan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        </div>
    );
    }
