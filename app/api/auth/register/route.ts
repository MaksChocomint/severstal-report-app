// app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Пользователь создан успешно", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
