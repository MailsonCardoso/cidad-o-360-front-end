<?php
// Function to parse .env file
function loadEnv($path)
{
    if (!file_exists($path)) {
        throw new Exception(".env file not found");
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        // Remove quotes if present
        if (preg_match('/^"(.*)"$/', $value, $matches)) {
            $value = $matches[1];
        }
        $env[$name] = $value;
    }
    return $env;
}

try {
    echo "Loading .env...\n";
    $env = loadEnv(__DIR__ . '/.env');

    $host = $env['DB_HOST'] ?? '127.0.0.1';
    $port = $env['DB_PORT'] ?? '3306';
    $database = $env['DB_DATABASE'] ?? 'forge';
    $username = $env['DB_USERNAME'] ?? 'forge';
    $password = $env['DB_PASSWORD'] ?? '';

    echo "Configuration:\n";
    echo "Host: $host\n";
    echo "Port: $port\n";
    echo "Database: $database\n";
    echo "Username: $username\n";
    echo "Password: " . (strlen($password) > 0 ? '********' : '(empty)') . "\n";

    echo "\nTesting PDO Connection...\n";

    $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5,
    ];

    $pdo = new PDO($dsn, $username, $password, $options);

    echo "✅ Connection Success!\n";

    // Try a simple query
    $stmt = $pdo->query("SELECT count(*) as count FROM users");
    $row = $stmt->fetch();
    echo "Users count: " . $row['count'] . "\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
