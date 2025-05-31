/*
  Warnings:

  - You are about to drop the column `doserCups` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `meltDetails` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `stopperMonoblock` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Melt` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `doserCupInstaller` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doserCupType` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour1EndDateTime` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour1LadleStability` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour1MeltNumber` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour1SeriesPosition` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour1StartDateTime` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour1Unrs` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour2EndDateTime` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour2LadleStability` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour2MeltNumber` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pour2StartDateTime` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stopperMonoblockInstaller` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stopperMonoblockType` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Melt" DROP CONSTRAINT "Melt_reportId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "doserCups",
DROP COLUMN "meltDetails",
DROP COLUMN "stopperMonoblock",
ADD COLUMN     "doserCupInstaller" TEXT NOT NULL,
ADD COLUMN     "doserCupType" TEXT NOT NULL,
ADD COLUMN     "pour1EndDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pour1LadleStability" INTEGER NOT NULL,
ADD COLUMN     "pour1MeltNumber" TEXT NOT NULL,
ADD COLUMN     "pour1SeriesPosition" TEXT NOT NULL,
ADD COLUMN     "pour1StartDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pour1Unrs" TEXT NOT NULL,
ADD COLUMN     "pour2EndDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pour2LadleStability" INTEGER NOT NULL,
ADD COLUMN     "pour2MeltNumber" TEXT NOT NULL,
ADD COLUMN     "pour2StartDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stopperMonoblockInstaller" TEXT NOT NULL,
ADD COLUMN     "stopperMonoblockType" TEXT NOT NULL;

-- DropTable
DROP TABLE "Melt";
