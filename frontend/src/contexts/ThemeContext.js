import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    // Always use light theme (beige/purple design system)
    const [theme] = useState('light');

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('light');
        root.classList.remove('dark');
    }, []);

    // Keep toggleTheme as no-op for backwards compatibility
    const toggleTheme = useCallback(() => {}, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
