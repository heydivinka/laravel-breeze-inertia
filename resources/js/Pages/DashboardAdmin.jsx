    import { useEffect, useState, useRef } from "react";
    import { Head, Link } from "@inertiajs/react";
    import { motion } from "framer-motion";
    import {
    Users,
    UserCheck,
    UserX,
    CheckCircle2,
    XCircle,
    X,
    } from "lucide-react";
    import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    } from "recharts";

    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import api from "../utils/api";

    export default function Dashboard({ auth, searchTerm = "" }) {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({ total: 0, aktif: 0, tidakAktif: 0 });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const gridRef = useRef(null);

    const normalizeStudent = (s) => ({
        ...s,
        is_active: s.is_active === true || s.is_active === 1 || s.is_active === "1",
    });

    const fetchStudents = async () => {
        try {
        const res = await api.get("/students");
        const data = Array.isArray(res.data) ? res.data : [];
        const normalized = data.map(normalizeStudent);
        setStudents(normalized);

        const aktif = normalized.filter((s) => s.is_active).length;
        setStats({
            total: normalized.length,
            aktif,
            tidakAktif: normalized.length - aktif,
        });
        } catch (err) {
        console.error("fetchStudents error:", err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const chartData = [
        { name: "Total", value: stats.total },
        { name: "Aktif", value: stats.aktif },
        { name: "Tidak Aktif", value: stats.tidakAktif },
    ];

    const filteredStudents = students.filter((student) =>
        student.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (searchTerm && gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [searchTerm]);

    return (
        <AuthenticatedLayout auth={auth} header={<h2>Dashboard</h2>}>
        <Head title="Dashboard" />

        <div className="p-6 md:p-8 bg-black text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Dashboard Siswa</h1>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <Card
                icon={<Users className="w-10 h-10 text-white" />}
                title="Total Siswa"
                value={stats.total}
            />
            <Card
                icon={<UserCheck className="w-10 h-10 text-green-400" />}
                title="Siswa Aktif"
                value={stats.aktif}
                color="text-green-400"
            />
            <Card
                icon={<UserX className="w-10 h-10 text-red-400" />}
                title="Tidak Aktif"
                value={stats.tidakAktif}
                color="text-red-400"
            />
            </div>

            {/* Chart */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-lg mb-10">
            <h2 className="text-2xl font-bold mb-4">Statistik Visual</h2>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 30, right: 30, left: 0, bottom: 10 }}
                >
                    <defs>
                    <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.5} />
                    </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis
                    dataKey="name"
                    stroke="#aaa"
                    tickLine={false}
                    axisLine={{ stroke: "#333" }}
                    />
                    <YAxis
                    stroke="#aaa"
                    tickLine={false}
                    axisLine={{ stroke: "#333" }}
                    />
                    <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                        color: "#fff",
                    }}
                    labelStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                    itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Bar
                    dataKey="value"
                    fill="url(#barColor)"
                    radius={[12, 12, 0, 0]}
                    barSize={50}
                    animationDuration={1200}
                    label={{
                        position: "top",
                        fill: "#fff",
                        fontSize: 14,
                        fontWeight: "bold",
                    }}
                    />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Daftar Siswa */}
            <div ref={gridRef} className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Daftar Siswa</h2>
            {filteredStudents.length === 0 ? (
                <p className="text-neutral-500">Tidak ada siswa ditemukan.</p>
            ) : (
                <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
                >
                {filteredStudents.map((student) => (
                    <StudentCard
                    key={student.id}
                    student={student}
                    backendUrl={backendUrl}
                    onSelect={() => setSelectedStudent(student)}
                    />
                ))}
                </motion.div>
            )}
            </div>

            {/* Tombol Kelola */}
            <div className="mt-10">
            <Link
                href="/students"
                className="inline-block bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-neutral-200 transition-all shadow-md"
            >
                Kelola Data Siswa
            </Link>
            </div>

            {/* Modal Detail Siswa */}
            {selectedStudent && (
            <StudentModal
                student={selectedStudent}
                backendUrl={backendUrl}
                onClose={() => setSelectedStudent(null)}
            />
            )}
        </div>
        </AuthenticatedLayout>
    );
    }

    /* ================= Subcomponents ================= */

    function Card({ icon, title, value, color }) {
    return (
        <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:bg-neutral-800 transition-all">
        {icon}
        <div>
            <h2 className="text-lg opacity-80">{title}</h2>
            <p className={`text-3xl font-semibold ${color || ""}`}>{value}</p>
        </div>
        </div>
    );
    }

    function StudentCard({ student, backendUrl, onSelect }) {
    return (
        <motion.div
        onClick={onSelect}
        className="bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
        whileHover={{ scale: 1.05 }}
        >
        <div className="w-full relative overflow-hidden">
            <div className="pt-[100%] relative">
            <img
                src={
                student.photo ? `${backendUrl}/${student.photo}` : "/placeholder.png"
                }
                alt={student.nama_lengkap}
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            </div>
        </div>

        <div className="p-4 text-white">
            <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{student.nama_lengkap}</h3>
            {student.is_active ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" title="Aktif" />
            ) : (
                <XCircle className="w-4 h-4 text-red-400" title="Tidak Aktif" />
            )}
            </div>
            <p className="text-sm opacity-80">NISN: {student.nisin}</p>
            <p className="text-sm opacity-80">Jurusan: {student.jurusan}</p>
            <p className="text-sm opacity-80">Angkatan: {student.angkatan}</p>
        </div>
        </motion.div>
    );
    }

    function StudentModal({ student, backendUrl, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-lg relative border border-white/10">
            <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-red-400 transition"
            >
            <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center">
            <img
                src={
                student.photo ? `${backendUrl}/${student.photo}` : "/placeholder.png"
                }
                alt={student.nama_lengkap}
                className="w-40 h-40 object-cover rounded-xl mb-4 border border-white/10"
            />
            <h3 className="text-2xl font-bold mb-2">{student.nama_lengkap}</h3>
            <p className="opacity-70 mb-4">
                {student.is_active ? "Status: Aktif ✅" : "Status: Tidak Aktif ❌"}
            </p>

            <div className="w-full text-left space-y-2 text-sm">
                <StudentInfo label="NISN" value={student.nisin} />
                <StudentInfo label="Tempat Lahir" value={student.tempat_lahir} />
                <StudentInfo label="Tanggal Lahir" value={student.tanggal_lahir} />
                <StudentInfo label="Alamat" value={student.alamat} />
                <StudentInfo label="Jurusan" value={student.jurusan} />
                <StudentInfo label="Angkatan" value={student.angkatan} />
                <StudentInfo label="No HP" value={student.no_hp} />
                <StudentInfo label="Ditambahkan oleh" value={student.added_by} />
                <StudentInfo
                label="Tanggal dibuat"
                value={
                    student.created_at
                    ? new Date(student.created_at).toLocaleString()
                    : "-"
                }
                />
                <StudentInfo
                label="Terakhir diubah"
                value={
                    student.updated_at
                    ? new Date(student.updated_at).toLocaleString()
                    : "-"
                }
                />
            </div>
            </div>
        </div>
        </div>
    );
    }

    function StudentInfo({ label, value }) {
    return (
        <p>
        <span className="opacity-70">{label}:</span> {value}
        </p>
    );
    }
