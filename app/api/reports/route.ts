import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Создаем отчет с плавками
    const report = await prisma.report.create({
      data
      
    });
    
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Ошибка генерации отчета:', error);
    return NextResponse.json(
      { error: "Ошибка создания отчета" },
      { status: 500 }
    );
  }
}