"use client"

import Quiz from '@/components/games/area-quiz';
import Shape from '@/components/games/area-shape';
import { useState } from 'react';

const AreaTool = () => {
  const [shape, setShape] = useState<'rectangle' | 'circle'>('rectangle');
  const [dimensions, setDimensions] = useState({ width: 100, height: 100, radius: 50 });

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Interactive Tool for Area</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShape('rectangle')}
          className={`px-4 py-2 rounded ${shape === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Rectangle
        </button>
        <button
          onClick={() => setShape('circle')}
          className={`px-4 py-2 rounded ${shape === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Circle
        </button>
      </div>

      <Shape shape={shape} dimensions={dimensions} setDimensions={setDimensions} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Formula:</h2>
        {shape === 'rectangle' && (
          <p>
            Area = Width × Height = {dimensions.width} × {dimensions.height} ={' '}
            <b>{(dimensions.width * dimensions.height).toFixed(2)}</b>
          </p>
        )}
        {shape === 'circle' && (
          <p>
            Area = π × Radius² = 3.14 × {dimensions.radius}² ={' '}
            <b>{(Math.PI * dimensions.radius ** 2).toFixed(2)}</b>
          </p>
        )}
      </div>
      
    </div>
  );
};

export default AreaTool;
