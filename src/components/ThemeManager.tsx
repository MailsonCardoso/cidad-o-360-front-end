import { useEffect } from 'react';
import { themeService } from '@/services/themeService';
import { useQuery } from '@tanstack/react-query';

// Helper to convert HEX to HSL format (H S% L% as space separated values for Tailwind)
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

const ThemeManager = () => {
    const { data: theme } = useQuery({
        queryKey: ['globalTheme'],
        queryFn: themeService.getTheme,
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        if (theme) {
            const root = document.documentElement;

            // We set the values as space-separated HSL values because
            // the index.css uses hsl(var(--variable))

            try {
                if (theme.theme_primary_color) {
                    root.style.setProperty('--primary', hexToHSLForTailwind(theme.theme_primary_color));
                }
                if (theme.theme_secondary_color) {
                    root.style.setProperty('--secondary', hexToHSLForTailwind(theme.theme_secondary_color));
                }
                if (theme.theme_accent_color) {
                    root.style.setProperty('--accent', hexToHSLForTailwind(theme.theme_accent_color));
                }
                if (theme.theme_background_color) {
                    root.style.setProperty('--background', hexToHSLForTailwind(theme.theme_background_color));
                }
                if (theme.theme_sidebar_color) {
                    root.style.setProperty('--sidebar-background', hexToHSLForTailwind(theme.theme_sidebar_color));
                }
            } catch (err) {
                console.error("Erro ao aplicar cores do tema:", err);
            }
        }
    }, [theme]);

    return null;
};

export default ThemeManager;
