/*
  Warnings:

  - Added the required column `createdAt` to the `AttachedFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AttachedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Type" ADD VALUE 'CHALLENGE_CARD';

-- AlterTable
ALTER TABLE "AttachedFile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "link" TEXT;
