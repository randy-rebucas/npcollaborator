import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { ClaimProps, LogtoProvider } from "@/providers/logto-session-provider";
// import { logtoConfig } from "./logto";
// import { getLogtoContext } from "@logto/next/server-actions";
import { FontSizeProvider } from "@/providers/font-provider";
import { ApplicationSettingsProvider } from "@/providers/application-settings-provider";
import { ThemeProvider } from "@/providers/theme-provider";
// import { ClaimProvider } from "@/providers/claim-provider";
import { Toaster } from "@/components/ui/sonner"
import { getConfig } from "@/app/actions/config"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: {
      default: config?.siteName || process.env.NEXT_PUBLIC_APP_NAME,
      template: `%s | ${config?.siteName || process.env.NEXT_PUBLIC_APP_NAME}`,
    },
    description: config?.siteDescription || process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    keywords: config?.keywords || process.env.NEXT_PUBLIC_APP_KEYWORDS,
    authors: [
      {
        name: config?.author || process.env.NEXT_PUBLIC_APP_AUTHOR,
        url: config?.authorUrl || process.env.NEXT_PUBLIC_APP_AUTHOR_URL,
      },
    ],
    creator: config?.author || process.env.NEXT_PUBLIC_APP_AUTHOR,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: config?.siteUrl || process.env.NEXT_PUBLIC_APP_URL,
      title: config?.siteName || process.env.NEXT_PUBLIC_APP_NAME,
      description: config?.siteDescription || process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      siteName: config?.siteName || process.env.NEXT_PUBLIC_APP_NAME,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // let isAuthenticated = false;
  // let claims = null;

  // try {
  //   const logtoContext = await getLogtoContext(logtoConfig, {
  //     fetchUserInfo: true
  //   });
  //   isAuthenticated = logtoContext.isAuthenticated;
  //   claims = logtoContext.claims;
  // } catch (error) {
  //   console.error('Logto authentication error:', error);
  // }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FontSizeProvider>
            {/* <LogtoProvider
              isAuthenticated={isAuthenticated}
              claims={claims as ClaimProps}
            > */}
              <ApplicationSettingsProvider>
                {/* <ClaimProvider> */}
                  {children}
                {/* </ClaimProvider> */}
              </ApplicationSettingsProvider>
            {/* </LogtoProvider> */}
          </FontSizeProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
