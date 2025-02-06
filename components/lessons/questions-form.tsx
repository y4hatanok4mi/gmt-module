"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Question, Lesson } from "@prisma/client";
import { Input } from "../ui/input";
import { QuestionsList } from "../exercises/questions-list";


interface QuestionsFormProps {
    initialData: Lesson & { question: Question[] };
    lessonId: string;
    moduleId: string;
};

const formSchema = z.object({
    question: z.string().min(1),
});

export const QuestionsForm = ({
    initialData,
    lessonId,
    moduleId
}: QuestionsFormProps) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = ( ) => setIsCreating((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/modules/${moduleId}/lessons/${lessonId}/questions`, values);
            toast.success("Lesson updated!")
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const onEdit = (id: string) => {
        router.push(`/admin/data-management/modules/${moduleId}/lessons/${lessonId}/questions/${id}`);
    }

    return (
        <div className="my-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson Questions
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                            Add a question
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        disabled={isSubmitting}
                                        placeholder="e.g.: What do you call a..."
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} 
                        />
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Add
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating &&(
                <div className={cn(
                    "text-sm mt-2",
                    !initialData?.question.length && "text-slate-500 italic"
                )}>
                   {!initialData?.question.length && "No questions"}
                   <QuestionsList
                   onEdit={onEdit}
                   items={initialData.question || []}
                   />
                </div>
            )}
        </div>
    )
}
