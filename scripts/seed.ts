const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {

    const municipalities = [
      {
        name: "Mogpog",
        schools: {
          create: [
            { name: 'Sayao National High School' },
            { name: 'Balanacan National High School' },
            { name: 'Mogpog National Comprehensive High School' },
            { name: 'Butansapa National High School' },
            { name: 'Puting Buhangin National High School' },
          ],
        },
      },
      {
        name: "Boac",
        schools: {
          create: [
            { name: "Marinduque National High School" },
          ],
        },
      },
      {
        name: "Gasan",
        schools: {
          create: [
            { name: "Tiguion National High School" },
          ],
        },
      },
      {
        name: "Buenavista",
        schools: {
          create: [
            { name: "Buenavista National High School" },
          ],
        },
      },
      {
        name: "Torrijos",
        schools: {
          create: [
            { name: "Landy National High School" },
          ],
        },
      },
      {
        name: "Sta. Cruz",
        schools: {
          create: [
            { name: "Alobo National High School" },
          ],
        },
      },
    ];

    for (const municipality of municipalities) {
      await database.municipality.create({
        data: {
          name: municipality.name,
          schools: municipality.schools,
        },
        include: {
          schools: true,
        },
      });
    }

    console.log("Seeding successfully!");
  } catch (error) {
    console.log("Seeding failed!", error);
  } finally {
    await database.$disconnect();
  }
}

main();