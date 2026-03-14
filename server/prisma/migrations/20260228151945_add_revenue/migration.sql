-- CreateEnum
CREATE TYPE "RevenueType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "revenues" (
    "id" TEXT NOT NULL,
    "totalIncome" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "totalExpense" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_transactions" (
    "id" TEXT NOT NULL,
    "revenueId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "RevenueType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "revenue_transactions" ADD CONSTRAINT "revenue_transactions_revenueId_fkey" FOREIGN KEY ("revenueId") REFERENCES "revenues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_transactions" ADD CONSTRAINT "revenue_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
