import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main () {
  // const resourceTypes = await prisma.type.createMany({
  //   data: [
  //     {
  //       name: 'activity',
  //       // attributes: []
  //     },
  //     {
  //       name: 'article',
  //       // attributes: []
  //     },
  //     {
  //       name: 'course',
  //       // attributes: []
  //     },
  //     {
  //       name: 'exercise',
  //       // attributes: []
  //     },
  //     {
  //       name: 'booklet',
  //       // attributes: []
  //     },
  //     {
  //       name: 'videogame',
  //       // attributes: []
  //     },
  //     {
  //       name: 'video',
  //       // attributes: []
  //     },
  //   ]
  // })

  // console.log({ resourceTypes })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
