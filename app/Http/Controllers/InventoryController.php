<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    // ===========================
    // Inertia Methods
    // ===========================

    public function index()
    {
        $inventories = Inventory::orderBy('id', 'desc')->get();
        return Inertia::render('Inventories/InventoryList', [
            'inventories' => $inventories
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventories/InventoryAdd');
    }

    public function edit($id)
    {
        $inventory = Inventory::findOrFail($id);
        return Inertia::render('Inventories/InventoryEdit', [
            'inventory' => $inventory
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_barang' => 'required|string|unique:inventories',
            'nama_barang' => 'required|string',
            'kategori' => 'required|string',
            'jumlah' => 'required|integer|min:0',
            'deskripsi' => 'required|string',
            'status' => 'required|string',
            'lokasi_barang' => 'required|string',
            'is_active' => 'boolean'
        ]);

        Inventory::create($validated);
        return redirect()->route('inventories.index')->with('success', 'Data inventaris berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);

        $validated = $request->validate([
            'kode_barang' => 'string|unique:inventories,kode_barang,' . $inventory->id,
            'nama_barang' => 'string',
            'kategori' => 'string',
            'jumlah' => 'integer|min:0',
            'deskripsi' => 'string',
            'status' => 'string',
            'lokasi_barang' => 'string',
            'is_active' => 'boolean'
        ]);

        $inventory->update($validated);
        return redirect()->route('inventories.index')->with('success', 'Data inventaris berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();
        return redirect()->route('inventories.index')->with('success', 'Data inventaris berhasil dihapus!');
    }

    // ===========================
    // API Methods
    // ===========================

    public function apiIndex()
    {
        return response()->json(Inventory::orderBy('id', 'desc')->get());
    }

    public function apiStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'kode_barang' => 'required|string|unique:inventories',
                'nama_barang' => 'required|string',
                'kategori' => 'required|string',
                'jumlah' => 'required|integer|min:0',
                'deskripsi' => 'required|string',
                'status' => 'required|string',
                'lokasi_barang' => 'required|string',
                'is_active' => 'boolean'
            ]);

            $inventory = Inventory::create($validated);
            return response()->json($inventory, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function apiShow(Inventory $inventory)
    {
        return response()->json($inventory);
    }

    public function apiUpdate(Request $request, Inventory $inventory)
    {
        try {
            $validated = $request->validate([
                'kode_barang' => 'string|unique:inventories,kode_barang,' . $inventory->id,
                'nama_barang' => 'string',
                'kategori' => 'string',
                'jumlah' => 'integer|min:0',
                'deskripsi' => 'string',
                'status' => 'string',
                'lokasi_barang' => 'string',
                'is_active' => 'boolean'
            ]);

            $inventory->update($validated);
            return response()->json($inventory);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function apiDestroy(Inventory $inventory)
    {
        try {
            $inventory->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

public function stats()
{
    $total = Inventory::count();
    $active = Inventory::where('is_active', true)->count();
    $inactive = Inventory::where('is_active', false)->count();

    return Inertia::render('Inventories/InventoryStats', [
        'stats' => [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
        ],
    ]);
}
}
