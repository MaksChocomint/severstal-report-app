// components/ReportForm.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "react-modal"; // Import Modal
import {
  mixtureOptions,
  doserCupTypeOptions,
  stopperMonoblockTypeOptions,
} from "@/constants/reportFormOptions";

import {
  convertDateTimeLocalToISO,
  getInitialDateTimeForInput,
} from "@/lib/utils";

// Set app element for react-modal
// This is important for accessibility reasons.
// You might want to do this once in your root component or index.tsx/App.tsx
if (typeof window !== "undefined") {
  Modal.setAppElement("#__next"); // Assuming Next.js default root element ID
}

const inputBaseClasses =
  "block w-full rounded-md border-slate-300 py-2.5 px-3.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";
const labelClasses =
  "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";
const sectionCardClasses = "bg-slate-50 p-5 rounded-lg shadow-sm mb-6";
const sectionTitleInCardClasses =
  "text-base font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2.5";
const mainSectionDividerContainerClasses = "relative my-8";

export default function ReportForm({
  onSuccess,
}: {
  onSuccess?: (reportId: number) => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [modalSuccess, setModalSuccess] = useState(true); // State for success/error modal styling
  const [createdReportId, setCreatedReportId] = useState<number | null>(null); // State to store the ID of the created report

  const initialDateTimeLocal = getInitialDateTimeForInput(0);

  const initialFormData = {
    ladlePassportNumber: "№ 29 - 27 Тн",

    // Раздел плавки
    meltNumber: 29,
    meltUnrs: 27,
    meltStartDateTime: "2025-05-28T05:05",
    meltEndDateTime: "2025-05-28T09:21",
    meltLadleStability: 4,

    // Раздел торкретирования
    arrivalDate: initialDateTimeLocal,
    torcretingDate: initialDateTimeLocal,
    mixtures: mixtureOptions[0],
    assemblyHandoverDate: initialDateTimeLocal,

    // Раздел расположения термоблоков
    thermalBlockDistance: 0,
    thermalBlockProtrusion: 0,
    thermalBlockCondition: "Удовлетворительное",

    // Раздел сборки
    doserCupType: doserCupTypeOptions[0],
    doserCupInstaller: "Матюшев",
    stopperMonoblockType: stopperMonoblockTypeOptions[0],
    stopperMonoblockInstaller: "Комилов",
    valve1: "3 СТОП.МЕХ 1: 17",
    valve2: "2 СТОП.МЕХ 2: 6",
    turbostop: "АО «БКО»",

    // Раздел разливки
    pouringHandoverDateTime: initialDateTimeLocal,
    heatingStartDateTime: initialDateTimeLocal,
    heatingDuration: "03:34:49",
    operatorName: "Ефремов М.Б.",

    // Детали первой разливки
    pour1MeltNumber: 153205,
    pour1Unrs: 3,
    pour1StartDateTime: "2025-05-30T01:14",
    pour1EndDateTime: "2025-05-30T02:31",
    pour1SeriesPosition: "1",
    pour1LadleStability: 1,

    // Детали второй разливки
    pour2MeltNumber: 153218,
    pour2StartDateTime: "2025-05-30T12:36",
    pour2EndDateTime: "2025-05-30T13:48",
    pour2LadleStability: 10,

    // Замечания
    torcretingRemarks: "",
    assemblyRemarks: "",
    heatingRemarks: "",
    pouringRemarks: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : parseInt(value)) : value,
    }));
  };

  const openModal = (
    message: string,
    isSuccess: boolean,
    reportId?: number
  ) => {
    setModalMessage(message);
    setModalSuccess(isSuccess);
    setCreatedReportId(reportId || null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalMessage("");
    setCreatedReportId(null);
    if (modalSuccess && createdReportId) {
      if (onSuccess) onSuccess(createdReportId);
      else router.push(`/reports/${createdReportId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const processedFormData = {
      ...formData,
      // ISO format
      meltStartDateTime: convertDateTimeLocalToISO(formData.meltStartDateTime),
      meltEndDateTime: convertDateTimeLocalToISO(formData.meltEndDateTime),
      arrivalDate: convertDateTimeLocalToISO(formData.arrivalDate),
      torcretingDate: convertDateTimeLocalToISO(formData.torcretingDate),
      assemblyHandoverDate: convertDateTimeLocalToISO(
        formData.assemblyHandoverDate
      ),
      pouringHandoverDateTime: convertDateTimeLocalToISO(
        formData.pouringHandoverDateTime
      ),
      heatingStartDateTime: convertDateTimeLocalToISO(
        formData.heatingStartDateTime
      ),
      pour1StartDateTime: convertDateTimeLocalToISO(
        formData.pour1StartDateTime
      ),
      pour1EndDateTime: convertDateTimeLocalToISO(formData.pour1EndDateTime),
      pour2StartDateTime: convertDateTimeLocalToISO(
        formData.pour2StartDateTime
      ),
      pour2EndDateTime: convertDateTimeLocalToISO(formData.pour2EndDateTime),

      // Ensure all Int fields are numbers
      meltNumber: Number(formData.meltNumber),
      meltUnrs: Number(formData.meltUnrs),
      meltLadleStability: Number(formData.meltLadleStability),
      thermalBlockDistance: Number(formData.thermalBlockDistance),
      thermalBlockProtrusion: Number(formData.thermalBlockProtrusion),
      pour1MeltNumber: Number(formData.pour1MeltNumber),
      pour1Unrs: Number(formData.pour1Unrs),
      pour1LadleStability: Number(formData.pour1LadleStability),
      pour2MeltNumber: Number(formData.pour2MeltNumber),
      pour2LadleStability: Number(formData.pour2LadleStability),
    };

    const payload = { ...processedFormData };

    try {
      const response = await axios.post("/api/reports", payload);

      if (response.status === 200 || response.status === 201) {
        const report = response.data;
        openModal("Отчет успешно сохранен!", true, report.id); // Open success modal
      } else {
        const errorData = response.data;
        console.error("Server error data:", errorData);
        const message = errorData.message || "Ошибка сохранения отчета";
        throw new Error(message);
      }
    } catch (error) {
      console.error("Ошибка отправки:", error);
      let errorMessage = "Произошла ошибка при сохранении отчета";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.message || "Ошибка сервера при сохранении";
        } else if (error.request) {
          errorMessage = "Нет ответа от сервера. Проверьте сетевое соединение.";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      openModal(errorMessage, false); // Open error modal
    } finally {
      setIsSubmitting(false);
    }
  };

  const MainSectionDivider = ({ title }: { title: string }) => (
    <div className={mainSectionDividerContainerClasses}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-300"></div>
      </div>
      <div className="relative flex justify-start">
        <span className="bg-white px-3 text-base font-semibold text-slate-700">
          {title}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-slate-900 text-center mb-6">
          Паспорт промковша
        </h1>

        {/* --- Основная информация --- */}
        <MainSectionDivider title="Основная информация" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
          <div>
            <label htmlFor="ladlePassportNumber" className={labelClasses}>
              Номер паспорта
            </label>
            <input
              type="text"
              id="ladlePassportNumber"
              name="ladlePassportNumber"
              value={formData.ladlePassportNumber}
              onChange={handleChange}
              className={inputBaseClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="arrivalDate" className={labelClasses}>
              Дата прибытия
            </label>
            <input
              type="datetime-local"
              id="arrivalDate"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              className={inputBaseClasses}
              required
            />
          </div>
        </div>

        {/* --- Раздел плавки --- */}
        <MainSectionDivider title="Раздел плавки" />
        <div className={sectionCardClasses}>
          <h3 className={sectionTitleInCardClasses}>Детали плавки</h3>
          <div className="space-y-5">
            <div>
              <label htmlFor="meltNumber" className={labelClasses}>
                Плавка №
              </label>
              <input
                type="number"
                id="meltNumber"
                name="meltNumber"
                value={formData.meltNumber}
                onChange={handleChange}
                className={`${inputBaseClasses} bg-white`}
                required
              />
            </div>
            <div>
              <label htmlFor="meltUnrs" className={labelClasses}>
                УНРС
              </label>
              <input
                type="number"
                id="meltUnrs"
                name="meltUnrs"
                value={formData.meltUnrs}
                onChange={handleChange}
                className={`${inputBaseClasses} bg-white`}
                required
              />
            </div>
            <div>
              <label htmlFor="meltStartDateTime" className={labelClasses}>
                Начало
              </label>
              <input
                type="datetime-local"
                id="meltStartDateTime"
                name="meltStartDateTime"
                value={formData.meltStartDateTime}
                onChange={handleChange}
                className={`${inputBaseClasses} bg-white`}
                required
              />
            </div>
            <div>
              <label htmlFor="meltEndDateTime" className={labelClasses}>
                Окончание
              </label>
              <input
                type="datetime-local"
                id="meltEndDateTime"
                name="meltEndDateTime"
                value={formData.meltEndDateTime}
                onChange={handleChange}
                className={`${inputBaseClasses} bg-white`}
                required
              />
            </div>
            <div>
              <label htmlFor="meltLadleStability" className={labelClasses}>
                Стойкость ПК
              </label>
              <input
                type="number"
                id="meltLadleStability"
                name="meltLadleStability"
                value={formData.meltLadleStability}
                onChange={handleChange}
                className={`${inputBaseClasses} bg-white`}
                required
              />
            </div>
          </div>
        </div>

        {/* --- Торкретирование и сборка ПК --- */}
        <MainSectionDivider title="Торкретирование и сборка ПК" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={sectionCardClasses}>
            <h3 className={sectionTitleInCardClasses}>Торкретирование</h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="torcretingDate" className={labelClasses}>
                  Дата
                </label>
                <input
                  type="datetime-local"
                  id="torcretingDate"
                  name="torcretingDate"
                  value={formData.torcretingDate}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="mixtures" className={labelClasses}>
                  Смеси
                </label>
                <select
                  id="mixtures"
                  name="mixtures"
                  value={formData.mixtures}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                >
                  {mixtureOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="assemblyHandoverDate" className={labelClasses}>
                  Отдано на сборку
                </label>
                <input
                  type="datetime-local"
                  id="assemblyHandoverDate"
                  name="assemblyHandoverDate"
                  value={formData.assemblyHandoverDate}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="thermalBlockDistance" className={labelClasses}>
                  Расстояние от днища (мм)
                </label>
                <input
                  type="number"
                  id="thermalBlockDistance"
                  name="thermalBlockDistance"
                  value={formData.thermalBlockDistance}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="thermalBlockProtrusion"
                  className={labelClasses}
                >
                  Длина выступающей части (мм)
                </label>
                <input
                  type="number"
                  id="thermalBlockProtrusion"
                  name="thermalBlockProtrusion"
                  value={formData.thermalBlockProtrusion}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="thermalBlockCondition" className={labelClasses}>
                  Состояние термоблока
                </label>
                <select
                  id="thermalBlockCondition"
                  name="thermalBlockCondition"
                  value={formData.thermalBlockCondition}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                >
                  <option value="Удовлетворительное">Удовлетворительное</option>
                  <option value="Неудовлетворительное">
                    Неудовлетворительное
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className={sectionCardClasses}>
            <h3 className={sectionTitleInCardClasses}>Cборка</h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="doserCupType" className={labelClasses}>
                  Тип стаканов-дозаторов
                </label>
                <select
                  id="doserCupType"
                  name="doserCupType"
                  value={formData.doserCupType}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                >
                  {doserCupTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="doserCupInstaller" className={labelClasses}>
                  Установщик стаканов-дозаторов
                </label>
                <input
                  type="text"
                  id="doserCupInstaller"
                  name="doserCupInstaller"
                  value={formData.doserCupInstaller}
                  onChange={handleChange}
                  placeholder="ФИО установщика"
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="stopperMonoblockType" className={labelClasses}>
                  Тип стопора-моноблока
                </label>
                <select
                  id="stopperMonoblockType"
                  name="stopperMonoblockType"
                  value={formData.stopperMonoblockType}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                >
                  {stopperMonoblockTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="stopperMonoblockInstaller"
                  className={labelClasses}
                >
                  Установщик стопора-моноблока
                </label>
                <input
                  type="text"
                  id="stopperMonoblockInstaller"
                  name="stopperMonoblockInstaller"
                  value={formData.stopperMonoblockInstaller}
                  onChange={handleChange}
                  placeholder="ФИО установщика"
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="valve1" className={labelClasses}>
                  Затвор №1
                </label>
                <input
                  type="text"
                  id="valve1"
                  name="valve1"
                  value={formData.valve1}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="valve2" className={labelClasses}>
                  Затвор №2
                </label>
                <input
                  type="text"
                  id="valve2"
                  name="valve2"
                  value={formData.valve2}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="turbostop" className={labelClasses}>
                  Турбостоп
                </label>
                <input
                  type="text"
                  id="turbostop"
                  name="turbostop"
                  value={formData.turbostop}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Разливка (единичный объект) --- */}
        <MainSectionDivider title="Разливка" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={sectionCardClasses}>
            <h3 className={sectionTitleInCardClasses}>Подготовка к разливке</h3>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="pouringHandoverDateTime"
                  className={labelClasses}
                >
                  Отдано на разливку
                </label>
                <input
                  type="datetime-local"
                  id="pouringHandoverDateTime"
                  name="pouringHandoverDateTime"
                  value={formData.pouringHandoverDateTime}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="heatingStartDateTime" className={labelClasses}>
                  Постановка на разогрев
                </label>
                <input
                  type="datetime-local"
                  id="heatingStartDateTime"
                  name="heatingStartDateTime"
                  value={formData.heatingStartDateTime}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="heatingDuration" className={labelClasses}>
                  Длительность разогрева
                </label>
                <input
                  type="text"
                  id="heatingDuration"
                  name="heatingDuration"
                  value={formData.heatingDuration}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  placeholder="чч:мм:сс"
                  required
                />
              </div>
              <div>
                <label htmlFor="operatorName" className={labelClasses}>
                  Оператор ГПУ
                </label>
                <input
                  type="text"
                  id="operatorName"
                  name="operatorName"
                  value={formData.operatorName}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
            </div>
          </div>

          <div className={sectionCardClasses}>
            <h3 className={sectionTitleInCardClasses}>Детали Разливки (1)</h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="pour1MeltNumber" className={labelClasses}>
                  Плавка № (1)
                </label>
                <input
                  type="number"
                  id="pour1MeltNumber"
                  name="pour1MeltNumber"
                  value={formData.pour1MeltNumber}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour1Unrs" className={labelClasses}>
                  УНРС (1)
                </label>
                <input
                  type="number"
                  id="pour1Unrs"
                  name="pour1Unrs"
                  value={formData.pour1Unrs}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour1StartDateTime" className={labelClasses}>
                  Начало (1)
                </label>
                <input
                  type="datetime-local"
                  id="pour1StartDateTime"
                  name="pour1StartDateTime"
                  value={formData.pour1StartDateTime}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour1EndDateTime" className={labelClasses}>
                  Окончание (1)
                </label>
                <input
                  type="datetime-local"
                  id="pour1EndDateTime"
                  name="pour1EndDateTime"
                  value={formData.pour1EndDateTime}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour1SeriesPosition" className={labelClasses}>
                  № в серии (1)
                </label>
                <input
                  type="text"
                  id="pour1SeriesPosition"
                  name="pour1SeriesPosition"
                  value={formData.pour1SeriesPosition}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour1LadleStability" className={labelClasses}>
                  Стойкость ПК (1)
                </label>
                <input
                  type="number"
                  id="pour1LadleStability"
                  name="pour1LadleStability"
                  value={formData.pour1LadleStability}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
            </div>
            <h3 className={sectionTitleInCardClasses + " mt-8"}>
              Детали Разливки (2)
            </h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="pour2MeltNumber" className={labelClasses}>
                  Плавка № (2)
                </label>
                <input
                  type="number"
                  id="pour2MeltNumber"
                  name="pour2MeltNumber"
                  value={formData.pour2MeltNumber}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour2StartDateTime" className={labelClasses}>
                  Начало (2)
                </label>
                <input
                  type="datetime-local"
                  id="pour2StartDateTime"
                  name="pour2StartDateTime"
                  value={formData.pour2StartDateTime}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour2EndDateTime" className={labelClasses}>
                  Окончание (2)
                </label>
                <input
                  type="datetime-local"
                  id="pour2EndDateTime"
                  name="pour2EndDateTime"
                  value={formData.pour2EndDateTime}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
              <div>
                <label htmlFor="pour2LadleStability" className={labelClasses}>
                  Стойкость ПК (2)
                </label>
                <input
                  type="number"
                  id="pour2LadleStability"
                  name="pour2LadleStability"
                  value={formData.pour2LadleStability}
                  onChange={handleChange}
                  className={`${inputBaseClasses} bg-white`}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Замечания --- */}
        <MainSectionDivider title="Замечания" />
        <div className={sectionCardClasses}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label htmlFor="torcretingRemarks" className={labelClasses}>
                По торкретированию
              </label>
              <textarea
                id="torcretingRemarks"
                name="torcretingRemarks"
                value={formData.torcretingRemarks}
                onChange={handleChange}
                rows={3}
                className={`${inputBaseClasses} bg-white`}
              ></textarea>
            </div>
            <div>
              <label htmlFor="assemblyRemarks" className={labelClasses}>
                По сборке
              </label>
              <textarea
                id="assemblyRemarks"
                name="assemblyRemarks"
                value={formData.assemblyRemarks}
                onChange={handleChange}
                rows={3}
                className={`${inputBaseClasses} bg-white`}
              ></textarea>
            </div>
            <div>
              <label htmlFor="heatingRemarks" className={labelClasses}>
                По разогреву
              </label>
              <textarea
                id="heatingRemarks"
                name="heatingRemarks"
                value={formData.heatingRemarks}
                onChange={handleChange}
                rows={3}
                className={`${inputBaseClasses} bg-white`}
              ></textarea>
            </div>
            <div>
              <label htmlFor="pouringRemarks" className={labelClasses}>
                По разливке
              </label>
              <textarea
                id="pouringRemarks"
                name="pouringRemarks"
                value={formData.pouringRemarks}
                onChange={handleChange}
                rows={3}
                className={`${inputBaseClasses} bg-white`}
              ></textarea>
            </div>
          </div>
        </div>

        {/* --- Кнопка отправки --- */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              ${
                isSubmitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 cursor-pointer"
              }`}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить отчет"}
          </button>
        </div>
      </form>

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Сообщение о сохранении отчета"
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div
          className={`bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto text-center ${
            modalSuccess
              ? "border-t-4 border-green-500"
              : "border-t-4 border-red-500"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-3 ${
              modalSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {modalSuccess ? "Успех!" : "Ошибка!"}
          </h2>
          <p className="text-slate-700 mb-5">{modalMessage}</p>
          <button
            onClick={closeModal}
            className={`py-2 px-4 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                modalSuccess
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              }`}
          >
            {modalSuccess ? "Продолжить" : "Закрыть"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
