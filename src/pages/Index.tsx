import { useState } from "react";
import { Monitor, Network, Folder, FileText } from "lucide-react";
import { DesktopIcon } from "@/components/DesktopIcon";
import { NetworkConfig } from "@/components/NetworkConfig";
import { Taskbar } from "@/components/Taskbar";

const Index = () => {
  const [showNetworkConfig, setShowNetworkConfig] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6 pb-12">
        <div className="grid grid-cols-1 gap-4 w-fit">
          <DesktopIcon 
            icon={<Monitor className="text-blue-600" />} 
            label="我的电脑" 
          />
          <DesktopIcon 
            icon={<Network className="text-blue-600" />} 
            label="网络" 
            onDoubleClick={() => setShowNetworkConfig(true)}
          />
          <DesktopIcon 
            icon={<Folder className="text-yellow-500" />} 
            label="我的文档" 
          />
          <DesktopIcon 
            icon={<FileText className="text-white" />} 
            label="回收站" 
          />
        </div>
      </div>

      <Taskbar />

      {showNetworkConfig && (
        <NetworkConfig onClose={() => setShowNetworkConfig(false)} />
      )}
    </div>
  );
};

export default Index;
