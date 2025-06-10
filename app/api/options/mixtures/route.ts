// pages/api/options/mixtures/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const mixtures = await prisma.optionItem.findMany({
      where: {
        typeId: 3, // PK_NSI_BUILD_PRZ = 3 для "смеси"
      },
      select: {
        name: true, // Выбираем только поле 'name'
      },
      orderBy: {
        name: 'asc', // Опционально: сортируем по имени
      },
    });

    const mixtureNames = mixtures.map(item => item.name);
    return NextResponse.json(mixtureNames);
  } catch (error) {
    console.error('Error fetching mixtures:', error);
    return NextResponse.json({ message: 'Failed to fetch mixtures' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}