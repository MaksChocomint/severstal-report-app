// components/auth/ReporterGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

interface ReporterGuardProps {
  children: React.ReactNode;
}

export default function ReporterGuard({ children }: ReporterGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/reports/new");
    } else if (status === "authenticated") {
      const userRole = (session.user as any)?.role;

      if (userRole !== "REPORTER") {
        router.push("/reports");
      }
    }
  }, [status, session, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (session && (session.user as any)?.role !== "REPORTER")
  ) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <LoadingSpinner />
        <p className="text-gray-600 ml-4">Проверяем доступ...</p>
      </div>
    );
  }

  return <>{children}</>;
}
