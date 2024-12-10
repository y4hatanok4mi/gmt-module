import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import CreateSectionForm from "@/components/sections/section-create";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CourseCurriculumPage = async ({ params }: { params: { courseId: string, classId: string } }) => {
  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin")
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
    include: {
      sections: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect(`/teacher/classes/${params.classId}/courses/`)
  }

  return (
    <div>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses`}>Data Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses/${params.courseId}/basic`}>Lesson Creation</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Contents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex items-center justify-between px-8">
          <div>
          <Breadcrumb>
              <BreadcrumbList>
                <ChevronLeft/>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses/${course.id}/basic`}>Lesson Information</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses/${course.id}/exercises`}>Exercises</BreadcrumbLink>
                </BreadcrumbItem>
                <ChevronRight />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <CreateSectionForm course={course} />
      </SidebarInset>
    </div>
  );
}

export default CourseCurriculumPage;