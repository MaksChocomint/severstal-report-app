import prisma from "@/lib/prisma";

async function main() {
  console.log('Start seeding...');

  
  const optionItems = [
    
    { id: 32, name: 'Синореф', typeId: 1 },
    { id: 22, name: 'Пуянг', typeId: 1 },

    
    
    { id: 23, name: 'Long', typeId: 2 },
    { id: 50, name: 'IFGL', typeId: 2 },
    { id: 5, name: 'Пуянг', typeId: 2 },
    { id: 43, name: 'плиты пуянг', typeId: 2 },


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


 const ladlePassportNumbers = [
  '№ 9 - 55 Тн',
  '№ 12 - 27 Тн',
  '№ 2 - 55 Тн',
  '№ 5 - 55 Тн',
  '№ 7 - 55 Тн',
  '№ 12 - 50 Тн',
  '№ 14 - 50 Тн',
  '№ 5 - 27 Тн',
  '№ 13 - 27 Тн',
  '№ 16 - 27 Тн',
  '№ 20 - 27 Тн',
  '№ 21 - 27 Тн',
  '№ 25 - 27 Тн',
  '№ 27 - 27 Тн',
  '№ 29 - 27 Тн',
  '№ 3 - 55 Тн',
  '№ 6 - 55 Тн',
  '№ 3 - 27 Тн',
  '№ 6 - 27 Тн',
  '№ 28 - 27 Тн',
  '№ 1 - 55 Тн',
  '№ 10 - 27 Тн',
  '№ 17 - 27 Тн',
  '№ 26 - 27 Тн',
  '№ 4 - 55 Тн',
  '№ 8 - 55 Тн',
  '№ 3 - 50 Тн',
  '№ 6 - 50 Тн',
  '№ 10 - 50 Тн',
  '№ 2 - 27 Тн',
  '№ 7 - 27 Тн',
  '№ 8 - 27 Тн',
  '№ 9 - 27 Тн',
  '№ 15 - 27 Тн',
  '№ 22 - 27 Тн',
  '№ 13 - 50 Тн',
  '№ 15 - 50 Тн',
  '№ 1 - 27 Тн',
  '№ 4 - 27 Тн',
  '№ 11 - 27 Тн',
  '№ 19 - 27 Тн',
  '№ 1 - 50 Тн',
  '№ 8 - 50 Тн',
  '№ 14 - 27 Тн',
  '№ 23 - 27 Тн',
  '№ 9 - 50 Тн',
];

for (const number of ladlePassportNumbers) {
  await prisma.ladlePassportNumber.upsert({
    where: { number: number },
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