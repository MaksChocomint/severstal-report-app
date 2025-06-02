// app/page.tsx
"use client";
import Link from "next/link";
import { FaFileAlt } from "react-icons/fa"; // Using react-icons

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
      <section className="text-center py-16 md:py-24 bg-slate-800 rounded-xl text-white shadow-2xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Система учета промковшей
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Автоматизированное ведение документации сталелитейного производства
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link
              href="/reports/new"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto"
            >
              Создать новый отчет
            </Link>
            <Link
              href="/reports"
              className="inline-block bg-transparent border-2 border-blue-400 text-blue-300 px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-400 hover:text-white transition-colors duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              Просмотреть отчеты
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Последние отчеты
          </h2>
          <Link
            href="/reports"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors group text-sm sm:text-base"
          >
            Все отчеты{" "}
            <span className="group-hover:ml-1 transition-all">&rarr;</span>
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-10 sm:p-12 text-center text-slate-500">
            <FaFileAlt className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-lg">
              Список последних отчетов будет отображаться здесь.
            </p>
            <p className="text-sm mt-1">Данные скоро появятся.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
