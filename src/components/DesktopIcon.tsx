import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick?: () => void;
}

export const DesktopIcon = ({ icon, label, onDoubleClick }: DesktopIconProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (clickTimer) clearTimeout(clickTimer);
    };
  }, [clickTimer]);

  const handleClick = () => {
    setIsSelected(true);
    setClickCount((prev) => prev + 1);

    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const timer = setTimeout(() => {
      if (clickCount === 1) {
        // Double click detected
        if (onDoubleClick) {
          onDoubleClick();
        }
      }
      setClickCount(0);
    }, 300);

    setClickTimer(timer);
  };

  const handleBlur = () => {
    setIsSelected(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-20 h-24 cursor-pointer rounded p-2",
        "hover:bg-[hsl(var(--win-icon-selected))]",
        isSelected && "bg-[hsl(var(--win-icon-selected))] border border-dashed border-white"
      )}
      onClick={handleClick}
      onBlur={handleBlur}
      tabIndex={0}
    >
      <div className="text-4xl mb-1">{icon}</div>
      <div className="text-xs text-center text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </div>
    </div>
  );
};
