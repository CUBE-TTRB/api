/*
  Warnings:

  - The `body` column on the `Resource` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "body",
ADD COLUMN     "body" JSONB;
