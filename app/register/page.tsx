// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios"; // Import axios

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (res.status === 201) {
        router.push("/login?registered=true");
      } else {
        setError(res.data.message || "Ошибка регистрации. Попробуйте еще раз.");
      }
    } catch (err) {
      console.error("Registration error:", err);

      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "Ошибка регистрации. Попробуйте еще раз."
        );
      } else {
        setError(
          "Произошла ошибка сети или непредвиденная ошибка. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full py-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Зарегистрироваться
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Имя пользователя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
