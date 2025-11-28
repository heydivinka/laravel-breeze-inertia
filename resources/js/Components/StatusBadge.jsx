export default function StatusBadge({ status }) {
    const color = {
        pending: "bg-yellow-100 text-yellow-800",
        dipinjam: "bg-blue-100 text-blue-800",
        dikembalikan: "bg-green-100 text-green-800",
        hilang: "bg-red-100 text-red-800",
        expired: "bg-orange-100 text-orange-800",
    }[status] || "bg-gray-100 text-gray-800";

    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
            {status}
        </span>
    );
}
