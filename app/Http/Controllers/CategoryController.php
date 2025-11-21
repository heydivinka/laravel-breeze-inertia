<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    // ==============================
    // WEB METHODS (Inertia)
    // ==============================

    // List semua kategori
    public function index()
    {
        $categories = Category::all();

        return Inertia::render('Category/CategoryPage', [
            'categories' => $categories
        ]);
    }

    // Halaman create kategori
    public function create()
    {
        return Inertia::render('Category/Create');
    }

    // Simpan kategori baru
    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
        ]);

        Category::create([
            'category_name' => $request->category_name,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    // Halaman edit kategori
    public function edit($id)
    {
        $category = Category::findOrFail($id);

        return Inertia::render('Category/Edit', [
            'category' => $category
        ]);
    }

    // Update kategori
    public function update(Request $request, $id)
    {
        $request->validate([
            'category_name' => 'nullable|string|max:255',
        ]);

        $category = Category::findOrFail($id);
        $category->update([
            'category_name' => $request->category_name,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    // Hapus kategori
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }

    // ==============================
    // Show kategori beserta inventaris
    // ==============================
    public function show($id, Request $request)
    {
        $category = Category::with(['inventories' => function($query) use ($request) {
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
        }])->findOrFail($id);

        return Inertia::render('Category/CategoryShow', [
            'category' => $category,
            'filter_status' => $request->status ?? 'all'
        ]);
    }

    // ==============================
    // API METHODS (JSON)
    // ==============================

    // List semua kategori
    public function apiIndex()
    {
        return response()->json(Category::all());
    }

    // Detail kategori
    public function apiShow(Category $category)
    {
        return response()->json($category->load('inventories'));
    }

    // Simpan kategori baru
    public function apiStore(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
        ]);

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    // Update kategori
    public function apiUpdate(Request $request, Category $category)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    // Hapus kategori
    public function apiDestroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    // API: inventaris berdasarkan kategori dengan filter status
    public function apiShowInventories(Category $category, Request $request)
    {
        $query = $category->inventories()->with('category');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }
}
