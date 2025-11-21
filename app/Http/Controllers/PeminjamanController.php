<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Peminjaman;
use App\Models\Inventory;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PeminjamanController extends Controller
{
    /**
     * 🧾 Tampilkan daftar peminjaman (dengan filter optional)
     */
    public function index(Request $request)
    {
        $role = $request->query('role');

        $peminjaman = Peminjaman::with('inventory')
            ->when($role, fn($query) => $query->where('role', $role))
            ->latest()
            ->paginate(10)
            ->through(function ($p) {

                // Ambil murid/guru berdasarkan nisin / nip
                $peminjam = $p->role === 'murid'
                    ? Student::where('nisin', $p->peminjam_id)->first()
                    : Teacher::where('nip', $p->peminjam_id)->first();

                return [
                    'id' => $p->id,
                    'peminjam_id' => $p->peminjam_id,
                    'nama_peminjam' => $peminjam?->nama_lengkap ?? 'Nama tidak ditemukan',
                    'role' => $p->role,
                    'inventory' => $p->inventory?->nama_barang ?? 'Barang tidak ditemukan',
                    'tanggal_pinjam' => $p->tanggal_pinjam,
                    'tanggal_kembali' => $p->tanggal_kembali,
                    'keterangan' => $p->keterangan,
                    'added_by' => $p->added_by,
                ];
            });

        return Inertia::render('Peminjaman/PeminjamanList', [
            'peminjaman' => $peminjaman,
            'filterRole' => $role,
        ]);
    }

    /**
     * 📡 API - daftar peminjaman
     */
    public function apiIndex(Request $request)
    {
        $role = $request->query('role');

        $peminjaman = Peminjaman::with('inventory')
            ->when($role, fn($query) => $query->where('role', $role))
            ->latest()
            ->get()
            ->map(function ($p) {

                $peminjam = $p->role === 'murid'
                    ? Student::where('nisin', $p->peminjam_id)->first()
                    : Teacher::where('nip', $p->peminjam_id)->first();

                return [
                    'id' => $p->id,
                    'peminjam_id' => $p->peminjam_id,
                    'nama_peminjam' => $peminjam?->nama_lengkap ?? 'Nama tidak ditemukan',
                    'role' => $p->role,
                    'inventory' => $p->inventory?->nama_barang ?? 'Barang tidak ditemukan',
                    'tanggal_pinjam' => $p->tanggal_pinjam,
                    'tanggal_kembali' => $p->tanggal_kembali,
                    'keterangan' => $p->keterangan,
                    'added_by' => $p->added_by,
                ];
            });

        return response()->json($peminjaman);
    }

    /**
     * ➕ Halaman form tambah peminjaman
     */
    public function create()
    {
        $inventories = Inventory::where('status', 'tersedia')
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang']);

        return Inertia::render('Peminjaman/PeminjamanForm', [
            'inventories' => $inventories,
        ]);
    }

    /**
 * 💾 Simpan data peminjaman baru - FIXED VERSION
 */
public function store(Request $request)
{
    $validated = $request->validate([
        'peminjam_id' => 'required|string',
        'role' => 'required|string|in:guru,murid',
        'inventory_id' => 'required|exists:inventories,id',
        'tanggal_pinjam' => 'required|date',
        'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
        'keterangan' => 'nullable|string',
    ]);

    try {
        DB::transaction(function () use ($validated, $request) {
            $inventory = Inventory::findOrFail($request->inventory_id);

            if ($inventory->status !== 'tersedia') {
                throw new \Exception('Barang ini sedang tidak tersedia untuk dipinjam.');
            }

            // 🚨 PERBAIKAN UTAMA: Handle kedua skenario (ID internal dan NISIN/NIP)
            if ($request->role === 'murid') {
                // Coba cari berdasarkan nisin dulu
                $peminjam = Student::where('nisin', $request->peminjam_id)->first();
                
                // Jika tidak ketemu, mungkin frontend kirim ID internal
                if (!$peminjam && is_numeric($request->peminjam_id)) {
                    $peminjam = Student::find($request->peminjam_id);
                }
                
                $peminjamId = $peminjam?->nisin;
            } else {
                // Coba cari berdasarkan nip dulu
                $peminjam = Teacher::where('nip', $request->peminjam_id)->first();
                
                // Jika tidak ketemu, mungkin frontend kirim ID internal
                if (!$peminjam && is_numeric($request->peminjam_id)) {
                    $peminjam = Teacher::find($request->peminjam_id);
                }
                
                $peminjamId = $peminjam?->nip;
            }

            if (!$peminjamId) {
                throw new \Exception('ID peminjam tidak valid. Pastikan NISIN/NIP benar.');
            }

            Peminjaman::create([
                'peminjam_id' => $peminjamId, // Simpan sebagai NISIN/NIP
                'role' => $request->role,
                'inventory_id' => $request->inventory_id,
                'tanggal_pinjam' => $request->tanggal_pinjam,
                'tanggal_kembali' => $request->tanggal_kembali,
                'keterangan' => $request->keterangan,
                'added_by' => auth()->id() ?? 'system',
            ]);

            $inventory->update(['status' => 'dipinjam']);
        });

        return redirect()->route('peminjaman.index')
            ->with('success', 'Peminjaman berhasil disimpan.');

    } catch (\Exception $e) {
        return redirect()->back()
            ->withInput()
            ->withErrors(['error' => $e->getMessage()]);
    }
}

/**
 * API STORE - FIXED VERSION
 */
public function apiStore(Request $request)
{
    $validated = $request->validate([
        'peminjam_id' => 'required|string',
        'role' => 'required|string|in:guru,murid',
        'inventory_id' => 'required|exists:inventories,id',
        'tanggal_pinjam' => 'required|date',
        'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
        'keterangan' => 'nullable|string',
    ]);

    try {
        DB::transaction(function () use ($validated, $request) {
            $inventory = Inventory::findOrFail($request->inventory_id);

            if ($inventory->status !== 'tersedia') {
                throw new \Exception('Barang ini sedang tidak tersedia untuk dipinjam.');
            }

            // 🚨 PERBAIKAN YANG SAMA UNTUK API
            if ($request->role === 'murid') {
                $peminjam = Student::where('nisin', $request->peminjam_id)->first();
                
                if (!$peminjam && is_numeric($request->peminjam_id)) {
                    $peminjam = Student::find($request->peminjam_id);
                }
                
                $peminjamId = $peminjam?->nisin;
            } else {
                $peminjam = Teacher::where('nip', $request->peminjam_id)->first();
                
                if (!$peminjam && is_numeric($request->peminjam_id)) {
                    $peminjam = Teacher::find($request->peminjam_id);
                }
                
                $peminjamId = $peminjam?->nip;
            }

            if (!$peminjamId) {
                throw new \Exception('ID peminjam tidak valid.');
            }

            Peminjaman::create([
                'peminjam_id' => $peminjamId,
                'role' => $request->role,
                'inventory_id' => $request->inventory_id,
                'tanggal_pinjam' => $request->tanggal_pinjam,
                'tanggal_kembali' => $request->tanggal_kembali,
                'keterangan' => $request->keterangan,
                'added_by' => auth()->id() ?? 'system',
            ]);

            $inventory->update(['status' => 'dipinjam']);
        });

        return response()->json(['message' => 'Peminjaman berhasil disimpan'], 201);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
}

    /**
     * 🔍 Detail peminjaman
     */
    public function show($id)
    {
        $peminjaman = Peminjaman::with('inventory')->findOrFail($id);

        return Inertia::render('Peminjaman/PeminjamanShow', [
            'peminjaman' => $peminjaman,
        ]);
    }

    /**
     * ✏️ Edit peminjaman
     */
    public function edit($id)
    {
        $peminjaman = Peminjaman::findOrFail($id);
        $inventories = Inventory::orderBy('nama_barang')->get(['id', 'nama_barang']);

        return Inertia::render('Peminjaman/PeminjamanForm', [
            'peminjaman' => $peminjaman,
            'inventories' => $inventories,
            'isEdit' => true,
        ]);
    }

    /**
 * 🔁 Update peminjaman - FIXED VERSION
 */
public function update(Request $request, $id)
{
    $validated = $request->validate([
        'peminjam_id' => 'required|string',
        'role' => 'required|string|in:guru,murid',
        'inventory_id' => 'required|exists:inventories,id',
        'tanggal_pinjam' => 'required|date',
        'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
        'keterangan' => 'nullable|string',
    ]);

    try {
        DB::transaction(function () use ($id, $validated, $request) {
            $peminjaman = Peminjaman::findOrFail($id);

            // 🚨 TERAPKAN LOGIKA YANG SAMA
            if ($request->role === 'murid') {
                $peminjam = Student::where('nisin', $request->peminjam_id)->first();
                
                if (!$peminjam && is_numeric($request->peminjam_id)) {
                    $peminjam = Student::find($request->peminjam_id);
                }
                
                $peminjamId = $peminjam?->nisin;
            } else {
                $peminjam = Teacher::where('nip', $request->peminjam_id)->first();
                
                if (!$peminjam && is_numeric($request->peminjam_id)) {
                    $peminjam = Teacher::find($request->peminjam_id);
                }
                
                $peminjamId = $peminjam?->nip;
            }

            if (!$peminjamId) {
                throw new \Exception('ID peminjam tidak valid.');
            }

            if ($peminjaman->inventory_id != $request->inventory_id) {
                Inventory::find($peminjaman->inventory_id)?->update(['status' => 'tersedia']);
                Inventory::find($request->inventory_id)?->update(['status' => 'dipinjam']);
            }

            $peminjaman->update([
                'peminjam_id' => $peminjamId,
                'role' => $request->role,
                'inventory_id' => $request->inventory_id,
                'tanggal_pinjam' => $request->tanggal_pinjam,
                'tanggal_kembali' => $request->tanggal_kembali,
                'keterangan' => $request->keterangan,
            ]);
        });

        return redirect()->route('peminjaman.index')
            ->with('success', 'Data peminjaman berhasil diperbarui.');

    } catch (\Exception $e) {
        return redirect()->back()
            ->withInput()
            ->withErrors(['error' => $e->getMessage()]);
    }
}

    /**
     * ❌ Hapus peminjaman
     */
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $peminjaman = Peminjaman::findOrFail($id);
            $inventory = Inventory::find($peminjaman->inventory_id);

            if ($inventory) {
                $inventory->update(['status' => 'tersedia']);
            }

            $peminjaman->delete();
        });

        return redirect()->route('peminjaman.index')
            ->with('success', 'Data peminjaman berhasil dihapus.');
    }

    /**
     * 📡 API - Cek ID peminjam (NISIN / NIP)
     */
    public function apiGetPeminjam($role, $id)
    {
        if ($role === 'murid') {
            $data = Student::where('nisin', $id)->first();
            $peminjamId = $data?->nisin;
        } elseif ($role === 'guru') {
            $data = Teacher::where('nip', $id)->first();
            $peminjamId = $data?->nip;
        } else {
            return response()->json(['error' => 'Role tidak valid'], 400);
        }

        if ($data) {
            return response()->json([
                'id' => $peminjamId,
                'nama' => $data->nama_lengkap,
                'role' => $role,
            ]);
        } else {
            return response()->json(['error' => 'ID tidak ditemukan'], 404);
        }
    }
}
