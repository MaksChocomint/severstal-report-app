// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ensure this path is correct

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated and is a REPORTER
    if (!session || !session.user || (session.user as any).role !== 'REPORTER') {
      return NextResponse.json(
        { error: 'Недостаточно прав для создания отчета. Только Репортеры могут добавлять отчеты.' },
        { status: 403 } // 403 Forbidden status
      );
    }

    const data = await req.json();

    // Attach the authorId from the session to the report data
    const reportDataWithAuthor = {
      ...data,
      authorId: session.user.id, // Assuming session.user.id holds the user's ID
    };

    const report = await prisma.report.create({
      data: reportDataWithAuthor,
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

// ... (your existing GET function)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const search = url.searchParams.get('search') || '';
    const filter = url.searchParams.get('filter') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'arrivalDate';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { ladlePassportNumber: { contains: search, mode: 'insensitive' } },
      ];
      const searchNum = parseInt(search, 10);
      if (!isNaN(searchNum)) {
        whereClause.OR.push({ meltNumber: searchNum });
      }
    }

    // Apply date filter
    if (filter !== 'all') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      if (filter === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      } else if (filter === 'week') {
        const currentDay = now.getDay();
        const diff = currentDay === 0 ? 6 : currentDay - 1;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - diff);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
      } else if (filter === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      }

      if (startDate! && endDate!) {
        whereClause.arrivalDate = {
          gte: startDate,
          lt: endDate,
        };
      }
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        ladlePassportNumber: true,
        arrivalDate: true,
        pouringHandoverDateTime: true,
        operatorName: true,
        meltNumber: true,
        meltUnrs: true,
        meltStartDateTime: true,
        meltLadleStability: true,
        // Include author if you want to display author details in GET requests
        // author: {
        //   select: {
        //     id: true,
        //     name: true,
        //     email: true,
        //   },
        // },
      },
    });

    const totalReports = await prisma.report.count({
      where: whereClause,
    });

    return NextResponse.json({ reports, totalReports }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}