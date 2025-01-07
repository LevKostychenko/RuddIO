import { Point } from "@/features/shared/types";
import React, { useState, useRef, useEffect } from "react";

interface IPatternInputProps {
  onPatternComplete: (normalizedPattern: Point[]) => void;
}

export const PatternInput = ({ onPatternComplete }: IPatternInputProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [pattern, setPattern] = useState<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = 500;
  const canvasHeight = 500;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getRelativeCoordinates(e, canvas);
    setIsDrawing(true);
    setPattern([{ x, y }]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getRelativeCoordinates(e, canvas);
    setPattern((prevPoints) => [...prevPoints, { x, y }]);

    const lastPoint = pattern[pattern.length - 1];
    if (lastPoint) {
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000";

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    onPatternComplete(pattern);
  };

  const getRelativeCoordinates = (
    event: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in event) {
      const touch = event.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    return { x, y };
  };

  useEffect(() => {
    if (canvasRef.current && !pattern.length) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [pattern]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: "1px solid #000",
          cursor: "crosshair",
          touchAction: "none",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};
