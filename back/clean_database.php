<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Limpando dados de teste...\n\n";

// Disable foreign key checks
\Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');

// Delete all demand history
$historyCount = \App\Models\DemandaHistorico::count();
\App\Models\DemandaHistorico::truncate();
echo "✓ Removidos {$historyCount} registros de histórico\n";

// Delete all demands
$demandasCount = \App\Models\Demanda::count();
\App\Models\Demanda::truncate();
echo "✓ Removidas {$demandasCount} demandas\n";

// Delete all comunicados
$comunicadosCount = \App\Models\Comunicado::count();
\App\Models\Comunicado::truncate();
echo "✓ Removidos {$comunicadosCount} comunicados\n";

// Keep only admin user, delete others
$usersCount = \App\Models\User::where('email', '!=', 'admin@admin.com')->count();
\App\Models\User::where('email', '!=', 'admin@admin.com')->delete();
echo "✓ Removidos {$usersCount} usuários (mantido apenas admin)\n";

// Re-enable foreign key checks
\Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo "\n✅ Banco de dados limpo com sucesso!\n";
echo "\n📋 Sistema pronto para testes do zero\n";
echo "\nUsuário mantido:\n";
echo "  Email: admin@admin.com\n";
echo "  Senha: 123456\n";
echo "  Role: admin\n";
