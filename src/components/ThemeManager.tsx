import { useEffect } from 'react';
import { themeService } from '@/services/themeService';
import { useQuery } from '@tanstack/react-query';

const hexToHSLForTailwind = (hex: string): string => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const isValidTheme = (data: unknown): data is Record<string, string> => {
    if (!data || typeof data !== 'object') return false;
    const keys = ['theme_primary_color', 'theme_secondary_color', 'theme_accent_color', 'theme_background_color', 'theme_sidebar_color'];
    return keys.every(k => k in (data as Record<string, unknown>));
};

const applyTheme = (theme: Record<string, string>) => {
    const root = document.documentElement;
    const colors: Record<string, string> = {
        '--primary': theme.theme_primary_color,
        '--secondary': theme.theme_secondary_color,
        '--accent': theme.theme_accent_color,
        '--background': theme.theme_background_color,
        '--sidebar-background': theme.theme_sidebar_color,
        '--sidebar-foreground': '0 0% 100%',
    };
    Object.entries(colors).forEach(([key, value]) => {
        if (value && value.startsWith('#')) {
            root.style.setProperty(key, hexToHSLForTailwind(value));
        } else if (value) {
            root.style.setProperty(key, value);
        }
    });
};

const ThemeManager = () => {
    const { data: theme } = useQuery({
        queryKey: ['globalTheme'],
        queryFn: themeService.getTheme,
        staleTime: 1000 * 60 * 10,
        retry: 1,
    });

    useEffect(() => {
        if (isValidTheme(theme)) {
            try {
                applyTheme(theme);
            } catch (err) {
                console.error("Erro ao aplicar cores do tema:", err);
            }
        }
    }, [theme]);

    return null;
};

export default ThemeManager;
