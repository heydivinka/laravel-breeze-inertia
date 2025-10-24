    // src/components/Inventories/InventoryStats.jsx
    import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

    export default function InventoryStats({ stats }) {
    const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // Hijau, Kuning, Merah

    const data = [
        { name: "Baik/Baru", value: stats.baikBaru || 0 },
        { name: "Rusak Ringan", value: stats.rusakRingan || 0 },
        { name: "Rusak Berat", value: stats.rusakBerat || 0 },
    ];

    return (
        <div className="bg-neutral-900 p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Statistik Inventaris</h2>
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ResponsiveContainer>
        </div>
    );
    }
