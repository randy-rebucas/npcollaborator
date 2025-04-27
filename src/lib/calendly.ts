declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: CalendlyWidgetOptions) => void;
            initInlineWidget: (options: CalendlyInlineOptions) => void;
            showPopupWidget: (url: string) => void;
        };
    }
}

interface CalendlyWidgetOptions {
    url: string;
    prefill?: {
        name?: string;
        email?: string;
        customAnswers?: {
            [key: string]: string;
        };
    };
    utm?: {
        utmCampaign?: string;
        utmSource?: string;
        utmMedium?: string;
        utmContent?: string;
        utmTerm?: string;
    };
}

interface CalendlyInlineOptions extends CalendlyWidgetOptions {
    parentElement: HTMLElement;
}

export const loadCalendlyScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            // Check if script is already loaded
            if (window.Calendly) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Calendly widget script'));
            document.body.appendChild(script);

            const link = document.createElement('link');
            link.href = 'https://assets.calendly.com/assets/external/widget.css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        } catch (error) {
            reject(error instanceof Error ? error : new Error('Failed to initialize Calendly'));
        }
    });
};

export const openCalendlyPopup = async (
    url: string, 
    prefill?: CalendlyWidgetOptions['prefill']
): Promise<void> => {
    try {
        await loadCalendlyScript();
        
        if (!window.Calendly) {
            throw new Error('Calendly widget not initialized');
        }

        window.Calendly.initPopupWidget({
            url,
            prefill
        });
    } catch (error) {
        console.error('Error opening Calendly popup:', error);
        throw error instanceof Error ? error : new Error('Failed to open Calendly popup');
    }
};

export const initInlineCalendly = async (
    parentElement: HTMLElement,
    url: string,
    prefill?: CalendlyWidgetOptions['prefill']
): Promise<void> => {
    try {
        await loadCalendlyScript();
        
        if (!window.Calendly) {
            throw new Error('Calendly widget not initialized');
        }

        window.Calendly.initInlineWidget({
            parentElement,
            url,
            prefill
        });
    } catch (error) {
        console.error('Error initializing inline Calendly:', error);
        throw error instanceof Error ? error : new Error('Failed to initialize inline Calendly');
    }
}; 

