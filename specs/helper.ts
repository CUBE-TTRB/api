import { prisma } from '@App/app'

export async function truncateTable (tableName: string) {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`)
}

export async function truncateDatabase () {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Category" CASCADE;')
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Relation" CASCADE;')
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Comment" CASCADE;')
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Resource" CASCADE;')
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Authentification" CASCADE;')
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;')
}
