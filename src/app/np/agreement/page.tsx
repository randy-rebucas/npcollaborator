"use client";

import Script from "next/script";
import AppHeader from '@/components/AppHeader';
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/providers/logto-session-provider";
import { getUser } from "@/app/actions/user";
import { Certification } from "@/types/onboarding";
import { License } from "@/models/User";

export default function AgreementPage() {
    const jotformId = process.env.NEXT_PUBLIC_JOTFORM_ID;
    const [jotformUrl, setJotformUrl] = useState(`https://form.jotform.com/${jotformId}`);
    const [formFilled, setFormFilled] = useState(false);
    const { claims } = useSession();

    // Improve iframe handling
    useEffect(() => {
        const handleIframeResize = () => {
            const iframe = document.getElementById(`JotFormIFrame-${jotformId}`);
            if (iframe) {
                iframe.style.height = '100vh';
                iframe.style.minHeight = '100vh';
                iframe.style.maxHeight = '100vh';
            }
        };

        window.addEventListener('load', handleIframeResize);
        
        return () => {
            window.removeEventListener('load', handleIframeResize);
        };
    }, [jotformId]);

    const fillJotformFields = useCallback((data: Record<string, string | number | string[]>) => {
        if (formFilled) return;

        const prefilledUrl = new URL(`https://form.jotform.com/${jotformId}`);
        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                prefilledUrl.searchParams.append(key, String(value));
            }
        });

        setJotformUrl(prefilledUrl.toString());
        setFormFilled(true);
    }, [jotformId, formFilled]);

    const checkMemberstackAlternative = useCallback(async () => {
        if (!claims?.sub) {
            console.warn('User is not logged in');
            return;
        }

        try {
            const userInfo = await getUser(claims.sub);

            if (!userInfo) {
                console.warn('User is not logged in or data is missing.');
                return;
            }
 
            const userData = {
                'first-name': userInfo.profile?.givenName || '',
                'last-name': userInfo.profile?.familyName || '',
                'email': userInfo.primaryEmail || '',
                'member_id': userInfo.id || '',
                'npi': userInfo.customData?.npiNumber || '', 
                'base-rate': userInfo.customData?.rateMatrix?.monthlyCollaborationRate || '',
                'state-fee': userInfo.customData?.rateMatrix?.additionalStateFee || '',
                'background': userInfo.customData?.description || '',
                'control-fee': userInfo.customData?.rateMatrix?.controlledSubstancesMonthlyFee || '',
                'degree-type': typeof userInfo.customData?.education === 'string' 
                    ? userInfo.customData.education 
                    : Object.values(userInfo.customData?.education || {}).filter(Boolean).join(', '),
                'linkedin-url': userInfo.customData?.linkedinProfile || '',
                'multi-np-fee': userInfo.customData?.rateMatrix?.additionalNPFee || '',
                'practice-types': userInfo.customData?.practiceTypes || '',
                'id-document-url': userInfo.customData?.governmentIdPath || '',
                'board-certification': userInfo.customData?.backgroundCertification?.boardCertification || '',
                'active-license-states': userInfo.customData?.licenseAndCertification?.medicalLicenseStates?.map((l: License) => l.state) || [],
                'additional-certification': userInfo.customData?.backgroundCertification?.additionalCertifications?.map((c: Certification) => c.certification) || [],
                'address': userInfo.profile?.address?.formatted || '',
                'city': userInfo.profile?.address?.locality || '',
                'state': userInfo.profile?.address?.region || '',
                'zip': userInfo.profile?.address?.postalCode || '',
            };
            
            fillJotformFields(userData);
        } catch (error) {
            console.error('Error getting current member:', error);
        }
    }, [fillJotformFields, claims?.sub]);

    // Initial check
    useEffect(() => {
        const handleLoad = () => {
            if (!formFilled) {
                checkMemberstackAlternative();
            }
        };

        checkMemberstackAlternative();
        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, [checkMemberstackAlternative, formFilled]);

    // Periodic check
    useEffect(() => {
        if (formFilled) return;

        const maxAttempts = 10;
        let attempts = 0;

        const checkInterval = setInterval(() => {
            attempts++;
            if (!formFilled) {
                checkMemberstackAlternative();
            }
            if (attempts >= maxAttempts || formFilled) {
                clearInterval(checkInterval);
            }
        }, 1000);

        return () => {
            clearInterval(checkInterval);
        };
    }, [formFilled, checkMemberstackAlternative]);

    return (
        <div className="bg-background min-h-screen w-full">
            <Script 
                src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js" 
                strategy="beforeInteractive"
            />
            <AppHeader />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8 p-8">
                    <div 
                        id="JotFormEmbedContainer" 
                        className="w-full h-full bg-card rounded-lg border border-border" 
                        style={{ height: "100vh", overflow: "hidden" }}
                    >
                        <iframe
                            id={`JotFormIFrame-${jotformId}`}
                            title="Contract Form"
                            onLoad={() => window.parent.scrollTo(0, 0)}
                            allowTransparency={true}
                            allowFullScreen={true}
                            allow="geolocation; microphone; camera"
                            src={jotformUrl}
                            style={{
                                minWidth: "100%",
                                maxWidth: "100%",
                                height: "100vh",
                                border: "none"
                            }}
                            scrolling="yes"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

