<?php
$url = 'http://127.0.0.1:8000/api/login';
$data = [
    'email' => 'admin@admin.com',
    'password' => 'admin@!23'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
} else {
    echo "HTTP Code: $httpCode\n";
    echo "Response: $response\n";
}
curl_close($ch);
