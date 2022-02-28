-- CreateTable
CREATE TABLE "Authentification" (
    "id" SERIAL NOT NULL,
    "password" BYTEA NOT NULL,
    "salt" BYTEA NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Authentification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authentification_userId_key" ON "Authentification"("userId");

-- AddForeignKey
ALTER TABLE "Authentification" ADD CONSTRAINT "Authentification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
