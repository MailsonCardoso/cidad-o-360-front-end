<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get all demands and fix the description format
$demandas = \App\Models\Demanda::all();

foreach ($demandas as $demanda) {
    $desc = $demanda->descricao;

    // Check if description contains the contact section
    if (strpos($desc, '--- DADOS DE CONTATO DO SOLICITANTE ---') !== false) {
        // Extract the main description and contact info
        $parts = explode('--- DADOS DE CONTATO DO SOLICITANTE ---', $desc);

        if (count($parts) == 2) {
            $mainDesc = trim($parts[0]);
            $contactInfo = trim($parts[1]);

            // Rebuild with proper formatting
            $newDesc = $mainDesc . "\n\n--- DADOS DE CONTATO DO SOLICITANTE ---\n" . $contactInfo;

            $demanda->descricao = $newDesc;
            $demanda->save();

            echo "Fixed demanda ID: {$demanda->id}\n";
        }
    }
}

echo "Done!\n";
