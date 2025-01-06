import { useState, useEffect } from "react";
import { Point } from "../types";

export const usePatternTracker = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [pattern, setPattern] = useState<Point[]>([]);

  const handleMouseDown = (ev: MouseEvent | TouchEvent) => {
    let x, y;
    if ("touches" in ev) {
      const touch = ev.touches[0];
      [x, y] = [touch.clientX, touch.clientY];
    } else {
      [x, y] = [ev.clientX, ev.clientY];
    }

    setIsDrawing(true);
    setPattern([{ x, y }]);
  };

  const handleMouseMove = (ev: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;

    let x, y;
    if ("touches" in ev) {
      const touch = ev.touches[0];
      [x, y] = [touch.clientX, touch.clientY];
    } else {
      [x, y] = [ev.clientX, ev.clientY];
    }

    setPattern((prevPattern) => [...prevPattern, { x, y }]);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDrawing]);

  return { pattern, isDrawing };
};
