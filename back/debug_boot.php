<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Starting boot debug...\n";

try {
    require __DIR__ . '/vendor/autoload.php';
    echo "Autoloader loaded.\n";

    $app = require_once __DIR__ . '/bootstrap/app.php';
    echo "App instance created.\n";

    $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
    echo "Kernel bootstrapped successfully.\n";

} catch (\Throwable $e) {
    $log = "BOOT ERROR:\n";
    $log .= $e->getMessage() . "\n";
    $log .= $e->getTraceAsString() . "\n";
    file_put_contents(__DIR__ . '/boot_error.log', $log);
    echo "Error logged to boot_error.log\n";
}
