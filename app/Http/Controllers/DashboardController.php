<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Tampilkan dashboard berdasarkan role user.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Ambil user yang sedang login
        $user = auth()->user();

        // Jika role admin, tampilkan halaman DashboardAdmin
        if ($user->role === 'admin') {
            return Inertia::render('DashboardAdmin', [
                'user' => $user,
            ]);
        }

        // Jika role selain admin (default user), tampilkan DashboardUser
        return Inertia::render('DashboardUser', [
            'user' => $user,
        ]);
    }
}
