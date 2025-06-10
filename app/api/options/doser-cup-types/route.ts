// pages/api/options/doserCupTypes/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";



export async function GET() {
  try {
    const doserCupTypes = await prisma.optionItem.findMany({
      where: {
        typeId: 1, // PK_NSI_BUILD_PRZ = 1 для "стакан дозатор"
      },
      select: {
        name: true, // Выбираем только поле 'name'
      },
      orderBy: {
        name: 'asc', // Опционально: сортируем по имени
      },
    });

    const doserNames = doserCupTypes.map(item => item.name);
    return NextResponse.json(doserNames);
  } catch (error) {
    console.error('Error fetching doser cup types:', error);
    return NextResponse.json({ message: 'Failed to fetch doser cup types' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}