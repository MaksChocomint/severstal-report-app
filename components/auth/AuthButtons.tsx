// components/AuthButtons.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse shadow-sm"></div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session ? (
        // User is logged in
        <>
          {session.user?.name && (
            <span className="text-sm font-medium text-gray-700">
              Привет, {session.user.name}
            </span>
          )}
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Выйти
          </button>
        </>
      ) : (
        // User is logged out
        <>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Регистрация
          </Link>
        </>
      )}
    </div>
  );
}
