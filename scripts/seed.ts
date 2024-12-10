const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {

    const categories = [
      {
        name: "Polygons",
        subCategories: {
          create: [
            { name: "Types of Polygons" },
            { name: "Definition and Properties" },
            { name: "Regular and Irregular Polygons" },
            { name: "Convex and Non-Convex Polygons" },
          ],
        },
      },
      {
        name: "Angles",
        subCategories: {
          create: [
            { name: "Angle Pairs" },
            { name: "Exterior and Interior Angles" },
            { name: "Adjacent Angles" },
            { name: "Angle Measurements" },
          ],
        },
      },
      {
        name: "Area and Volume",
        subCategories: {
          create: [
            { name: "Area of Shapes and Polygons" },
            { name: "Volume of Cylinders" },
            { name: "Volume of Rectangular Prism" },
            { name: "Volume of Square and Rectangular Pyramid" },
            { name: "Volume of Composite Solid" },
          ],
        },
      },
    ];

    for (const category of categories) {
      await database.category.create({
        data: {
          name: category.name,
          subCategories: category.subCategories,
        },
        include: {
          subCategories: true,
        },
      });
    }

    await database.week.createMany({
      data: [
        { name: "Week 1" },
        { name: "Week 2" },
        { name: "Week 3" },
        { name: "Week 4" },
        { name: "Week 5" },
        { name: "Week 6" },
        { name: "Week 7" },
        { name: "Week 8" },
      ],
    });

    await database.quarter.createMany({
      data: [
        { name: "Quarter 1" },
        { name: "Quarter 2" },
        { name: "Quarter 3" },
        { name: "Quarter 4" },
      ],
    });

    console.log("Seeding successfully!");
  } catch (error) {
    console.log("Seeding failed!", error);
  } finally {
    await database.$disconnect();
  }
}

main();