<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$demanda = \App\Models\Demanda::latest()->first();
if ($demanda) {
    echo "ID: " . $demanda->id . "\n";
    echo "Assunto: " . $demanda->assunto . "\n";
    echo "Descrição:\n";
    echo $demanda->descricao . "\n";
} else {
    echo "Nenhuma demanda encontrada\n";
}
