"use client";

// import { useSession } from "@/providers/logto-session-provider";
// import { redirect } from "next/navigation";
// import { useEffect } from "react";

export default function AttestationsLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  // const { claims } = useSession();

  // useEffect(() => {
  //   const getUserSubmissionStatus = async (id: string) => {
  //     const response = await fetch(`/api/user/${id}/submission-status`);
  //     const data = await response.json();
  //     if (data.submissionStatus !== 'APPROVED') {
  //       redirect("/not-authorized");
  //     }
  //   }
  //   if (claims?.sub) {
  //     getUserSubmissionStatus(claims.sub);
  //   }
  // }, [claims?.sub]);

  return (
    <div className="min-h-screen w-full bg-background">
      {children}
      {modal}
    </div>
  );
}