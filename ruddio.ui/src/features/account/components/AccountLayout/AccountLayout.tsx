import { PatternInput } from "../PatternInput";

export const AccountLayout = () => {
  return (
    <div>
      <PatternInput
        onPatternComplete={(pattern) => {
          console.log(pattern);
        }}
      />
    </div>
  );
};
