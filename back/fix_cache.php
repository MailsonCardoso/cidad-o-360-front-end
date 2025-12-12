<?php
$cacheDir = __DIR__ . '/bootstrap/cache';

echo "Fixing $cacheDir...\n";

if (is_dir($cacheDir)) {
    echo "Directory exists. Deleting contents...\n";
    $files = glob($cacheDir . '/*');
    foreach ($files as $file) {
        if (is_file($file))
            unlink($file);
    }
    // Try to remove dir to be sure
    if (rmdir($cacheDir)) {
        echo "Directory removed.\n";
    } else {
        echo "Could not remove directory. Check permissions.\n";
    }
}

if (!is_dir($cacheDir)) {
    if (mkdir($cacheDir, 0777, true)) {
        echo "Directory created.\n";
    } else {
        echo "Failed to create directory.\n";
        exit(1);
    }
}

// Create .gitignore
file_put_contents($cacheDir . '/.gitignore', "*\n!.gitignore\n");
echo "Fix complete.\n";
