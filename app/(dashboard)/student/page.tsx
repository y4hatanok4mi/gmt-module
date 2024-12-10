import { auth } from "@/auth"
import prisma from "@/lib/prisma";
import { Trophy } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { redirect } from "next/navigation";

const LearningPage = async () => {
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
  const userName = "JL Cyrus Uma";
  const userSchool = "Marinduque Academy";
  const userID = "21B1588";
  const userPoints = 150;

  const topStudents = [
    { name: "JC Rejehi", points: 300 },
    { name: "JPeter Himas", points: 250 },
    { name: "Jay Run Lantala", points: 220 },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-100 ">
      {/* Div 1: User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-1 p-4 rounded-xl mx-auto min-h-36">
        <Image
          src="/user.png"
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{userName}</p>
          <p className="text-sm text-gray-600">{userSchool} JHS</p>
          <p className="text-sm text-gray-600">{userID}</p>
          <p className="text-sm text-gray-600">{userPoints} pt</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Div 2: Lesson Progress */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Lesson Progress</h3>
            <a href="/student/lessons" className="text-white py-1 px-4 rounded-md bg-green-500">Manage</a>
          </div>
          <div className="space-y-4">
            {/* Volume Progress */}
            <div className="relative w-full bg-gray-300 h-8 rounded-md">
              <div
                className="absolute top-0 left-0 h-8 rounded-md"
                style={{
                  width: "70%",
                  backgroundColor: "#61e8e1",
                }}
              />
              <p className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                Volume: 70%
              </p>
            </div>

            {/* Angel Progress */}
            <div className="relative w-full bg-gray-300 h-8 rounded-md">
              <div
                className="absolute top-0 left-0 h-8 rounded-md"
                style={{
                  width: "50%",
                  backgroundColor: "#f25757",
                }}
              />
              <p className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                Angel: 50%
              </p>
            </div>

            {/* Shapes Progress */}
            <div className="relative w-full bg-gray-300 h-8 rounded-md">
              <div
                className="absolute top-0 left-0 h-8 rounded-md"
                style={{
                  width: "85%",
                  backgroundColor: "#f2e863",
                }}
              />
              <p className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                Shapes: 85%
              </p>
            </div>

            {/* Area Progress */}
            <div className="relative w-full bg-gray-300 h-8 rounded-md">
              <div
                className="absolute top-0 left-0 h-8 rounded-md"
                style={{
                  width: "85%",
                  backgroundColor: "#f2cd60",
                }}
              />
              <p className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                Area: 85%
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Div 3: Tools */}
          <h3 className="font-semibold text-lg mb-1">Tools</h3>
          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow">
            <a href="/student/tools/angle" className="h-20 w-full text-white rounded-lg btn btn-primary" style={{ backgroundColor: "#f25757" }}>Tool 1</a>
            <a href="/student/tools/angle-pairs" className="h-20 w-full text-white rounded-lg btn btn-primary" style={{ backgroundColor: "#F58585" }}>Tool 2</a>
            <a href="/student/tools/area" className="h-20 w-full text-white rounded-lg btn btn-primary" style={{ backgroundColor: "#f2cd60" }}>Tool 3</a>
            <a href="/student/tools/volume" className="h-20 w-full text-white rounded-lg btn btn-primary" style={{ backgroundColor: "#61e8e1" }}>Tool 4</a>
          </div>

          {/* Div 4: Top Students */}
          <h3 className="font-semibold text-lg mb-1 ">Top Students</h3>
          <div className="bg-white p-4 rounded-xl shadow">
            <ul className="space-y-2">
              {topStudents.map((student, index) => (
                <li key={index} className="flex items-center gap-4 text-sm">
                  <Trophy className="text-gray-700" />
                  <span className="flex-1">{student.name}</span>
                  <span>{student.points} points</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage