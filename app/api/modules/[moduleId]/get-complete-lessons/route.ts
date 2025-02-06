import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path to your prisma instance

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  const { moduleId } = params;

  try {
    // Fetch all lessons in the module, regardless of completion status
    const lessons = await prisma.lesson.findMany({
      where: { 
        moduleId: moduleId,
        isPublished: true, // Ensure it's a published lesson
      },
      select: { 
        id: true, 
        isCompleted: true, 
        isPublished: true,
      },
    });

    // Return the lessons data
    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}
