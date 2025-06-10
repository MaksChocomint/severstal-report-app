import prisma from "@/lib/prisma";

async function main() {
  console.log('Start seeding...');

  // Data for OptionItem model (Doser Cup Types, Stopper Monoblock Types, Mixtures)
  const optionItems = [
    // Стакан дозатор (typeId: 1)
    { id: 32, name: 'Синореф', typeId: 1 },
    { id: 22, name: 'Пуянг', typeId: 1 },

    // Стопор-моноблок (typeId: 2)
    
    { id: 23, name: 'Long', typeId: 2 },
    { id: 50, name: 'IFGL', typeId: 2 },
    { id: 5, name: 'Пуянг', typeId: 2 },
    { id: 43, name: 'плиты пуянг', typeId: 2 },

    // Смеси (typeId: 3)
    { id: 12, name: 'Dalgun', typeId: 3 },
    { id: 14, name: 'РиокастМаг1', typeId: 3 },
    { id: 52, name: 'Refro Gun-M90', typeId: 3 },
    { id: 8, name: 'TUN80', typeId: 3 },
    { id: 29, name: 'Маг-70', typeId: 3 },
    { id: 30, name: 'M10CC', typeId: 3 },
  ];

  for (const option of optionItems) {
    await prisma.optionItem.upsert({
      where: { id: option.id },
      update: {},
      create: option,
    });
  }
  console.log('OptionItem seeding finished.');

  // Data for LadlePassportNumber model
  const ladlePassportNumbers = [
    '№ 29 - 27 Тн', // Your example
    '№ 30 - 28 Тн',
    '№ 31 - 29 Тн',
    '№ 32 - 30 Тн',
    '№ 33 - 31 Тн',
    '№ 34 - 32 Тн',
    '№ 35 - 33 Тн',
    '№ 36 - 34 Тн',
    '№ 37 - 35 Тн',
    '№ 38 - 36 Тн',
    '№ 39 - 37 Тн',
  ];

  for (const number of ladlePassportNumbers) {
    await prisma.ladlePassportNumber.upsert({
      where: { number: number }, // Use 'number' as the unique field for upsert
      update: {},
      create: { number: number },
    });
  }
  console.log('LadlePassportNumber seeding finished.');


  console.log('All seeding processes completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });