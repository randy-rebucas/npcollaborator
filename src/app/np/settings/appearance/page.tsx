'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useFontSize } from '@/providers/font-provider';


export default function AppearancePage() {
    const { theme, setTheme } = useTheme();
    const { fontSize, setFontSize } = useFontSize();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        theme: 'system',
        fontSize: 'normal',
        reducedMotion: false
    });

    // Hydration fix
    useEffect(() => {
        setMounted(true);
        setFormData(prev => ({ 
            ...prev, 
            theme: theme || 'system',
            fontSize: fontSize
        }));
    }, [theme, fontSize]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setTheme(formData.theme);
        setFontSize(formData.fontSize);
        console.log('Saving settings:', formData);
    };

    if (!mounted) {
        return null; // Avoid hydration mismatch
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <form onSubmit={handleSubmit} className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
                {/* Theme Selection */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Theme</h2>
                    <div className="space-y-2">
                        {['light', 'dark', 'system'].map((option) => (
                            <label key={option} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="theme"
                                    value={option}
                                    checked={formData.theme === option}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                                />
                                <span className="capitalize text-foreground">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Font Size */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Font Size</h2>
                    <div className="space-y-2">
                        {['small', 'normal', 'large'].map((size) => (
                            <label key={size} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="fontSize"
                                    value={size}
                                    checked={formData.fontSize === size}
                                    onChange={(e) => setFormData({ ...formData, fontSize: e.target.value })}
                                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                                />
                                <span className="capitalize text-foreground">{size}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold 
                                 py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
