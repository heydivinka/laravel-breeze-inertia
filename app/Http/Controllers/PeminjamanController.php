<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Peminjaman;
use App\Models\Inventory;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PeminjamanExport;

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

                $peminjam = $p->role === 'murid'
                    ? Student::where('nisin', $p->peminjam_id)->first()
                    : Teacher::where('nip', $p->peminjam_id)->first();
                // Auto-update status expired untuk peminjaman yang lewat tanggal kembali
                Peminjaman::where('status', 'dipinjam')
                    ->whereDate('tanggal_kembali', '<', now())
                    ->update(['status' => 'expired']);

                return [
                    'id' => $p->id,
                    'peminjam_id' => $p->peminjam_id,
                    'nama_peminjam' => $peminjam?->nama_lengkap ?? 'Nama tidak ditemukan',
                    'role' => $p->role,
                    'inventory' => $p->inventory?->nama_barang ?? 'Barang tidak ditemukan',
                    'tanggal_pinjam' => $p->tanggal_pinjam,
                    'tanggal_kembali' => $p->tanggal_kembali,
                    'keterangan' => $p->keterangan,
                    'status' => $p->status,
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
                    'status' => $p->status,
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
        $inventories = Inventory::where('jumlah', '>', 0)
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang']);

        return Inertia::render('Peminjaman/PeminjamanForm', [
            'inventories' => $inventories,
        ]);
    }

    /**
     * 💾 Simpan data peminjaman baru - FIX JUMLAH
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

                if ($inventory->jumlah <= 0) {
                    throw new \Exception('Barang ini sedang tidak tersedia untuk dipinjam.');
                }

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
                    throw new \Exception('ID peminjam tidak valid. Pastikan NISIN/NIP benar.');
                }

                Peminjaman::create([
                    'peminjam_id' => $peminjamId,
                    'role' => $request->role,
                    'inventory_id' => $request->inventory_id,
                    'tanggal_pinjam' => $request->tanggal_pinjam,
                    'tanggal_kembali' => $request->tanggal_kembali,
                    'keterangan' => $request->keterangan,
                    'status' => 'dipinjam',
                    'added_by' => auth()->id() ?? 'system',
                ]);

                $inventory->jumlah -= 1;
                $inventory->status = $inventory->jumlah > 0 ? 'tersedia' : 'habis';
                $inventory->save();
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
     * API STORE - FIX JUMLAH
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

                if ($inventory->jumlah <= 0) {
                    throw new \Exception('Barang ini sedang tidak tersedia untuk dipinjam.');
                }

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
                    'status' => 'dipinjam',
                    'added_by' => auth()->id() ?? 'system',
                ]);

                $inventory->jumlah -= 1;
                $inventory->status = $inventory->jumlah > 0 ? 'tersedia' : 'habis';
                $inventory->save();
            });

            return response()->json(['message' => 'Peminjaman berhasil disimpan'], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
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
     * 🔁 Update peminjaman - FIX JUMLAH
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

                    $old = Inventory::find($peminjaman->inventory_id);
                    if ($old) {
                        $old->jumlah += 1;
                        $old->status = $old->jumlah > 0 ? 'tersedia' : 'habis';
                        $old->save();
                    }

                    $new = Inventory::find($request->inventory_id);
                    if ($new->jumlah <= 0) {
                        throw new \Exception('Barang yang baru dipilih sedang tidak tersedia.');
                    }

                    $new->jumlah -= 1;
                    $new->status = $new->jumlah > 0 ? 'tersedia' : 'habis';
                    $new->save();
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
     * 🔄 Update Status + Kembalikan Stok
     */
    public function updateStatus(Request $request, $id)
{
    try {
        $peminjaman = Peminjaman::findOrFail($id);

        if ($peminjaman->status === 'dikembalikan') {
            return back()->with('error', 'Barang sudah dikembalikan sebelumnya.');
        }

        // Update status
        $peminjaman->status = 'dikembalikan';
        $peminjaman->save();

        // Kembalikan stok barang (PAKAI jumlah, BUKAN stok)
        $inv = Inventory::find($peminjaman->inventory_id);
        if ($inv) {
            $inv->jumlah = $inv->jumlah + 1;
            $inv->status = $inv->jumlah > 0 ? 'tersedia' : 'habis';
            $inv->save();
        }

        return back()->with('success', 'Status berhasil diperbarui dan stok dikembalikan.');

    } catch (\Exception $e) {
        return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
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
                $inventory->jumlah += 1;
                $inventory->status = $inventory->jumlah > 0 ? 'tersedia' : 'habis';
                $inventory->save();
            }

            $peminjaman->delete();
        });

        return redirect()->route('peminjaman.index')
            ->with('success', 'Data peminjaman berhasil dihapus.');
    }

    /**
     * Helper Query Laporan
     */
    private function filteredQuery($request)
    {
        return Peminjaman::with('inventory')
            ->when($request->tanggal_awal, fn($q) =>
                $q->whereDate('tanggal_pinjam', '>=', $request->tanggal_awal)
            )
            ->when($request->tanggal_akhir, fn($q) =>
                $q->whereDate('tanggal_pinjam', '<=', $request->tanggal_akhir)
            )
            ->when($request->status, fn($q) =>
                $q->where('status', $request->status)
            )
            ->orderBy('tanggal_pinjam', 'desc');
    }

    /**
     * 📄 Halaman Laporan
     */
  public function laporan(Request $request)
{
    $query = Peminjaman::query();

    // Filter tanggal
    if ($request->tanggal_awal && $request->tanggal_akhir) {
        $query->whereBetween('tanggal_pinjam', [
            $request->tanggal_awal,
            $request->tanggal_akhir
        ]);
    }

    // Filter status
    if ($request->status) {
        $query->where('status', $request->status);
    }

    $data = $query->with(['inventory', 'student', 'teacher'])->get();

    return Inertia::render('Laporan/Index', [
        'data' => $data,
        'filters' => [
            'tanggal_awal' => $request->tanggal_awal,
            'tanggal_akhir' => $request->tanggal_akhir,
            'status' => $request->status,
        ]
    ]);
}




    /**
     * 📥 Download PDF
     */
    public function downloadPdf(Request $request)
    {
        $data = $this->filteredQuery($request)->get();

        $pdf = Pdf::loadView('pdf.laporan_peminjaman', ['data' => $data]);

        return $pdf->download('laporan_peminjaman.pdf');
    }

    /**
     * 📥 Download Excel
     */
public function exportExcel(Request $request)
{
    $query = Peminjaman::query();

    // Filter tanggal
    if ($request->tanggal_awal && $request->tanggal_akhir) {
        $query->whereBetween('tanggal_pinjam', [
            $request->tanggal_awal,
            $request->tanggal_akhir
        ]);
    }

    // Filter status
    if ($request->status) {
        $query->where('status', $request->status);
    }

    // Ambil data dengan relasi
    $data = $query->with(['inventory', 'student', 'teacher'])->get();

    // Download Excel
    return Excel::download(new PeminjamanExport($data), 'laporan_peminjaman.xlsx');
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
