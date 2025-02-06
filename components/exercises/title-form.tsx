"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";
import { OptionsForm } from "./options-form";
import { Option } from "@prisma/client";
import { QuestionImageForm } from "../questions/question-image-form";

interface QuestionQuestionFormProps {
    initialData: {
        question: string;
    };
    lessonId: string;
    moduleId: string;
    questionId: string;
};

const formSchema = z.object({
    question: z.string().min(1, {
        message: "Question is required!",
    }),
});

export const QuestionQuestionForm = ({
    initialData,
    questionId,
    lessonId,
    moduleId
}: QuestionQuestionFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [questionData, setQuestionData] = useState({
        id: "",
        lessonId: lessonId, // Ensure lessonId is included
        question: "",
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        correctAnswer: null,
        options: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const { data } = await axios.get(`/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/getquestion`);

                setQuestionData({
                    id: data.id || "",
                    lessonId: data.lessonId || lessonId, // Ensure lessonId is set
                    question: data.question || "",
                    image: data.image || "",
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
                    correctAnswer: data.correctAnswer || null,
                    options: data.options || [],
                });
                router.refresh();

                setIsLoading(false);
            } catch (error) {
                toast.error("Failed to load question data");
                setIsLoading(false);
            }
        };

        fetchQuestionData();
    }, [moduleId, lessonId, questionId, router]);


    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`, values);
            toast.success("Question updated!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="my-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Question Title
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.question}
                </p>
            )}
            {isEditing && (
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
                                            placeholder="Chapter I"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            <QuestionImageForm
                initialData={questionData}
                moduleId={moduleId}
                lessonId={lessonId}
                questionId={questionId}
            />

            {/* Include the OptionsForm component here */}
            <OptionsForm
                initialData={questionData}
                moduleId={moduleId}
                lessonId={lessonId}
                questionId={questionId}
            />
        </div>
    );
};
