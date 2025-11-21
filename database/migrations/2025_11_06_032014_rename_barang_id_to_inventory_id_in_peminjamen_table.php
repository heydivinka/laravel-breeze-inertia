<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('peminjamen') && Schema::hasColumn('peminjamen', 'barang_id')) {
            Schema::table('peminjamen', function (Blueprint $table) {
                $table->renameColumn('barang_id', 'inventory_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('peminjamen') && Schema::hasColumn('peminjamen', 'inventory_id')) {
            Schema::table('peminjamen', function (Blueprint $table) {
                $table->renameColumn('inventory_id', 'barang_id');
            });
        }
    }
};
