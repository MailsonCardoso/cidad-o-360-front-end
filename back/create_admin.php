<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Criando usuário administrador...\n\n";

// Check if admin exists
$admin = \App\Models\User::where('email', 'admin@admin.com')->first();

if ($admin) {
    // Update existing admin
    $admin->password = \Illuminate\Support\Facades\Hash::make('admin@!23');
    $admin->role = 'admin';
    $admin->save();
    echo "✓ Usuário admin atualizado\n";
} else {
    // Create new admin
    $admin = \App\Models\User::create([
        'name' => 'Administrador',
        'email' => 'admin@admin.com',
        'password' => \Illuminate\Support\Facades\Hash::make('admin@!23'),
        'role' => 'admin',
        'is_security_agent' => false,
        'setor' => null,
    ]);
    echo "✓ Usuário admin criado\n";
}

echo "\n✅ Credenciais de acesso:\n";
echo "  Email: admin@admin.com\n";
echo "  Senha: admin@!23\n";
echo "  Role: admin\n";
