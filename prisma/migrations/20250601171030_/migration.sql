/*
  Warnings:

  - Added the required column `meltEndDateTime` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meltLadleStability` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meltNumber` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meltStartDateTime` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meltUnrs` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pour1MeltNumber` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pour1Unrs` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pour2MeltNumber` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "meltEndDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "meltLadleStability" INTEGER NOT NULL,
ADD COLUMN     "meltNumber" INTEGER NOT NULL,
ADD COLUMN     "meltStartDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "meltUnrs" INTEGER NOT NULL,
DROP COLUMN "pour1MeltNumber",
ADD COLUMN     "pour1MeltNumber" INTEGER NOT NULL,
DROP COLUMN "pour1Unrs",
ADD COLUMN     "pour1Unrs" INTEGER NOT NULL,
DROP COLUMN "pour2MeltNumber",
ADD COLUMN     "pour2MeltNumber" INTEGER NOT NULL;
