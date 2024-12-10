import { auth } from "@/auth";
import CourseCard from "@/components/courses/course-card";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AngleClassCard from "@/components/lessons/angle-class-card";
import AnglePClassCard from "@/components/lessons/anglep-class-card";
import AreaClassCard from "@/components/lessons/area-class-card";
import VolumeClassCard from "@/components/lessons/volume-class-card";

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

  return (
    <div className="min-h-screen">
        <div className="px-4 py-4 md:mt-2 md:px-10 xl:px-12">
          <div className="flex flex-col items-center py-2 w-full text-center">
            <h1 className="text-2xl font-semibold text-gray-700">Interactive Lessons:</h1>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <AngleClassCard />
            <AnglePClassCard />
            <AreaClassCard />
            <VolumeClassCard />
          </div>
        </div>
    </div>
  );
};

export default LearningPage;