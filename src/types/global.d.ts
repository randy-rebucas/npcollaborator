interface CalendlyWidgetOptions {
    url: string;
}

interface CalendlyInlineOptions {
    url: string;
    elementId?: string;
}

declare global {
    const Calendly: {
        initPopupWidget: (options: CalendlyWidgetOptions) => void;
        initInlineWidget: (options: CalendlyInlineOptions) => void;
        showPopupWidget: (url: string) => void;
    } | undefined;
}

export {}; 