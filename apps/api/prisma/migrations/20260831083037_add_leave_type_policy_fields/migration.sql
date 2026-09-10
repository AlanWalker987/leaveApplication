-- CreateEnum
CREATE TYPE "LeaveEligibilityGender" AS ENUM ('Any', 'FemaleOnly');

-- AlterTable
ALTER TABLE "LeaveTypes" ADD COLUMN     "annualAllowance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "eligibilityGender" "LeaveEligibilityGender" NOT NULL DEFAULT 'Any';
