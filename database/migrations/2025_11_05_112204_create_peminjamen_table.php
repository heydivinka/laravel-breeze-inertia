<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peminjamen', function (Blueprint $table) {
            $table->id();
            $table->string('peminjam_id');   // NIS/NIP
            $table->string('role');           // murid/guru
            $table->foreignId('inventory_id')->constrained('inventories'); // relasi ke inventories
            $table->date('tanggal_pinjam');
            $table->date('tanggal_kembali');
            $table->string('keterangan')->nullable();
            $table->string('added_by');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peminjamen');
    }
};
