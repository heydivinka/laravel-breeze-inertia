// resources/js/Pages/Category/CategoryPage.jsx
import React, { useState } from "react";
import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Folder,
    FolderOpen,
    Coffee,
    CakeSlice,
    Cookie,
    UtensilsCrossed,
    Package,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function CategoryPage({ auth, categories: initialCategories }) {
    const [categories, setCategories] = useState(initialCategories);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Map ikon berdasarkan nama kategori
    const categoryIcons = {
        snacks: <Cookie className="w-5 h-5 text-amber-500" />,
        "main dishes": <UtensilsCrossed className="w-5 h-5 text-rose-500" />,
        desserts: <CakeSlice className="w-5 h-5 text-pink-400" />,
        drinks: <Coffee className="w-5 h-5 text-sky-500" />,
        default: <Package className="w-5 h-5 text-gray-400" />,
    };

    // Tambah kategori baru via API
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            Swal.fire("Error", "Nama kategori tidak boleh kosong", "error");
            return;
        }

        try {
            const response = await router.post("/categories", {
                category_name: newCategoryName,
            }, {
                onSuccess: (res) => {
                    setCategories([...categories, res.props.category]);
                    setNewCategoryName("");
                    setIsAdding(false);
                    Swal.fire("Sukses", "Kategori berhasil ditambahkan", "success");
                },
            });
        } catch (err) {
            console.error("add category", err);
            Swal.fire("Error", "Gagal menambahkan kategori", "error");
        }
    };

    // Hapus kategori
    const handleDeleteCategory = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus kategori ini?",
            text: "Semua inventaris terkait juga akan terpengaruh!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        });
        if (!confirm.isConfirmed) return;

        try {
            await router.delete(`/categories/${id}`, {
                onSuccess: () => {
                    setCategories(categories.filter(c => c.id !== id));
                    Swal.fire("Terhapus!", "Kategori berhasil dihapus.", "success");
                }
            });
        } catch (err) {
            console.error("delete category", err);
            Swal.fire("Error", "Gagal menghapus kategori", "error");
        }
    };

    return (
        <AuthenticatedLayout auth={auth} title="Daftar Kategori" header="Kategori Inventaris">
            <Head title="Kategori Inventaris" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-14 px-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-slate-800 mb-8 flex items-center gap-3"
                >
                    📁 Kategori Inventaris
                </motion.h1>

                {/* Add Category */}
                {isAdding ? (
                    <div className="mb-6 flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Nama kategori baru"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="border px-4 py-2 rounded-lg flex-1"
                        />
                        <button
                            onClick={handleAddCategory}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Tambah
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="bg-gray-300 px-3 py-2 rounded-lg hover:bg-gray-400"
                        >
                            Batal
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="mb-6 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        + Tambah Kategori
                    </button>
                )}

                {/* Categories Grid */}
                {categories.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-500 text-lg"
                    >
                        Belum ada kategori.
                    </motion.p>
                ) : (
                    <motion.div layout className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {categories.map((cat, index) => {
                            const name = cat.category_name?.toLowerCase() || "";
                            const icon = categoryIcons[name] || categoryIcons.default;

                            return (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: index * 0.07 }}
                                    whileHover={{ y: -6, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div className="relative group rounded-3xl shadow-md bg-white p-6 border border-slate-100 hover:border-blue-200 transition-all duration-300">
                                        <Link
                                            href={route("categories.show", cat.id)}
                                            className="flex flex-col items-center justify-center space-y-3"
                                        >
                                            <div className="relative">
                                                <Folder className="w-14 h-14 text-blue-400 group-hover:hidden" />
                                                <FolderOpen className="w-14 h-14 hidden group-hover:block text-blue-500" />
                                                <div className="absolute -bottom-1 -right-2">{icon}</div>
                                            </div>
                                            <h2 className="text-xl font-semibold text-center">{cat.category_name}</h2>
                                        </Link>

                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                                            title="Hapus kategori"
                                        >
                                            &#10005;
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
