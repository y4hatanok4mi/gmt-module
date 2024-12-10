import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { JoinClassSchema } from "@/lib/schema";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const parsed = JoinClassSchema.safeParse({ code });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid class code!" },
        { status: 400 }
      );
    }

    const classData = await prisma.class.findUnique({
      where: { code: parsed.data.code },
    });

    if (!classData) {
      return NextResponse.json(
        { message: "Class not found with this code!" },
        { status: 404 }
      );
    }

    const user = await auth();

    if (!user || !user.user.id) {
      return NextResponse.json(
        { message: "Unauthorized: No user found." },
        { status: 401 }
      );
    }
    const studentId = user?.user.id;

    const existingJoin = await prisma.joined.findUnique({
      where: {
        studentId_classId: {
          studentId: Number(studentId),
          classId: classData.id,
        },
      },
    });

    if (existingJoin) {
      return NextResponse.json(
        { message: "You are already enrolled in this class" },
        { status: 400 }
      );
    }

    await prisma.joined.create({
      data: {
        studentId: Number(studentId),
        classId: classData.id,
      },
    });

    // Return the class ID to the frontend
    return NextResponse.json(
      { message: "Successfully joined the class.", classId: classData.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining class:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
