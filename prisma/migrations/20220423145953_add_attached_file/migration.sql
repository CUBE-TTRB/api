-- CreateTable
CREATE TABLE "AttachedFile" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,

    CONSTRAINT "AttachedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttachedFile_key_key" ON "AttachedFile"("key");

-- AddForeignKey
ALTER TABLE "AttachedFile" ADD CONSTRAINT "AttachedFile_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
