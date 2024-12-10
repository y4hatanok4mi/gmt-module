import prisma from "@/lib/prisma";
import { Course } from "@prisma/client";
import { CalendarClock, CalendarRange } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

type ClassData = {
  classId: string;
};

type CourseCardProps = {
  course: Course;
};

const CourseCard = async ({ course }: CourseCardProps) => {
  const classId = course.classId;

  if (!classId) {
    console.warn("classData or classId is missing");
  } else {
    console.log("Class ID:", classId);
  }

  const instructor = await prisma.user.findUnique({
    where: { id: Number(course.instructorId) },
  });

  let quarter;
  if (course.quarterId) {
    quarter = await prisma.quarter.findUnique({
      where: { id: course.quarterId },
    });
  }

  let week;
  if (course.weekId) {
    week = await prisma.week.findUnique({
      where: { id: course.weekId },
    });
  }

  const publishedSections = await prisma.section.findMany({
    where: { courseId: course.id, isPublished: true },
  });
  const publishedSectionIds = publishedSections.map((section) => section.id);

  const completedSections = await prisma.progress.count({
    where: {
      sectionId: { in: publishedSectionIds },
      isCompleted: true,
    },
  });

  const progressPercentage = publishedSectionIds.length
    ? (completedSections / publishedSectionIds.length) * 100
    : 0;

  return (
    <Link
      href={`/student/classes/${classId}/courses/${course.id}/overview`}
      className="border rounded-lg cursor-pointer"
    >
      <Image
        src={course.imageUrl ? course.imageUrl : "/image_placeholder.webp"}
        alt={course.title}
        width={500}
        height={300}
        className="rounded-t-xl w-[320px] h-[180px] object-cover"
      />

      {/* Course Info */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:[#FDAB04]">{course.title}</h2>

        {/* Instructor and Quarter */}
        <div className="flex flex-col gap-1 justify-between text-sm font-medium">
          {instructor && (
            <div className="flex gap-2 items-center">
              <Image
                src={instructor.image ? instructor.image : "/user.png"}
                alt={instructor.name ? instructor.name : "Instructor photo"}
                width={30}
                height={30}
                className="rounded-full"
              />
              <p>{instructor.name}</p>
            </div>
          )}

          <div className="flex gap-2 ml-1">
            {quarter && (
              <div className="flex gap-2">
                <CalendarRange size={20} />
                <p>{quarter.name}</p>
              </div>
            )}
            {week && (
              <div className="flex gap-2">
                <CalendarClock size={20} />
                <p>{week.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs mt-1">
            {Math.round(progressPercentage)}% completed
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;