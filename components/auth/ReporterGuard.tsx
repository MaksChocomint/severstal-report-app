// components/auth/ReporterGuard.tsx
"use client"; // This component uses hooks, so it must be a client component

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner"; // Optional: Create a simple loading spinner

interface ReporterGuardProps {
  children: React.ReactNode;
}

export default function ReporterGuard({ children }: ReporterGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only run this effect once the session status is no longer "loading"
    if (status === "loading") return;

    // If the user is not authenticated, redirect to login or reports
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/reports/new"); // Redirect to login, include callbackUrl
      // Or if you prefer to redirect unauthenticated users directly to reports page:
      // router.push("/reports");
    }
    // If authenticated, check the user's role
    else if (status === "authenticated") {
      // Make sure your user object has a 'role' property.
      // This 'role' property must be added in your NextAuth.js callbacks (jwt and session).
      const userRole = (session.user as any)?.role; // Cast to 'any' or extend Session type if not already

      if (userRole !== "REPORTER") {
        router.push("/reports"); // Redirect to /reports if not a REPORTER
      }
    }
  }, [status, session, router]); // Re-run effect when status, session, or router changes

  // While loading or if the user is not authorized, show a loading spinner or null
  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (session && (session.user as any)?.role !== "REPORTER")
  ) {
    // You can display a loading spinner, a message, or nothing (null)
    // while the check is being performed or if they are being redirected.
    return (
      <div className="flex justify-center items-center h-full py-20">
        <LoadingSpinner /> {/* Placeholder for a loading spinner */}
        <p className="text-gray-600 ml-4">Проверяем доступ...</p>
      </div>
    );
  }

  // If authenticated AND is a REPORTER, render the children (the protected content)
  return <>{children}</>;
}
