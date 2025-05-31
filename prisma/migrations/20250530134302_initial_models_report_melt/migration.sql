-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "ladlePassportNumber" TEXT NOT NULL,
    "meltDetails" TEXT NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "torcretingDate" TIMESTAMP(3) NOT NULL,
    "mixtures" TEXT NOT NULL,
    "assemblyHandoverDate" TIMESTAMP(3) NOT NULL,
    "thermalBlockDistance" INTEGER NOT NULL,
    "thermalBlockProtrusion" INTEGER NOT NULL,
    "thermalBlockCondition" TEXT,
    "doserCups" TEXT NOT NULL,
    "stopperMonoblock" TEXT NOT NULL,
    "valve1" TEXT NOT NULL,
    "valve2" TEXT NOT NULL,
    "turbostop" TEXT,
    "pouringHandoverDateTime" TIMESTAMP(3) NOT NULL,
    "heatingStartDateTime" TIMESTAMP(3) NOT NULL,
    "heatingDuration" TEXT NOT NULL,
    "operatorName" TEXT NOT NULL,
    "torcretingRemarks" TEXT,
    "assemblyRemarks" TEXT,
    "heatingRemarks" TEXT,
    "pouringRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Melt" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "meltNumber" TEXT NOT NULL,
    "unrs" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "seriesPosition" TEXT NOT NULL,
    "ladleStability" TEXT NOT NULL,

    CONSTRAINT "Melt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Melt" ADD CONSTRAINT "Melt_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
