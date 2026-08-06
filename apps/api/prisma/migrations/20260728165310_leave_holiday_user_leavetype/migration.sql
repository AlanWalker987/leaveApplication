-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Cancelled');

-- CreateTable
CREATE TABLE "LeaveTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "openingLeaveCount" DECIMAL(65,30) NOT NULL DEFAULT 20.0,
    "pendingLeaveCount" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "approvedLeaveCount" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "cancelledLeaveCount" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "rejectedLeaveCount" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeaveTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "managerId" TEXT,
    "leaveTypeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "totalDays" DECIMAL(2,1) NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'Pending',
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeaveApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeaveTracker_userId_idx" ON "LeaveTracker"("userId");

-- CreateIndex
CREATE INDEX "LeaveTracker_year_idx" ON "LeaveTracker"("year");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveTracker_userId_year_key" ON "LeaveTracker"("userId", "year");

-- CreateIndex
CREATE INDEX "LeaveApplication_userId_status_idx" ON "LeaveApplication"("userId", "status");

-- CreateIndex
CREATE INDEX "LeaveApplication_managerId_status_idx" ON "LeaveApplication"("managerId", "status");

-- CreateIndex
CREATE INDEX "LeaveApplication_leaveTypeId_idx" ON "LeaveApplication"("leaveTypeId");

-- CreateIndex
CREATE INDEX "LeaveApplication_fromDate_idx" ON "LeaveApplication"("fromDate");

-- CreateIndex
CREATE INDEX "LeaveApplication_toDate_idx" ON "LeaveApplication"("toDate");

-- AddForeignKey
ALTER TABLE "LeaveTracker" ADD CONSTRAINT "LeaveTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
