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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const search = url.searchParams.get('search') || '';
    const filter = url.searchParams.get('filter') || 'all'; // 'all', 'today', 'week', 'month'
    const sortBy = url.searchParams.get('sortBy') || 'arrivalDate'; // Default sort field
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'; // Default sort order

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
        // Calculate the start of the current week (Monday)
        const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
        const diff = currentDay === 0 ? 6 : currentDay - 1; // Days to subtract to get to Monday
        startDate = new Date(now);
        startDate.setDate(now.getDate() - diff);
        startDate.setHours(0, 0, 0, 0); // Start of the day

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7); // End of the week (start of next Monday)
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
        [sortBy]: sortOrder, // Use dynamic sort field and order
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