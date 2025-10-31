<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'category_id',
        'jumlah',
        'deskripsi',
        'status',
        'lokasi_barang',
        'is_active',
    ];

    protected $attributes = [
    'status' => 'tersedia',
];

    protected $casts = [
        'is_active' => 'boolean',
        'jumlah' => 'integer',
    ];

    public function category()
    {
        // FIX: use proper case for Category class
        return $this->belongsTo(\App\Models\Category::class, 'category_id');
    }
}
