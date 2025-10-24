<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\InventoryController;

/*
|--------------------------------------------------------------------------
| Web Routes (Inertia/Blade)
|--------------------------------------------------------------------------
| Halaman berbasis Inertia untuk React/Vue
| Semua route dilindungi auth middleware, kecuali login/register.
|--------------------------------------------------------------------------
*/

// Landing page -> langsung ke login
Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

// Protected routes (auth)
Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | Students Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/students/add', function() {
        return Inertia::render('Students/StudentAdd');
    })->name('students.add');

    Route::resource('students', StudentController::class)->except(['show']);

    /*
    |--------------------------------------------------------------------------
    | Teachers Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/teachers/add', function() {
        return Inertia::render('Teachers/TeacherAdd');
    })->name('teachers.add');

    Route::resource('teachers', TeacherController::class)->except(['show']);

    /*
    |--------------------------------------------------------------------------
    | Inventories Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/inventories/add', function() {
        return Inertia::render('Inventories/InventoryAdd');
    })->name('inventories.add');

    Route::resource('inventories', InventoryController::class)->except(['show']);

    /*
    |--------------------------------------------------------------------------
    | Statistik Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/students/stats', [StudentController::class, 'stats'])->name('students.stats');
    Route::get('/inventories/stats', [InventoryController::class, 'stats'])->name('inventories.stats');
    Route::get('/teachers/stats', [TeacherController::class, 'stats'])->name('teachers.stats');
});

// Auth routes (Breeze)
require __DIR__ . '/auth.php';
