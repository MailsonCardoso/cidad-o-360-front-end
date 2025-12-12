<?php
$dir = __DIR__ . '/bootstrap/cache';
echo "Checking $dir\n";
echo "Exists: " . (file_exists($dir) ? 'Yes' : 'No') . "\n";
echo "Is Dir: " . (is_dir($dir) ? 'Yes' : 'No') . "\n";
echo "Is Writable: " . (is_writable($dir) ? 'Yes' : 'No') . "\n";

// Try to write a file
$testFile = $dir . '/test_perm.txt';
@unlink($testFile);
if (file_put_contents($testFile, 'test')) {
    echo "Filesystem write: Success\n";
} else {
    echo "Filesystem write: Fail\n";
}

// Check if OneDrive is tampering
clearstatcache();
echo "Is Writable (cached): " . (is_writable($dir) ? 'Yes' : 'No') . "\n";
