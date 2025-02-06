import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  try {
    const { moduleId } = params;
    const user = await auth();
    const userIdString = user?.user.id; // userId from auth is a string

    if (!userIdString) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Convert userId to number if it's a string
    const userId = parseInt(userIdString);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Fetch total number of published lessons
    const totalPublishedLessons = await prisma.lesson.count({
      where: { moduleId, isPublished: true },
    });

    // Fetch total number of completed published lessons by the current user
    const completedLessons = await prisma.lesson.count({
      where: {
        moduleId,
        isPublished: true,
        isCompleted: true,
      },
    });

    // Check if all published lessons are completed
    if (completedLessons === totalPublishedLessons && totalPublishedLessons > 0) {
      // Check if the module has already been marked as completed by the user
      const existingCompletedModule = await prisma.completedModule.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId,
          },
        },
      });

      if (!existingCompletedModule) {
        // Insert record into CompletedModule table
        await prisma.completedModule.create({
          data: {
            userId,
            moduleId,
          },
        });

        // Mark the module as completed
        await prisma.module.update({
          where: { id: moduleId },
          data: { isCompleted: true },
        });

        return NextResponse.json({ message: "Module marked as completed." }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Module already marked as completed by the user." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Not all published lessons are completed.",
        completedLessons,
        totalPublishedLessons,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error marking module as complete:", error);
    return NextResponse.json({ error: "Failed to mark module as complete" }, { status: 500 });
  }
};
