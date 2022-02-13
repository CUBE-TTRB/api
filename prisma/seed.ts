import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main () {
  await prisma.category.create({
    data: {
      name: 'No category',
      default: true
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
