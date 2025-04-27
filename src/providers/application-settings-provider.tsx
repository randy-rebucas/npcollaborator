'use client';

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ApplicationSettings = {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;
  appVersion: string;
};

type ApplicationSettingsContextType = {
  settings: ApplicationSettings;
  isLoading: boolean;
  error: Error | null;
  refreshSettings: () => Promise<void>;
};

const ApplicationSettingsContext = createContext<ApplicationSettingsContextType | undefined>(undefined);

export function ApplicationSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ApplicationSettings>({
    siteName: "",
    siteDescription: "",
    siteUrl: "",
    siteLogo: "",
    siteFavicon: "",
    appVersion: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Type guard function
  const isValidApplicationSettings = (data: unknown): data is ApplicationSettings => {
    return (
      typeof data === "object" &&
      data !== null &&
      typeof (data as Record<string, unknown>).siteName === "string" &&
      typeof (data as Record<string, unknown>).siteDescription === "string" &&
      typeof (data as Record<string, unknown>).siteUrl === "string" &&
      typeof (data as Record<string, unknown>).siteLogo === "string" &&
      typeof (data as Record<string, unknown>).siteFavicon === "string" &&
      typeof (data as Record<string, unknown>).appVersion === "string"
    );
  };

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/config");
      if (!res.ok) {
        throw new Error(`Failed to fetch settings: ${res.statusText}`);
      }
      const data = await res.json();
      if (isValidApplicationSettings(data)) {
        setSettings(data);
      } else {
        throw new Error("Invalid settings data received from API");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <ApplicationSettingsContext.Provider value={{ settings, isLoading, error, refreshSettings: fetchSettings }}>
      {children}
    </ApplicationSettingsContext.Provider>
  );
}

export function useApplicationSettings() {
  const context = useContext(ApplicationSettingsContext);
  if (context === undefined) {
    throw new Error("useApplicationSettings must be used within an ApplicationSettingsProvider");
  }
  return context;
} 