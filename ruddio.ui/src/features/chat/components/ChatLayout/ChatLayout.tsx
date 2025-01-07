import { Button } from "@mui/material";
import { usePatternCompare, usePatternTracker } from "../../../shared/hooks";
import { PatternInput } from "@/features/account/components/PatternInput";
import { useEffect, useState } from "react";
import { Point } from "@/features/shared/types";

export const ChatLayout = () => {
  const { pattern } = usePatternTracker();
  const { comparePatterns } = usePatternCompare();
  const [origPatten, setPattern] = useState<Point[]>([]);

  useEffect(() => {
    if (origPatten.length && pattern.length > 1) {
      const isEqual = comparePatterns(origPatten, pattern);
      console.log(isEqual);
    }
  }, [pattern]);

  return (
    <>
      <div>
        <div>
          <Button variant="contained">Hello world</Button>
        </div>
      </div>
      <PatternInput
        onPatternComplete={(normalizedPattern) => {
          setPattern(normalizedPattern);
        }}
      />
    </>
  );
};
