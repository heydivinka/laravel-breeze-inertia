<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    // ===========================
    // Inertia Methods
    // ===========================

    public function index()
    {
        $inventories = Inventory::with('category')
            ->orderByDesc('id')
            ->paginate(10);

        return Inertia::render('Inventories/InventoryList', [
            'inventories' => $inventories,
        ]);
    }

    public function create()
    {
        $categories = Category::select('id', 'category_name')
            ->orderBy('category_name')
            ->get();

        return Inertia::render('Inventories/InventoryAdd', [
            'categories' => $categories,
        ]);
    }

    public function edit($id)
    {
        $inventory = Inventory::with('category')->findOrFail($id);
        $categories = Category::select('id', 'category_name')
            ->orderBy('category_name')
            ->get();

        return Inertia::render('Inventories/InventoryEdit', [
            'inventory' => $inventory,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $this->validateInventory($request);

            if (!isset($validated['is_active'])) {
                $validated['is_active'] = true;
            }

            Inventory::create($validated);

            return redirect()
                ->route('inventories.index')
                ->with('success', 'Data inventaris berhasil ditambahkan!');
        } catch (\Throwable $e) {
            \Log::error('Inventory store error: '.$e->getMessage());
            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal menambahkan data: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $inventory = Inventory::findOrFail($id);
            $validated = $this->validateInventory($request, $inventory->id);

            if (!isset($validated['is_active'])) {
                $validated['is_active'] = true;
            }

            $inventory->update($validated);

            return redirect()
                ->route('inventories.index')
                ->with('success', 'Data inventaris berhasil diperbarui!');
        } catch (\Throwable $e) {
            \Log::error('Inventory update error: '.$e->getMessage());
            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $inventory = Inventory::findOrFail($id);
            $inventory->delete();

            return redirect()
                ->route('inventories.index')
                ->with('success', 'Data inventaris berhasil dihapus!');
        } catch (\Throwable $e) {
            \Log::error('Inventory destroy error: '.$e->getMessage());
            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal menghapus data: ' . $e->getMessage()]);
        }
    }

    // ===========================
    // API Methods
    // ===========================

    public function apiIndex()
    {
        // returns array (no pagination) for API usage — you can change to paginate if frontend expects meta
        return response()->json(Inventory::with('category')->orderByDesc('id')->get());
    }

        public function apiStore(Request $request)
    {
        try {
            $validated = $this->validateInventory($request);

            // default is_active
            if (!isset($validated['is_active'])) {
                $validated['is_active'] = true;
            }

            // default category_id
            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }

            // **default status**
            if (empty($validated['status'])) {
                $validated['status'] = 'tersedia';
            }

            $inventory = Inventory::create($validated);
            return response()->json($inventory->loadMissing('category'), 201);
        } catch (\Throwable $e) {
            \Log::error('API inventory store error: '.$e->getMessage(), ['request' => $request->all()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function apiShow(Inventory $inventory)
    {
        return response()->json($inventory->loadMissing('category'));
    }

    public function apiUpdate(Request $request, Inventory $inventory)
    {
        try {
            $validated = $this->validateInventory($request, $inventory->id);

            if (!isset($validated['is_active'])) {
                $validated['is_active'] = true;
            }

            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }

            $inventory->update($validated);
            return response()->json($inventory->loadMissing('category'), 200);
        } catch (\Throwable $e) {
            \Log::error('API inventory update error: '.$e->getMessage(), ['request' => $request->all()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function apiDestroy(Inventory $inventory)
    {
        try {
            $inventory->delete();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            \Log::error('API inventory destroy error: '.$e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ===========================
    // Barcode query (API)
    // ===========================
    // Route expects: GET /api/inventories/barcode/{kode_barang}
    public function apiShowByBarcode($kode_barang)
    {
        $inventory = Inventory::with('category')->where('kode_barang', $kode_barang)->first();

        if (!$inventory) {
            return response()->json(['message' => 'Barang tidak ditemukan.'], 404);
        }

        return response()->json($inventory->loadMissing('category'), 200);
    }

    // ===========================
    // Stats Page
    // ===========================
    public function stats()
    {
        $stats = [
            'total' => Inventory::count(),
            'active' => Inventory::where('is_active', true)->count(),
            'inactive' => Inventory::where('is_active', false)->count(),
        ];

        return Inertia::render('Inventories/InventoryStats', compact('stats'));
    }

    // ===========================
    // Validation helper
    // ===========================
    private function validateInventory(Request $request, $ignoreId = null)
    {
        return $request->validate([
            'kode_barang' => 'required|string|max:255|unique:inventories,kode_barang,' . $ignoreId,
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0',
            'deskripsi' => 'required|string',
            'status' => 'nullable|string', // ubah dari 'required' jadi 'nullable'
            'lokasi_barang' => 'required|string|max:255',
            'is_active' => 'sometimes|boolean',
            'category_id' => 'nullable|exists:categories,id',
        ]);
    }


}
