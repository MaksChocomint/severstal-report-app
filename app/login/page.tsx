// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react

export default function LoginPage() {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      // Use NextAuth.js signIn function
      const result = await signIn("credentials", {
        redirect: false, // Prevent default redirect, we'll handle it manually
        identifier: nameOrEmail,
        password,
      });

      if (result?.error) {
        // If signIn returns an error (e.g., from your Credentials provider)
        setError(result.error);
      } else {
        // Successful login, redirect to home page
        router.push("/");
      }
    } catch (err) {
      console.error("Login process error:", err);
      // This catch block would primarily catch network errors before the signIn call
      setError("Произошла ошибка сети. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full py-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Войти</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="nameOrEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Имя пользователя или Email
            </label>
            <input
              id="nameOrEmail"
              name="nameOrEmail"
              type="text"
              value={nameOrEmail}
              onChange={(e) => setNameOrEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Еще нет аккаунта?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
