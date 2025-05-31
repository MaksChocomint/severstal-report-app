// components/ReportView.tsx
import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Report } from "@/types/reportTypes"; // Ensure this type is updated to reflect new fields

const ReportView: React.FC<{ report: Report }> = ({ report }) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "dd.MM.yy HH:mm", { locale: ru });
  };

  const formatDateOnly = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "dd.MM.yyyy", { locale: ru });
  };

  return (
    <div className="font-sans text-sm p-4 bg-white">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase">
          Паспорт промковша {report.ladlePassportNumber}
        </h1>
        {/* Removed report.meltDetails as it's no longer a direct property */}
      </div>

      <p className="mb-3">
        <span className="font-medium">Прибытие на участок:</span>{" "}
        {formatDate(report.arrivalDate)}
      </p>

      {/* Торкретирование и сборка */}
      <div className="mb-6">
        <h2 className="text-base font-bold uppercase mb-3 border-b-2 border-black pb-1 tracking-wide">
          ТОРКРЕТИРОВАНИЕ И СБОРКА ПК
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Торкретирование */}
          <div>
            <h3 className="font-semibold uppercase mb-2 text-sm">
              ТОРКРЕТИРОВАНИЕ
            </h3>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-medium">Дата:</span>{" "}
                {formatDateOnly(report.torcretingDate)}
              </p>
              <p>
                <span className="font-medium">Смеси(наимен,партия):</span>{" "}
                {report.mixtures}
              </p>
              <p>
                <span className="font-medium">Отдано на сборку:</span>{" "}
                {formatDateOnly(report.assemblyHandoverDate)}
              </p>

              <h4 className="font-semibold uppercase pt-2 pb-1 text-sm">
                РАСПОЛОЖЕНИЕ ТЕРМОБЛОКОВ
              </h4>
              <p>
                <span className="font-medium">Расстояние от днища(мм):</span>{" "}
                {report.thermalBlockDistance}
              </p>
              <p>
                <span className="font-medium">Длина выступ.части(мм):</span>{" "}
                {report.thermalBlockProtrusion}
              </p>
              <p>
                <span className="font-medium">Состояние термоблока:</span>{" "}
                {report.thermalBlockCondition || "нет данных"}
              </p>
            </div>
          </div>

          {/* Сборка */}
          <div>
            <h3 className="font-semibold uppercase mb-2 text-sm">СБОРКА</h3>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-medium">Стаканы-дозаторы:</span>{" "}
                {report.doserCupType} {/* Changed from doserCups */}
              </p>
              <p>
                <span className="font-medium">Установщик стаканов:</span>{" "}
                {report.doserCupInstaller} {/* New field */}
              </p>
              <p>
                <span className="font-medium">Стопор-моноблок:</span>{" "}
                {report.stopperMonoblockType}{" "}
                {/* Changed from stopperMonoblock */}
              </p>
              <p>
                <span className="font-medium">Установщик стопора:</span>{" "}
                {report.stopperMonoblockInstaller} {/* New field */}
              </p>
              <p>
                <span className="font-medium">Затвор №1:</span> {report.valve1}
              </p>
              <p>
                <span className="font-medium">Затвор №2:</span> {report.valve2}
              </p>
              {report.turbostop && (
                <p>
                  <span className="font-medium">Турбостоп:</span>{" "}
                  {report.turbostop}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Разливка */}
      <div className="mb-6">
        <h2 className="text-base font-bold uppercase mb-2 border-b-2 border-black pb-1 tracking-wide">
          РАЗЛИВКА
        </h2>
        <p className="mb-3 text-xs">
          <span className="font-medium">Отдано на разливку:</span>{" "}
          {format(new Date(report.pouringHandoverDateTime), "dd/MM/yy HH:mm", {
            locale: ru,
          })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Подготовка к разливке */}
          <div>
            <h3 className="font-semibold uppercase mb-2 text-sm">
              ПОДГОТОВКА К РАЗЛИВКЕ
            </h3>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-medium">Постановка на разогрев:</span>{" "}
                {formatDate(report.heatingStartDateTime)}
              </p>
              <p>
                <span className="font-medium">Длительность разогрева:</span>{" "}
                {report.heatingDuration}
              </p>
              <p>
                <span className="font-medium">Оператор ГПУ:</span>{" "}
                {report.operatorName}
              </p>
            </div>
          </div>

          {/* Детали Разливки (Плавки) - First Pouring Event */}
          <div>
            <h3 className="font-semibold uppercase mb-2 text-sm">
              РАЗЛИВКА (Начало)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-gray-400 pl-2 py-1">
                <p>
                  <span className="font-medium">
                    Плавка № {report.pour1MeltNumber}
                  </span>{" "}
                  УНРС: {report.pour1Unrs}
                </p>
                <p>
                  <span className="font-medium">Начало:</span>{" "}
                  {format(
                    new Date(report.pour1StartDateTime),
                    "dd/MM/yy HH:mm",
                    {
                      locale: ru,
                    }
                  )}
                </p>
                <p>
                  <span className="font-medium">Окончание:</span>{" "}
                  {format(new Date(report.pour1EndDateTime), "dd/MM/yy HH:mm", {
                    locale: ru,
                  })}
                </p>
                <p>
                  <span className="font-medium">№ пл.в серии:</span>{" "}
                  {report.pour1SeriesPosition}
                </p>
                <p>
                  <span className="font-medium">Стойкость ПК:</span>{" "}
                  {report.pour1LadleStability}
                </p>
              </div>
            </div>

            {/* Детали Разливки (Плавки) - Second Pouring Event */}
            <h3 className="font-semibold uppercase mb-2 mt-4 text-sm">
              РАЗЛИВКА (Окончание)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-gray-400 pl-2 py-1">
                <p>
                  <span className="font-medium">
                    Плавка № {report.pour2MeltNumber}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Разлито (Начало):</span>{" "}
                  {format(
                    new Date(report.pour2StartDateTime),
                    "dd/MM/yy HH:mm",
                    {
                      locale: ru,
                    }
                  )}
                </p>
                <p>
                  <span className="font-medium">Окончание:</span>{" "}
                  {format(new Date(report.pour2EndDateTime), "dd/MM/yy HH:mm", {
                    locale: ru,
                  })}
                </p>
                <p>
                  <span className="font-medium">Стойкость ПК:</span>{" "}
                  {report.pour2LadleStability}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Замечания */}
      <div className="mt-6 border-t-2 border-black pt-3">
        <h2 className="text-base font-bold uppercase mb-2 tracking-wide">
          ЗАМЕЧАНИЯ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 text-xs">
          <p>
            <span className="font-medium">По торкретированию:</span>{" "}
            {report.torcretingRemarks || "нет"}
          </p>
          <p>
            <span className="font-medium">По сборке:</span>{" "}
            {report.assemblyRemarks || "нет"}
          </p>
          <p>
            <span className="font-medium">По разогреву:</span>{" "}
            {report.heatingRemarks || "нет"}
          </p>
          <p>
            <span className="font-medium">По разливке:</span>{" "}
            {report.pouringRemarks || "нет"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
