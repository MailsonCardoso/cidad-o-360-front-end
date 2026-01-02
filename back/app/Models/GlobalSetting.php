<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalSetting extends Model
{
    protected $table = 'global_settings';
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get setting by key.
     */
    public static function get(string $key, $default = null)
    {
        $setting = self::find($key);
        return $setting ? $setting->value : $default;
    }

    /**
     * Set setting by key.
     */
    public static function set(string $key, $value)
    {
        return self::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
