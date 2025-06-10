-- CreateTable
CREATE TABLE "OptionItem" (
    "PK_NSI_BUILD_ID" SERIAL NOT NULL,
    "PK_NSI_BUILD_NAME" TEXT NOT NULL,
    "PK_NSI_BUILD_PRZ" INTEGER NOT NULL,

    CONSTRAINT "OptionItem_pkey" PRIMARY KEY ("PK_NSI_BUILD_ID")
);

-- CreateTable
CREATE TABLE "LadlePassportNumber" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "LadlePassportNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LadlePassportNumber_number_key" ON "LadlePassportNumber"("number");
