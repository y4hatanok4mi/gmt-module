import { Dispatch, SetStateAction } from 'react';

interface ShapeProps {
  shape: 'rectangle' | 'circle';
  dimensions: { width: number; height: number; radius: number };
  setDimensions: Dispatch<SetStateAction<{ width: number; height: number; radius: number }>>;
}

const Shape = ({ shape, dimensions, setDimensions }: ShapeProps) => {
  return (
    <div className="flex flex-col items-center">
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="bg-gray-50 border border-gray-300 rounded mb-4"
      >
        {shape === 'rectangle' && (
          <rect
            x="50"
            y="50"
            width={dimensions.width}
            height={dimensions.height}
            fill="blue"
            stroke="black"
            strokeWidth="2"
          />
        )}
        {shape === 'circle' && (
          <circle
            cx="150"
            cy="150"
            r={dimensions.radius}
            fill="red"
            stroke="black"
            strokeWidth="2"
          />
        )}
      </svg>

      <div className="flex gap-4">
        {shape === 'rectangle' && (
          <>
            <div>
              <label className="block mb-2">Width</label>
              <input
                type="range"
                min="50"
                max="250"
                value={dimensions.width}
                onChange={(e) =>
                  setDimensions((prev) => ({ ...prev, width: parseInt(e.target.value, 10) }))
                }
                className="w-full"
              />
              <p>{dimensions.width} units</p>
            </div>
            <div>
              <label className="block mb-2">Height</label>
              <input
                type="range"
                min="50"
                max="250"
                value={dimensions.height}
                onChange={(e) =>
                  setDimensions((prev) => ({ ...prev, height: parseInt(e.target.value, 10) }))
                }
                className="w-full"
              />
              <p>{dimensions.height} units</p>
            </div>
          </>
        )}

        {shape === 'circle' && (
          <div>
            <label className="block mb-2">Radius</label>
            <input
              type="range"
              min="10"
              max="100"
              value={dimensions.radius}
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, radius: parseInt(e.target.value, 10) }))
              }
              className="w-full"
            />
            <p>{dimensions.radius} units</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shape;
