/*
  Warnings:

  - A unique constraint covering the columns `[id,default]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "default" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_default_key_where_true" ON "Category"("id", "default") WHERE "default" is true;
