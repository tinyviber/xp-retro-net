import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowFrameProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const WindowFrame = ({ title, onClose, children, className }: WindowFrameProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className={cn("win-window w-full max-w-md", className)}>
        <div className="win-titlebar">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/20 rounded-sm" />
            <span className="text-sm font-semibold">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-6 h-5 bg-[hsl(var(--win-button))] hover:bg-[hsl(var(--secondary))] border border-white/50 flex items-center justify-center">
              <Minus size={12} className="text-black" />
            </button>
            <button className="w-6 h-5 bg-[hsl(var(--win-button))] hover:bg-[hsl(var(--secondary))] border border-white/50 flex items-center justify-center">
              <Square size={10} className="text-black" />
            </button>
            <button
              onClick={onClose}
              className="w-6 h-5 bg-red-500 hover:bg-red-600 border border-white/50 flex items-center justify-center"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
