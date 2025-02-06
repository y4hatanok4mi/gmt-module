// Inside your API route for unlocking lessons
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string; lessonId: string } }
) => {
  try {
    const { userId } = await req.json();
    const { moduleId, lessonId } = params;

    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        isLocked: false,
      },
    });

    return NextResponse.json(lesson, { status: 200 });
  } catch (err) {
    console.log("[lesson_unlock_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
