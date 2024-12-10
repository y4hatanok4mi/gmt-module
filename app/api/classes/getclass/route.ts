import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const user = await auth();
    const id = user?.user.id;

    if (!id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch classes created by the user (teacher)
    const classes = await prisma.class.findMany({
      where: { instructorId: Number(id) },
      select: {
        id: true,
        name: true,
        section: true,
        description: true,
        code: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return the fetched classes
    return NextResponse.json(
      { message: "Classes fetched successfully!", classes },
      { status: 200 }
    );
  } catch (err) {
    console.error("[classes_GET]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};