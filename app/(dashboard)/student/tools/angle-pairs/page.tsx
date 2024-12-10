'use client';

import AnglePairsCanvas from '@/components/games/angle-pair-canvas';
import Quiz from '@/components/games/angle-pair-quiz';
import { useState } from 'react';

const AnglePairsTool = () => {
  const [angle1, setAngle1] = useState<number>(60); // Default to an acute angle
  const [angle2, setAngle2] = useState<number>(120); // Default to a supplementary angle

  const getAnglePairType = (): string => {
    if (angle1 + angle2 === 90) return 'Complementary Angles';
    if (angle1 + angle2 === 180) return 'Supplementary Angles';
    if (angle1 === angle2) return 'Vertical Angles';
    return 'Adjacent Angles';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-5 mb-7">Interactive Tool for Angle Pairs</h1>

      <div className="w-full max-w-md mb-8 flex justify-center gap-4">
        <AnglePairsCanvas angle1={angle1} angle2={angle2} />

        <div className="mt-4 space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Adjust Angle 1 (degrees):</label>
            <input
              type="range"
              min="0"
              max="180"
              value={angle1}
              onChange={(e) => setAngle1(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <p className="mt-2 text-center">{angle1}°</p>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Adjust Angle 2 (degrees):</label>
            <input
              type="range"
              min="0"
              max="180"
              value={angle2}
              onChange={(e) => setAngle2(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <p className="mt-2 text-center">{angle2}°</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Angle Pair Relationship:</h2>
        <p className="text-lg">{getAnglePairType()}</p>
      </div>
      
    </div>
  );
};

export default AnglePairsTool;
