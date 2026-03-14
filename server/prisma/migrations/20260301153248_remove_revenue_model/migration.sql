/*
  Warnings:

  - You are about to drop the column `revenueId` on the `revenue_transactions` table. All the data in the column will be lost.
  - You are about to drop the `revenues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "revenue_transactions" DROP CONSTRAINT "revenue_transactions_revenueId_fkey";

-- AlterTable
ALTER TABLE "revenue_transactions" DROP COLUMN "revenueId";

-- DropTable
DROP TABLE "revenues";
