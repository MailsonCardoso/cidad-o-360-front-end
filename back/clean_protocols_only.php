<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Limpando APENAS Protocolos (Demandas)...\n\n";

\Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');

$historyCount = \App\Models\DemandaHistorico::count();
\App\Models\DemandaHistorico::truncate();
echo "✓ Removidos {$historyCount} registros de histórico\n";

$demandasCount = \App\Models\Demanda::count();
\App\Models\Demanda::truncate();
echo "✓ Removidas {$demandasCount} demandas\n";

\Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo "\n✅ Protocolos limpos com sucesso! Usuários e Comunicados foram mantidos.\n";
