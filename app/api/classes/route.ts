import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Authenticate the user
    const user = await auth();
    const id = user?.user.id;

    if (!id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, section, description, imageUrl } = await req.json();
    if (!name || !section || !description || !imageUrl) {
      return NextResponse.json({ message: "Missing required fields!" }, { status: 400 });
    }

    const [trimmedName, trimmedSection, trimmedDescription] = [name, section, description].map((field) => field.trim());

    const newClass = await prisma.class.create({
      data: {
        name: trimmedName,
        section: trimmedSection,
        description: trimmedDescription,
        imageUrl: imageUrl,
        instructorId: Number(id),
        isCreated: true,
      },
    });

    const generateUniqueCode = async (): Promise<string> => {
      let code: string;
      let exists: boolean;

      do {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
        exists = !!(await prisma.class.findUnique({ where: { code } }));
      } while (exists);

      return code;
    };

    const uniqueCode = await generateUniqueCode();

    // Update the class with the unique code
    const updatedClass = await prisma.class.update({
      where: { id: newClass.id },
      data: { code: uniqueCode },
    });

    // Return a success response
    return NextResponse.json(
      { message: "Class created successfully!", class: updatedClass },
      { status: 201 }
    );
  } catch (err) {
    console.error("[classes_POST]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
