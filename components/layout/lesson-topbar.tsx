"use client";

import { X } from 'lucide-react';
import Link from 'next/link';

interface LessonTopbarProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
  lessonName: string;
}

export const LessonTopBar = ({ params, lessonName }: LessonTopbarProps) => {
  const { moduleId } = params;

  return (
    <header className="p-5 flex items-center bg-gray-200 w-full">
      <div className="flex flex-row justify-between w-full">
        <Link href={`/student/modules/${moduleId}/overview`} className='flex flex-row items-center'>
          <X className='h-4 w-4'/> Exit
        </Link>
        <div>{lessonName}</div>
        <div></div>
      </div>
    </header>
  );
};
