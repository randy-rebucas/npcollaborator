'use client';

import { logtoConfig } from '@/app/logto';
import { signIn, signOut } from '@logto/next/server-actions';

import React, { createContext, useCallback, useState } from 'react';

/**
 * Properties representing user claims from authentication
 * @interface ClaimProps
 */
export type ClaimProps = {
    /** Unique identifier for the user */
    sub?: string;
    /** Full name of the user */
    name?: string;
    /** Username of the user */
    username?: string;
    /** Email of the user */
    email?: string;
    /** URL to the user's profile picture */
    avatar?: string;
    /** Timestamp of when the user was created */
    created_at?: string;
    /** Custom data from the user */
    customData?: {
        role?: string;
        [key: string]: string | number | boolean | undefined;
    };
}

/**
 * Context type for managing authentication session state
 * @interface SessionContextType
 */
type SessionContextType = {
    /** Indicates if the user is currently authenticated */
    isAuthenticated: boolean;
    /** Indicates if an authentication operation is in progress */
    isLoading: boolean;
    /** User claims from the authentication provider */
    claims: ClaimProps;
    /** Function to initiate the sign-in process */
    signIn: () => Promise<void>;
    /** Function to initiate the sign-out process */
    signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Hook to access the session context
 * @throws {Error} If used outside of LogtoProvider
 * @returns {SessionContextType} The session context value
 */
export function useSession() {
    const context = React.useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a LogtoProvider');
    }
    return context;
}

/**
 * Provider component for managing authentication state
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.isAuthenticated - Initial authentication state
 * @param {Object} props.claims - User claims from authentication
 * @returns {JSX.Element} Provider component with authentication context
 */
export function LogtoProvider({
    children,
    isAuthenticated,
    claims
}: {
    children: React.ReactNode;
    isAuthenticated: boolean;
    claims: ClaimProps
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [sessionData, setSessionData] = useState<Omit<SessionContextType, 'isLoading' | 'signIn' | 'signOut'>>({
        isAuthenticated,
        claims,
    });

    const handleSignIn = useCallback(async () => {
        setIsLoading(true);
        try {
            await signIn(logtoConfig);
            setSessionData({ isAuthenticated, claims });
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, claims]);

    const handleSignOut = useCallback(async () => {
        setIsLoading(true);
        try {
            await signOut(logtoConfig);
            setSessionData({ isAuthenticated: false, claims: {} });
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const contextValue = {
        ...sessionData,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
    };

    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    );
}

