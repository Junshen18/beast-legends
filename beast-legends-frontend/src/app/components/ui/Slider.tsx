"use client";
interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

export function Slider({ min, max, step, value, onValueChange }: SliderProps) {
  return (
    <div className="relative w-full h-6 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([Number(e.target.value), value[1]])}
        className="absolute w-full"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        onChange={(e) => onValueChange([value[0], Number(e.target.value)])}
        className="absolute w-full"
      />
    </div>
  );
} 