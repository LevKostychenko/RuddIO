import { Point } from "../types";

export const usePatternCompare = () => {
  const normalizePatternCoordinates = (
    pattern: Point[],
    width: number,
    height: number
  ): Point[] => {
    return pattern.map((point) => ({
      x: point.x / width,
      y: point.y / height,
    }));
  };

  const normalizePattern = (pattern: Point[]): Point[] => {
    if (pattern.length === 0) return pattern;

    const centerX = pattern.reduce((sum, p) => sum + p.x, 0) / pattern.length;
    const centerY = pattern.reduce((sum, p) => sum + p.y, 0) / pattern.length;
    const centered = pattern.map((p) => ({
      x: p.x - centerX,
      y: p.y - centerY,
    }));

    const maxDistance = Math.sqrt(
      Math.max(...centered.map((p) => p.x ** 2 + p.y ** 2))
    );
    const scaled = centered.map((p) => ({
      x: p.x / maxDistance,
      y: p.y / maxDistance,
    }));

    const angle = Math.atan2(scaled[0].y, scaled[0].x);
    const aligned = scaled.map((p) => ({
      x: p.x * Math.cos(-angle) - p.y * Math.sin(-angle),
      y: p.x * Math.sin(-angle) + p.y * Math.cos(-angle),
    }));

    return aligned;
  };

  const comparePatterns = (
    normalizedPattern1: Point[],
    normalizedPattern2: Point[],
    threshold: number = 0.3
  ): boolean => {
    normalizedPattern1 = normalizePattern(normalizedPattern1);
    normalizedPattern2 = normalizePattern(normalizedPattern2);

    const distance = hausdorffDistance(normalizedPattern1, normalizedPattern2);
    console.log(distance);
    return distance < threshold;
  };

  const hausdorffDistance = (pattern1: Point[], pattern2: Point[]): number => {
    const euclideanDistance = (p1: Point, p2: Point): number =>
      Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    const directedHausdorff = (A: Point[], B: Point[]): number =>
      Math.max(
        ...A.map((a) => Math.min(...B.map((b) => euclideanDistance(a, b))))
      );

    return Math.max(
      directedHausdorff(pattern1, pattern2),
      directedHausdorff(pattern2, pattern1)
    );
  };

  return {
    comparePatterns,
    normalizePatternCoordinates,
  };
};
