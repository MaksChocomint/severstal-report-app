// pages/api/options/ladlePassportNumbers/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const ladlePassportNumbers = await prisma.ladlePassportNumber.findMany({
      select: {
        number: true, // Выбираем только поле 'number'
      },
      orderBy: {
        number: 'asc', // Опционально: сортируем по номеру
      },
    });

    const numbers = ladlePassportNumbers.map(item => item.number);
    return NextResponse.json(numbers);
  } catch (error) {
    console.error('Error fetching ladle passport numbers:', error);
    return NextResponse.json({ message: 'Failed to fetch ladle passport numbers' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}