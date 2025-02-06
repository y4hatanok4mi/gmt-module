import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string; lessonId: string } }
) => {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { moduleId, lessonId } = params;

    // Fetch module data
    const moduleData = await prisma.module.findUnique({
      where: {
        id: moduleId,
      },
    });

    if (!moduleData) {
      return new NextResponse("Module Not Found", { status: 404 });
    }

    // Fetch lesson data
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        moduleId,
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson Not Found", { status: 404 });
    }

    // Check if the lesson is already completed
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId,
        },
      },
    });

    if (existingProgress && existingProgress.isCompleted) {
      // Skip adding points if the lesson is already completed
      return NextResponse.json(
        { message: "Lesson already completed, no points awarded." },
        { status: 200 }
      );
    }

    // Mark the lesson as completed
    const updatedLesson = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        isCompleted: true,
      },
    });

    // Add points to the user only if the lesson is not completed
    const userData = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        points: {
          increment: 10, // Increment points by 10
        },
      },
    });

    // Update or create progress for the lesson
    let progress = existingProgress;

    if (progress) {
      progress = await prisma.lessonProgress.update({
        where: {
          userId_lessonId: {
            userId: userId,
            lessonId,
          },
        },
        data: {
          isCompleted, // Update progress with the completion status
        },
      });
    } else {
      progress = await prisma.lessonProgress.create({
        data: {
          userId: userId,
          lessonId,
          isCompleted, // Create new progress with the completion status
        },
      });
    }

    // Unlock the next lesson in the module
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    const nextLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: moduleId,
        order: {
          gt: currentLesson?.order,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    if (nextLesson) {
      await prisma.lesson.update({
        where: { id: nextLesson.id },
        data: { isLocked: false },
      });

      return NextResponse.json(
        { progress, updatedLesson, userData, message: "Next lesson unlocked!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { progress, updatedLesson, userData, message: "No more lessons in this module." },
        { status: 200 }
      );
    }
  } catch (err) {
    console.log("[lessonId_progress_unlock_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
