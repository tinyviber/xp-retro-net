import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export const Taskbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#1f5bcc] to-[#2866d8] border-t-2 border-[#4682e8] flex items-center justify-between px-2 z-40">
      <button className="flex items-center gap-2 bg-gradient-to-b from-[#3ca03c] to-[#2d7d2d] hover:from-[#4cb34c] hover:to-[#358735] px-3 h-8 rounded-sm border border-[#1a5a1a] shadow-md">
        <div className="w-5 h-5 bg-white/20 rounded-sm flex items-center justify-center">
          <Menu size={14} className="text-white" />
        </div>
        <span className="text-white text-sm font-bold drop-shadow">开始</span>
      </button>
      
      <div className="flex-1" />
      
      <div className="bg-[#0d4ea6] hover:bg-[#1556b3] px-3 h-8 flex items-center justify-center border-l border-[#1556b3] cursor-pointer">
        <span className="text-white text-xs font-semibold">{formatTime(currentTime)}</span>
      </div>
    </div>
  );
};
