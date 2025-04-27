"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useSession } from "@/providers/logto-session-provider";
import { getUserCustomData } from "@/app/actions/user";

function LogtoClaimsCheck({ children }: { children: React.ReactNode }) {
    const { claims } = useSession();
    const router = useRouter();

    const fetchUser = useCallback(async (userId: string) => {
        try {
            const response = await getUserCustomData(userId);
            console.log(response);
            // Handle users without roles
            if (!response.role && !Object.prototype.hasOwnProperty.call(response, "role")) {
                console.log("Redirecting to onboarding");
                router.push("/onboarding");
            }

            // Handle users with roles
            if (response.role && response.role === "physician") {
                console.log("Redirecting to main page");
                router.push("/np/main");
            } else if (response.role && response.role === "nurse-practitioner") {
                console.log("Redirecting to find-match page");
                router.push("/np/find-match");
            } else if (response.role && response.role === "admin") {
                console.log("Redirecting to admin page");
                router.push("/admin");
            } else {
                console.log("Redirecting to home page");
                router.push("/");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [router]);

    useEffect(() => {
        if (claims?.sub) {
            fetchUser(claims.sub);
        }
    }, [claims?.sub, fetchUser]);

    return <>{children}</>;
}

export function ClaimProvider({ children }: { children: React.ReactNode }) {
    return (
        <LogtoClaimsCheck>{children}</LogtoClaimsCheck>
    );
} 