/*
  Warnings:

  - Added the required column `expires_in` to the `codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "codes" ADD COLUMN     "expires_in" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;
