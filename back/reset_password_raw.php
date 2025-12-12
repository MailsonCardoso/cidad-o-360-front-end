<?php
$host = '127.0.0.1';
$db = 'db_cidadao';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

echo "Attempting connection to $db at $host...\n";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Connected successfully to $db.\n";
} catch (\PDOException $e) {
    echo "Connection failed to $db: " . $e->getMessage() . "\n";
    // Try db_veiculo
    $db = 'db_veiculo';
    echo "Attempting connection to $db...\n";
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        echo "Connected successfully to $db.\n";
    } catch (\PDOException $e2) {
        // Try creating the database if logic allows, but better to die
        die("Connection failed to $db: " . $e2->getMessage());
    }
}

$email = 'admin@admin.com';
$newPassword = password_hash('admin@!23', PASSWORD_BCRYPT);
$role = 'admin';

echo "Checking for user $email...\n";
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$userData = $stmt->fetch();

if ($userData) {
    echo "User found. Updating password...\n";
    $stmt = $pdo->prepare("UPDATE users SET password = ?, role = ? WHERE email = ?");
    $stmt->execute([$newPassword, $role, $email]);
    echo "User updated.\n";
} else {
    echo "User not found. Creating...\n";
    // Need to handle other non-nullable fields if any. 
    // Assuming name, email, password are main ones. 
    // From User model: name, email, password, role, sector (nullable), is_security_agent
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute(['Administrador', $email, $newPassword, $role]);
    echo "User created.\n";
}
echo "Done.\n";
