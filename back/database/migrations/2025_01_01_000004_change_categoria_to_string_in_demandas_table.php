<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Using raw SQL to avoid doctrine/dbal dependency for enum modification
        DB::statement("ALTER TABLE demandas MODIFY COLUMN categoria VARCHAR(255)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting is tricky without knowing exact original state efficiently, 
        // but we can try to set it back to enum if needed, or just leave it as string.
        // For now, we leave it as string or try to restore strict enum.
        // DB::statement("ALTER TABLE demandas MODIFY COLUMN categoria ENUM('Segurança Pública', 'Defesa do Consumidor', 'Mobilidade', 'Legislação Participativa')");
    }
};
