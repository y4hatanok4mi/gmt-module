import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import ClassCard from "@/components/classes/class-card-teacher";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";  // Import Link for navigation

const ClassesPage = async () => {

  const session = await auth();
  const role = session?.user.role;
  const instructorId = session?.user.id;

  if (role !== "teacher") {
    return redirect("/auth/signin");
  }

  const classes = await prisma.class.findMany({
    where: {
      instructorId: Number(instructorId),
    },
    include: {
      instructor: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  

  console.log(classes)

  return (
    <div>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Homepage</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Create Class Button */}
        <div className="flex justify-end p-4">
          <Link
            href="/teacher/classes/create-class"  // Link to the class creation page
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Create Class
          </Link>
        </div>

        {/* Display Classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-5">
          {classes.map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>
      </SidebarInset>
    </div>
  );
};

export default ClassesPage;