import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image"; // For displaying the module image or icon
import { CirclePlay } from "lucide-react";

export const ModuleCard = async () => {
  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const startedModules = await prisma.joined.findMany({
    where: {
      studentId: Number(userId),
    },
    include: {
      module: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          isCompleted: true,
        },
      },
    },
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full min-h-52">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Modules Progress</h3>
        <Link
          href="/student/modules"
          className="text-green-600 font-extrabold py-1 px-4 hover:text-green-800 hover:bg-slate-300 rounded-md transition-colors duration-200"
        >
          View All
        </Link>
      </div>
      <div className="flex flex-col"> {/* Added gap between modules */}
        {startedModules.length === 0 ? (
          <div className="flex justify-center items-center text-gray-500">
            No modules started yet.
          </div>
        ) : (
          startedModules.map((moduleJoin, index) => {
            const { isCompleted, name, imageUrl, id } = moduleJoin.module;
            const statusText = isCompleted ? "Completed" : "In Progress";

            return (
              <Link key={index} href={`/student/modules/${id}/overview`} passHref>
                <div className="flex items-center justify-between px-4 relative w-full bg-slate-100 h-24 rounded-md cursor-pointer hover:bg-slate-200 mb-4">
                  {/* Icon or Default Icon */}
                  <div>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={name}
                        width={80}
                        height={80}
                        className="rounded-full object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">?</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{name}</p>
                    <p className="text-xs text-gray-500">{statusText}</p>
                  </div>
                  <CirclePlay className="h-8 w-8" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
