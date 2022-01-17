import React, { useEffect, useRef } from "react";
import { Animator } from "../dsl/animator";

const Viewer = ({ shapes, animations }) => {
  const canvas = useRef(null);

  useEffect(() => {
    const animator = new Animator(shapes, animations, canvas.current);
    window.requestAnimationFrame((timestamp) => {
      animator.shapes.forEach((shape) => {
        shape.startTime = timestamp || new Date().getTime();
      });
      animator.animate(timestamp);
    });

    // Make it visually fill the positioned parent
    canvas.current.style.width = "100%";
    canvas.current.style.height = "100%";
    // ...then set the internal size to match
    canvas.current.width = canvas.current.offsetWidth;
    canvas.current.height = canvas.current.offsetHeight;
  }, [shapes, animations]);

  return (
    <div className="h-full w-full">
      <div className="border-2 h-full">
        <canvas id="canvas" ref={canvas}></canvas>
      </div>
    </div>
  );
};

export default Viewer;
