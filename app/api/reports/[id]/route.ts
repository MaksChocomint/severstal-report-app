// app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== 'REPORTER') {
      return NextResponse.json(
        { message: 'Доступ запрещен. Требуется роль REPORTER.' },
        { status: 403 } // Forbidden
      );
    }

   
    const id = parseInt(params.id, 10); 

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Неверный формат ID отчета.' },
        { status: 400 } 
      );
    }


    const deletedReport = await prisma.report.delete({
      where: { id: id },
    });

 
    return NextResponse.json(
      { message: 'Отчет успешно удален.', report: deletedReport },
      { status: 200 } // OK
    );
  } catch (error: any) {
    
    if (error.code === 'P2025') {
    
      return NextResponse.json(
        { message: 'Отчет с указанным ID не найден.' },
        { status: 404 } 
      );
    }
    console.error('Ошибка при удалении отчета:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера при удалении отчета.' },
      { status: 500 } 
    );
  }
}