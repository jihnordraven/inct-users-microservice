/*
  Warnings:

  - Added the required column `expires_in` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "expires_in" TIMESTAMP(3) NOT NULL;
