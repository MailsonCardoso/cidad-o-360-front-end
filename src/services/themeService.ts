import api from './api';

export interface ThemeSettings {
  theme_primary_color: string;
  theme_secondary_color: string;
  theme_accent_color: string;
  theme_background_color: string;
  theme_sidebar_color: string;
}

export const themeService = {
  getTheme: async (): Promise<ThemeSettings> => {
    const response = await api.get('/theme');
    return response.data;
  },

  updateTheme: async (settings: ThemeSettings): Promise<void> => {
    await api.put('/theme', settings);
  }
};
