<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Inertia\Inertia;

class StudentController extends Controller
{
    // ===========================
    // Inertia / React Methods
    // ===========================

    public function index()
    {
        $students = Student::all();
        return Inertia::render('Students/StudentList', [
            'students' => $students
        ]);
    }

    public function create()
    {
        return Inertia::render('Students/StudentAdd');
    }

    public function edit($id)
    {
        $student = Student::findOrFail($id);
        return Inertia::render('Students/StudentEdit', [
            'student' => $student
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nisin' => 'required|unique:students',
            'nama_lengkap' => 'required',
            'tempat_lahir' => 'required',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required',
            'jurusan' => 'required',
            'angkatan' => 'required|numeric',
            'no_hp' => 'required',
            'added_by' => 'nullable',
            'is_active' => 'boolean',
        ]);

        Student::create($validated);
        return redirect()->route('students.index')->with('success', 'Data berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'nisin' => 'required|unique:students,nisin,' . $student->id,
            'nama_lengkap' => 'required',
            'tempat_lahir' => 'required',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required',
            'jurusan' => 'required',
            'angkatan' => 'required|numeric',
            'no_hp' => 'required',
            'added_by' => 'nullable',
            'is_active' => 'boolean',
        ]);

        $student->update($validated);
        return redirect()->route('students.index')->with('success', 'Data berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return redirect()->route('students.index')->with('success', 'Data berhasil dihapus!');
    }

    // ===========================
    // API Methods
    // ===========================

    public function apiIndex()
    {
        return response()->json(Student::orderBy('nama_lengkap')->get());
    }

    public function apiStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'nisin' => 'required|unique:students',
                'nama_lengkap' => 'required',
                'tempat_lahir' => 'required',
                'tanggal_lahir' => 'required|date',
                'alamat' => 'required',
                'jurusan' => 'required',
                'angkatan' => 'required|numeric',
                'no_hp' => 'required',
                'added_by' => 'nullable',
                'is_active' => 'boolean',
            ]);

            $student = Student::create($validated);
            return response()->json($student, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function apiShow(Student $student)
    {
        return response()->json($student);
    }

    public function apiUpdate(Request $request, Student $student)
    {
        try {
            $validated = $request->validate([
                'nisin' => 'required|unique:students,nisin,' . $student->id,
                'nama_lengkap' => 'required',
                'tempat_lahir' => 'required',
                'tanggal_lahir' => 'required|date',
                'alamat' => 'required',
                'jurusan' => 'required',
                'angkatan' => 'required|numeric',
                'no_hp' => 'required',
                'added_by' => 'nullable',
                'is_active' => 'boolean',
            ]);

            $student->update($validated);
            return response()->json($student);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function apiDestroy(Student $student)
    {
        try {
            $student->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function stats()
    {
        $total = Student::count();
        $active = Student::where('is_active', true)->count();
        $inactive = Student::where('is_active', false)->count();
        $byJurusan = Student::select('jurusan')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('jurusan')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Students/StudentStats', [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'byJurusan' => $byJurusan,
        ]);
    }
}
