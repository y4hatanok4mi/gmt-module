import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  try {
    const moduleId = params.moduleId;
    if (!moduleId) {
      return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
    }

    const user = await auth();
    const userId = user?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { 
        moduleId, 
        isPublished: true 
      },
      orderBy: { createdAt: "desc" } // Optional: Fetch latest lessons first
    });

    return NextResponse.json(
      { message: "Lessons fetched successfully!", lessons },
      { status: 200 }
    );
  } catch (err) {
    console.error("[LESSONS_GET]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};