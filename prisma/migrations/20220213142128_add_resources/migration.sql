-- CreateEnum
CREATE TYPE "Type" AS ENUM ('ACTIVITY', 'ARTICLE', 'COURSE', 'EXERCISE', 'BOOKLET', 'VIDEOGAME', 'VIDEO');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'PUBLIC', 'SHARED');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('SUBMITTED', 'REFUSED', 'ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "visibility" "Visibility" NOT NULL,
    "state" "State" NOT NULL DEFAULT E'SUBMITTED',
    "type" "Type" NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RelationToResource" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_name_key" ON "Relation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_RelationToResource_AB_unique" ON "_RelationToResource"("A", "B");

-- CreateIndex
CREATE INDEX "_RelationToResource_B_index" ON "_RelationToResource"("B");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelationToResource" ADD FOREIGN KEY ("A") REFERENCES "Relation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelationToResource" ADD FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
