'use client';

import AngleCanvas from '@/components/games/angle-canvas';
import Quiz from '@/components/games/angle-quiz';
import { useState } from 'react';

const AnglesTool = () => {
  const [angle, setAngle] = useState<number>(45); // Default to an acute angle

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mt-5 mb-7 text-center">Interactive Tool for Angles</h1>

      <div className="w-full max-w-md mb-8 flex justify-center">
        <AngleCanvas angle={angle} />
      </div>

      <div className="w-full max-w-md mb-8">
        <div className="mt-2">
          <label className="block mb-2 font-semibold">Adjust Angle (degrees):</label>
          <input
            type="range"
            min="0"
            max="180"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <p className="mt-2 text-center">{angle}°</p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Angle Type:</h2>
        <p className="text-lg">
          {angle === 90 && 'This is a Right Angle.'}
          {angle < 90 && angle > 0 && 'This is an Acute Angle.'}
          {angle > 90 && angle < 180 && 'This is an Obtuse Angle.'}
          {angle === 180 && 'This is a Straight Angle.'}
          {angle === 0 && 'This is no angle (0°).'}
        </p>
      </div>
    </div>
  );
};

export default AnglesTool;
