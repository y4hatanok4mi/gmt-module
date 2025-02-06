"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ModuleCompletionProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
}

const ModuleCompletion = ({ params }: ModuleCompletionProps) => {
  const { moduleId, lessonId } = params;
  const router = useRouter();
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  useEffect(() => {
    const fetchLessonStatus = async () => {
      try {
        const response = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/status`
        );
        setIsLessonCompleted(response.data.isCompleted);
      } catch (error) {
        console.error("Error fetching lesson status:", error);
      }
    };

    fetchLessonStatus();
  }, [moduleId, lessonId]);

  const checkAndCompleteModule = async () => {
    try {
      const lessonsResponse = await axios.get(
        `/api/modules/${moduleId}/get-complete-lessons`
      );

      const lessons = lessonsResponse.data;
      const allLessonsCompleted = lessons.every(
        (lesson: any) => lesson.isCompleted
      );

      if (allLessonsCompleted && lessons.length > 0) {
        await axios.post(`/api/modules/${moduleId}/complete`);
        toast.success("Module completed! 🎉");
      }

      router.push(`/student/modules/${moduleId}/overview`);
    } catch (error) {
      console.error("Error checking module completion:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <Image width={300} height={300} src="/three-stars.png" alt="Stars" />
        <h1 className="text-2xl">Congratulations! Module Completed!</h1>
        <p className="mt-4 text-md text-slate-600">
          You finally reached the end of the module!
        </p>
        <p className="mt-2 text-md text-slate-600">Well done!</p>

        {!isLessonCompleted && (
          <div className="flex flex-row items-center gap-2 p-4">
            <Image width={50} height={50} src="/star.png" alt="Stars" />
            <p className="text-slate-600">+10 points</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center p-8 bg-white shadow-lg fixed bottom-0 left-0 right-0 z-10">
        <Button onClick={checkAndCompleteModule} className="w-60">
          Complete
        </Button>
      </div>
    </div>
  );
};

export default ModuleCompletion;
