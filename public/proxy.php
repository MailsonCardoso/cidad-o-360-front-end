<?php
// Proxy API requests to backend
$backendUrl = 'https://api6.platformx.com.br';
$path = $_SERVER['REQUEST_URI'];

// Only proxy /api/ requests
if (strpos($path, '/api/') !== 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$targetUrl = $backendUrl . $path;

$ch = curl_init($targetUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
    ],
]);

// Forward headers from the original request
$forwardHeaders = ['Authorization', 'X-Requested-With'];
foreach ($forwardHeaders as $header) {
    $value = $_SERVER['HTTP_' . strtoupper(str_replace('-', '_', $header))] ?? '';
    if ($value) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(
            curl_getinfo($ch, CURLOPT_HTTPHEADER) ?: [],
            ["$header: $value"]
        ));
    }
}

// Forward request method and body
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
} elseif ($method === 'DELETE') {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
} elseif ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => $error]);
    exit;
}

http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
