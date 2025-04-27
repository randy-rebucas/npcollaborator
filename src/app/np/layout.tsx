import { ClaimProps } from "@/providers/logto-session-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LogtoProvider } from "@/providers/logto-session-provider";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";
import { AppSidebar } from "@/components/AppSidebar";

export default async function NPLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, {
    fetchUserInfo: true
  });

  return (
    <LogtoProvider
      isAuthenticated={isAuthenticated}
      claims={claims as ClaimProps}
    >
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </LogtoProvider>
  );
}

