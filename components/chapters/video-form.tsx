"use client"

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import FileUpload from "../file-upload";


interface ChapterVideoFormProps {
    initialData: Chapter;
    chapterId: string;
    lessonId: string;
    moduleId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

export const ChapterVideoForm = ({
    initialData,
    chapterId,
    lessonId,
    moduleId
}: ChapterVideoFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video (optional)
                <div className="flex gap-2">
                    <Button onClick={toggleEdit} variant={"ghost"}>
                        {isEditing && (
                            <>Cancel</>
                        )}
                        {!isEditing && !initialData.videoUrl && (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add a video
                            </>
                        )}
                        {!isEditing && initialData.videoUrl && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </>
                        )}
                    </Button>
                    {initialData.videoUrl && !isEditing && (
                        <Button
                            onClick={async () => {
                                try {
                                    await axios.patch(
                                        `/api/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`,
                                        { videoUrl: null }
                                    );
                                    toast.success("Video deleted!");
                                    router.refresh();
                                } catch {
                                    toast.error("Failed to delete the image!");
                                }
                            }}
                            variant="ghost"
                        >
                            <Trash className="h-4 w-4 mr-2 text-red-500" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <video
                            controls
                            className="object-cover rounded-md w-full h-full"
                            src={initialData.videoUrl}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}