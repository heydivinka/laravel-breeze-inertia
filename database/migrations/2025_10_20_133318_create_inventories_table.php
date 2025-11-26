    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        /**
         * Run the migrations.
         */
        public function up(): void
        {
            Schema::create('inventories', function (Blueprint $table) {
                $table->id();
                $table->string('kode_barang')->unique(); // barcode / product code
                $table->string('nama_barang');
                // $table->unsignedBigInteger('category_id')->nullable();
                $table->integer('jumlah')->default(value: 0);
                $table->text('deskripsi')->nullable();
                $table->string('status')->nullable();
                $table->string('lokasi_barang')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                // foreign key (if categories table exists)
                $table->foreign('category_id')
                    ->references('id')
                    ->on('categories')
                    ->onDelete('set null');
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('inventories');
        }
    };
