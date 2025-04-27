'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type FontSizeContextType = {
    fontSize: string;
    setFontSize: (size: string) => void;
};

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState('normal');

    useEffect(() => {
        // Load saved font size from localStorage
        const savedSize = localStorage.getItem('fontSize') || 'normal';
        setFontSize(savedSize);
        document.documentElement.dataset.fontSize = savedSize;
    }, []);

    const handleSetFontSize = (size: string) => {
        setFontSize(size);
        localStorage.setItem('fontSize', size);
        document.documentElement.dataset.fontSize = size;
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, setFontSize: handleSetFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
}

export function useFontSize() {
    const context = useContext(FontSizeContext);
    if (context === undefined) {
        throw new Error('useFontSize must be used within a FontSizeProvider');
    }
    return context;
}