<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeacherController extends Controller
{
    // ===========================
    // Inertia (web) methods
    // ===========================

    public function index()
    {
        // Mengirim data ke Inertia page (server-side)
        $teachers = Teacher::orderBy('id', 'desc')->get();
        return Inertia::render('Teachers/TeacherList', [
            'teachers' => $teachers
        ]);
    }

    public function create()
    {
        return Inertia::render('Teachers/TeacherAdd');
    }

    public function edit($id)
    {
        $teacher = Teacher::findOrFail($id);
        return Inertia::render('Teachers/TeacherEdit', [
            'teacher' => $teacher
        ]);
    }

    public function show($id)
    {
        $teacher = Teacher::findOrFail($id);
        return Inertia::render('Teachers/TeacherShow', [
            'teacher' => $teacher
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:teachers',
            'nama_lengkap' => 'required|string',
            'jabatan' => 'required|string',
            'no_hp' => 'required|string',
            'email' => 'required|email|unique:teachers',
            'alamat' => 'required|string',
            'is_active' => 'boolean'
        ]);

        Teacher::create($validated);
        return redirect()->route('teachers.index')->with('success', 'Teacher created successfully.');
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'nip' => ['nullable', 'string', Rule::unique('teachers', 'nip')->ignore($teacher->id)],
            'nama_lengkap' => 'nullable|string',
            'jabatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'email' => ['nullable', 'email', Rule::unique('teachers', 'email')->ignore($teacher->id)],
            'alamat' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $teacher->update($validated);
        return redirect()->route('teachers.index')->with('success', 'Teacher updated successfully.');
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();
        return redirect()->route('teachers.index')->with('success', 'Teacher deleted successfully.');
    }

    // ===========================
    // API Methods (JSON)
    // ===========================

    // GET /api/teachers
    public function apiIndex()
    {
        $teachers = Teacher::orderBy('id', 'desc')->get();
        return response()->json($teachers);
    }

    // POST /api/teachers
    public function apiStore(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:teachers',
            'nama_lengkap' => 'required|string',
            'jabatan' => 'required|string',
            'no_hp' => 'required|string',
            'email' => 'required|email|unique:teachers',
            'alamat' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $teacher = Teacher::create($validated);
        return response()->json($teacher, 201);
    }

    // GET /api/teachers/{teacher}
    public function apiShow(Teacher $teacher)
    {
        return response()->json($teacher);
    }

    // PUT /api/teachers/{teacher}
    public function apiUpdate(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'nip' => ['nullable', 'string', Rule::unique('teachers', 'nip')->ignore($teacher->id)],
            'nama_lengkap' => 'nullable|string',
            'jabatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'email' => ['nullable', 'email', Rule::unique('teachers', 'email')->ignore($teacher->id)],
            'alamat' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $teacher->update($validated);
        return response()->json($teacher);
    }

    // DELETE /api/teachers/{teacher}
    public function apiDestroy(Teacher $teacher)
    {
        $teacher->delete();
        return response()->json(null, 204);
    }

    // Stats page (Inertia)
    public function stats()
    {
        $total = Teacher::count();
        $active = Teacher::where('is_active', true)->count();
        $inactive = Teacher::where('is_active', false)->count();

        return Inertia::render('Teachers/TeacherStats', [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
        ]);
    }
}
