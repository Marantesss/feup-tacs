import React, { useEffect, useRef } from "react";
import { Animator, Keyframe, Shape } from "../dsl/animator";

interface Props {
  shapes?: Array<Shape>;
  animations: Map<string, Keyframe>;
  shouldRun: boolean;
}

const Viewer = ({ shapes, animations, shouldRun }: Props) => {
  const canvas = useRef(null);

  useEffect(() => {
    if (!shouldRun || shapes.length === 0) {
      return;
    }
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
  }, [shapes, animations, shouldRun]);

  return (
    <div className="h-full w-full">
      <div className="border-2 h-full">
        <canvas id="canvas" ref={canvas}></canvas>
      </div>
    </div>
  );
};

export default Viewer;
