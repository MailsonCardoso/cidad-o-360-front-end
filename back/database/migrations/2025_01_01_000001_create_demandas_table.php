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
        Schema::create('demandas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->enum('categoria', ['Segurança Pública', 'Defesa do Consumidor', 'Mobilidade', 'Legislação Participativa']);
            $table->string('assunto');
            $table->text('descricao');
            $table->string('arquivo')->nullable();
            $table->enum('status', ['Aberto', 'Em andamento', 'Concluído'])->default('Aberto');
            $table->string('protocolo')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandas');
    }
};
