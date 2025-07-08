// utils/theme.js
export const colors = {
    primary: '#D32F2F',      // a strong red
    background: '#fff',
    surface: '#fafafa',
    text: '#000',
    accent: '#000',          // black accents
    error: '#B00020',
};

export const paperTheme = {
    dark: false,
    roundness: 8,
    colors: {
        ...colors,
        primary: colors.primary,
        accent: colors.accent,
        background: colors.background,
        surface: colors.surface,
        error: colors.error,
        text: colors.text,
        placeholder: '#999',
        disabled: '#DDD',
    },
};
