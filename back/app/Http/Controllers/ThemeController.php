<?php

namespace App\Http\Controllers;

use App\Models\GlobalSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ThemeController extends Controller
{
    /**
     * Get theme settings.
     */
    public function index()
    {
        // Cache theme for performance
        $theme = Cache::remember('global_theme', 3600, function () {
            $primary = GlobalSetting::get('theme_primary_color', '#3b82f6');
            $secondary = GlobalSetting::get('theme_secondary_color', '#1e40af');
            $accent = GlobalSetting::get('theme_accent_color', '#f59e0b');
            $background = GlobalSetting::get('theme_background_color', '#ffffff');
            $sidebar = GlobalSetting::get('theme_sidebar_color', '#1f2937');

            return [
                'theme_primary_color' => $primary,
                'theme_secondary_color' => $secondary,
                'theme_accent_color' => $accent,
                'theme_background_color' => $background,
                'theme_sidebar_color' => $sidebar,
            ];
        });

        return response()->json($theme);
    }

    /**
     * Update theme settings.
     */
    public function update(Request $request)
    {
        // Use array syntax for validation to avoid issues with regex and pipe delimiters
        $validated = $request->validate([
            'theme_primary_color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'theme_secondary_color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'theme_accent_color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'theme_background_color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'theme_sidebar_color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        foreach ($validated as $key => $value) {
            GlobalSetting::set($key, $value);
        }

        // Clear cache
        Cache::forget('global_theme');

        return response()->json(['message' => 'Tema atualizado com sucesso!']);
    }
}
