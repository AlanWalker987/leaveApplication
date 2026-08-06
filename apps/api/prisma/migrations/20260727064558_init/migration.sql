/*
  Warnings:

  - The primary key for the `Branch` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "isDeleted" SET DEFAULT false,
ADD CONSTRAINT "Branch_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Branch_id_seq";
