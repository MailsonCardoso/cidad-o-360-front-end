<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$demanda = \App\Models\Demanda::where('categoria', 'Infraestrutura')->first();
if ($demanda) {
    echo "ID: " . $demanda->id . "\n";
    echo "Assunto: " . $demanda->assunto . "\n";
    echo "Descrição (primeiros 400 chars):\n";
    echo substr($demanda->descricao, 0, 400) . "\n";
} else {
    echo "Nenhuma demanda de Infraestrutura encontrada\n";
}
