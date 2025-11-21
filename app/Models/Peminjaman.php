<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{

        
    use HasFactory;
    protected $table = 'peminjamen';
        
    protected $fillable = [
        'peminjam_id',
        'role',
        'inventory_id',
        'tanggal_pinjam',
        'tanggal_kembali',
        'keterangan',
        'added_by',
    ];

    /**
     * Relasi ke tabel Inventory
     * Satu peminjaman hanya memiliki satu inventory.
     */
    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'inventory_id');
    }

        public function peminjam()
    {
        return $this->belongsTo(User::class, 'peminjam_id');
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

}
