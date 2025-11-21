<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CategoryController; 
use App\Http\Controllers\PeminjamanController; 

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Route untuk frontend React / aplikasi mobile
| Semua route menggunakan API controller methods.
|--------------------------------------------------------------------------
*/

// ===================================================
// FIND ROUTES — Harus di atas route dinamis {student}
// ===================================================
Route::get('students/find/nisin/{nisin}', [StudentController::class, 'apiFindByNisin']);
Route::get('teachers/find/nip/{nip}', [TeacherController::class, 'apiFindByNip']);

// ==============================
// Student API
// ==============================
Route::get('students', [StudentController::class, 'apiIndex']);
Route::get('students/{student}', [StudentController::class, 'apiShow']);
Route::post('students', [StudentController::class, 'apiStore']);
Route::put('students/{student}', [StudentController::class, 'apiUpdate']);
Route::delete('students/{student}', [StudentController::class, 'apiDestroy']);

// ==============================
// Teacher API
// ==============================
Route::get('teachers', [TeacherController::class, 'apiIndex']);
Route::get('teachers/{teacher}', [TeacherController::class, 'apiShow']);
Route::post('teachers', [TeacherController::class, 'apiStore']);
Route::put('teachers/{teacher}', [TeacherController::class, 'apiUpdate']);
Route::delete('teachers/{teacher}', [TeacherController::class, 'apiDestroy']);

// ==============================
// Inventory API
// ==============================
Route::get('inventories', [InventoryController::class, 'apiIndex']);
Route::get('inventories/{inventory}', [InventoryController::class, 'apiShow']);
Route::post('inventories', [InventoryController::class, 'apiStore']);
Route::put('inventories/{inventory}', [InventoryController::class, 'apiUpdate']);
Route::delete('inventories/{inventory}', [InventoryController::class, 'apiDestroy']);

// ==============================
// Category API
// ==============================
Route::get('categories', [CategoryController::class, 'apiIndex']); // ⬅️ Tambahan satu baris aman

// ==============================
// Barcode API
// ==============================
Route::get('inventories/barcode/{kode_barang}', [InventoryController::class, 'apiShowByBarcode']);
Route::get('/categories/{category}/inventories', [CategoryController::class, 'apiShowInventories']);

// Peminjaman API
Route::get('peminjaman', [PeminjamanController::class, 'apiIndex']);
Route::get('peminjaman/{peminjaman}', [PeminjamanController::class, 'apiShow']);
Route::post('peminjaman', [PeminjamanController::class, 'apiStore']);
Route::put('peminjaman/{peminjaman}', [PeminjamanController::class, 'apiUpdate']);
Route::delete('peminjaman/{peminjaman}', [PeminjamanController::class, 'apiDestroy']);

// Peminjam API (gabung murid & guru misalnya)
Route::get('peminjam/{role}/{id}', [PeminjamanController::class, 'apiGetPeminjam']);    
