import { useEffect, useRef } from "react";
import p5 from "p5";

const ShapeVisualization = ({
    shape,
    side = 100, // Set default value for side (if undefined)
    height = 100, // Set default value for height (if undefined)
    radius = 50, // Set default value for radius (if undefined)
}: {
  shape: string;
  side?: number;
  height?: number;
  radius?: number;
}) => {
  const canvasRef = useRef<HTMLDivElement>(null); // Use ref to attach the canvas

  useEffect(() => {
    // Initialize p5.js sketch
    const sketch = (p: p5) => {
      p.setup = () => {
        if (canvasRef.current) {
          p.createCanvas(1000, 800, p.WEBGL).parent(canvasRef.current); // Increase canvas size
        }
      };

      p.draw = () => {
        p.background(200);

        // Apply rotation for dynamic effect
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);

        // Render shape based on selected type
        if (shape === "cube") {
          p.box(side * 30 || 300); // Scale up the cube by multiplying side by 30
        } else if (shape === "cylinder") {
          p.cylinder(radius * 3 || 150, height * 3 || 300); // Scale up the cylinder's radius and height
        } else if (shape === "cone") {
          p.cone(radius * 3 || 150, height * 3 || 300); // Scale up the cone's radius and height
        }
      };
    };

    // Create a new p5 instance and bind it to the ref
    const newP5Instance = new p5(sketch);

    // Cleanup the P5 instance when the component unmounts
    return () => {
      newP5Instance.remove();
    };
  }, [shape, side, height, radius]); // Update the sketch when these props change

  return <div ref={canvasRef}></div>; // The canvas will be rendered inside this div
};

export { ShapeVisualization };
