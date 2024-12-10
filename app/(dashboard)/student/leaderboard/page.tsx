import { auth } from "@/auth"
import prisma from "@/lib/prisma";
import { Trophy } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { redirect } from "next/navigation";

const Leaderboard = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const role = user?.user.role;

  if (role !== "student") {
    return redirect("/auth/signin");
  }

  if (!userId) {
    return redirect("/auth/signin");
  }

  const joinedClasses = await prisma.joined.findMany({
    where: { studentId: Number(userId) },
    include: {
      class: {
        include: {
          instructor: true,
        },
      },
    },
    orderBy: {
      joinedAt: 'desc',
    },
  });

  console.log(joinedClasses)

  // Example data for user progress and top students
  const userName = "John Doe";
  const userSchool = "MNCHS";
  const userID = "12345";
  const userPoints = 200;

  const topStudents = [
    { name: "Alice", points: 300 },
    { name: "Bob", points: 250 },
    { name: "Charlie", points: 220 },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-100 min-h-screen"></div>
  );
};

export default Leaderboard;