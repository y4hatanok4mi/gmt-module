import { notFound, redirect } from "next/navigation";
import {
    SidebarInset,
    SidebarTrigger
} from '@/components/ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@radix-ui/react-separator';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NotebookPen } from "lucide-react";
import { OptionsForm } from "@/components/exercises/options-form";
import { QuestionQuestionForm } from "@/components/exercises/title-form";

const ExercisePage = async ({
    params
}: {
    params: { moduleId: string; lessonId: string; questionId: string }
}) => {

    const { moduleId, lessonId, questionId } = params;

    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
        return redirect("/auth/signin");
    }

    const modules = await prisma.module.findUnique({
        where: {
            id: moduleId,
        },
    });

    if (!moduleId) {
        notFound();
    }

    const question = await prisma.question.findUnique({
        where: {
            id: questionId,
        },
        include: {
            options: true,
        }
    });

    if (!question) {
        notFound();
    }

    const requiredFields = [
        question?.question,
        /*     lesson.lesson.some((lesson) => lesson.isPublished), */
    ];

    const requiredFieldsCount = requiredFields.length;
    const missingFields = requiredFields.filter((field) => !Boolean(field));
    const missingFieldsCount = missingFields.length;
    const isCompleted = requiredFields.every(Boolean);

    console.log("Required Fields:", requiredFields);
    console.log("Missing Fields:", missingFields);
    console.log("Missing Fields Count:", missingFieldsCount);
    console.log("Required Fields Count:", requiredFieldsCount);

    return (
        <div>
            <div>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/admin/data-management/modules/${moduleId}/lessons/${lessonId}`}>{modules?.name}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/admin/data-management/modules/${moduleId}/lessons/${lessonId}`}>Lesson Management</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Question Management</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="px-6 pb-6">
                        <h1 className="text-2xl font-bold">Question Setup</h1>
{/*                         <div className="flex gap-5 items-start justify-end">
                                <QuestionPublishButton
                                    disabled={!isCompleted}
                                    lessonId={lessonId}
                                    moduleId={moduleId}
                                    questionId={questionId}
                                    page="Exercise"
                                />
                                <Delete
                                    item="question"
                                    lessonId={lessonId}
                                    moduleId={moduleId}
                                />
                            </div> */}
                        <div className="gap-6 mt-4">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <NotebookPen className="size-8" />
                                    <h2>Customize question</h2>
                                </div>
                                <QuestionQuestionForm
                                    initialData={question}
                                    lessonId={lessonId}
                                    moduleId={moduleId}
                                    questionId={questionId}
                                />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </div>
    );
};

export default ExercisePage;