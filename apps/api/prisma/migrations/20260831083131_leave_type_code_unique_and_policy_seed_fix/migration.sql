/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `LeaveTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeaveTypes_code_key" ON "LeaveTypes"("code");
