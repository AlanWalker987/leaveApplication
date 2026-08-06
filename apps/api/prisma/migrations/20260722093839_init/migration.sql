-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "bio" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_role_key" ON "Test"("role");
