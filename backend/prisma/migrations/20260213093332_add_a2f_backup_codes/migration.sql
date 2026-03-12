-- CreateTable
CREATE TABLE "A2FBackupCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codesHash" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "A2FBackupCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "A2FBackupCode_userId_key" ON "A2FBackupCode"("userId");

-- AddForeignKey
ALTER TABLE "A2FBackupCode" ADD CONSTRAINT "A2FBackupCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
