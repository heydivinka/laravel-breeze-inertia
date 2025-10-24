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

    public function category()
    {
        return $this->belongsTo(category::class, 'category_id');
    }
}
