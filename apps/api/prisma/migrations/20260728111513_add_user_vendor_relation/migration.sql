-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vendorId" TEXT;

-- Backfill existing users with a default vendor before enforcing NOT NULL.
INSERT INTO "Vendor" ("id", "name", "contactName", "contactNumber", "contactEmail", "createdAt", "updatedAt", "isDeleted")
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Vendor', 'N/A', 'N/A', 'default-vendor@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
ON CONFLICT ("id") DO NOTHING;

UPDATE "User"
SET "vendorId" = '00000000-0000-0000-0000-000000000001'
WHERE "vendorId" IS NULL;

ALTER TABLE "User" ALTER COLUMN "vendorId" SET NOT NULL;

-- CreateTable
CREATE TABLE "PublicHolidays" (
    "id" TEXT NOT NULL,
    "holidayDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PublicHolidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveTypes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeaveTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
