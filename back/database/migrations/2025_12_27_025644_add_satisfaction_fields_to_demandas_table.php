<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('demandas', function (Blueprint $table) {
            $table->integer('satisfacao_nota')->nullable();
            $table->text('satisfacao_comentario')->nullable();
            $table->timestamp('satisfacao_data')->nullable();
            $table->string('cpf_solicitante')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('demandas', function (Blueprint $table) {
            $table->dropColumn(['satisfacao_nota', 'satisfacao_comentario', 'satisfacao_data', 'cpf_solicitante']);
        });
    }
};
