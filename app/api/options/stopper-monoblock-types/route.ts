// pages/api/options/stopperMonoblockTypes/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const stopperMonoblockTypes = await prisma.optionItem.findMany({
      where: {
        typeId: 2, 
      },
      select: {
        name: true, 
      },
      orderBy: {
        name: 'asc', 
      },
    });

    const stopperNames = stopperMonoblockTypes.map(item => item.name);
    return NextResponse.json(stopperNames);
  } catch (error) {
    console.error('Error fetching stopper monoblock types:', error);
    return NextResponse.json({ message: 'Failed to fetch stopper monoblock types' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}