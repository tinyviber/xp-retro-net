import { useEffect, useMemo, useState } from "react";
import { Monitor, Network, Folder, FileText, Router } from "lucide-react";
import { DesktopIcon } from "@/components/DesktopIcon";
import { NetworkConfig } from "@/components/NetworkConfig";
import { RouterConfig } from "@/components/RouterConfig";
import { Taskbar } from "@/components/Taskbar";
import { ProblemDescription } from "@/components/ProblemDescription";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { VirtualTerminal } from "@/components/VirtualTerminal";
import { exercises } from "@/data/exercises";
import { executeVirtualCommand } from "@/lib/virtualCommands";
import { NetworkSettings, RouterSettings } from "@/types/network";

const Index = () => {
  const [activeExerciseId, setActiveExerciseId] = useState(exercises[0].id);
  const activeExercise = useMemo(
    () => exercises.find((exercise) => exercise.id === activeExerciseId) ?? exercises[0],
    [activeExerciseId]
  );

  const [networkConfig, setNetworkConfig] = useState<NetworkSettings>({ ...activeExercise.initialNetwork });
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [documentation, setDocumentation] = useState("");
  const [isNetworkConfigOpen, setIsNetworkConfigOpen] = useState(false);
  const [routerSettings, setRouterSettings] = useState<RouterSettings>({ ...activeExercise.initialRouter });
  const [isRouterConfigOpen, setIsRouterConfigOpen] = useState(false);

  useEffect(() => {
    setNetworkConfig({ ...activeExercise.initialNetwork });
    setTerminalHistory([]);
    setDocumentation("");
    setIsNetworkConfigOpen(false);
    setRouterSettings({ ...activeExercise.initialRouter });
    setIsRouterConfigOpen(false);
  }, [activeExercise]);

  const handleExecuteCommand = (command: string) => {
    const output = executeVirtualCommand(command, networkConfig);

    setTerminalHistory((previous) => {
      const next = [...previous, `C:\\> ${command}`];
      if (output) {
        next.push(output);
      }
      return next;
    });
  };

  const handleApplyNetworkConfig = (settings: NetworkSettings) => {
    setNetworkConfig({ ...settings });
    setTerminalHistory((previous) => [...previous, "系统: 网络配置已更新。"]);
  };

  const handleApplyRouterConfig = (settings: RouterSettings) => {
    setRouterSettings({ ...settings });
    setTerminalHistory((previous) => [...previous, "系统: 路由器配置已更新。"]);
  };

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <div className="flex-1 p-6 pb-20 space-y-6">
        <header className="text-left space-y-2">
          <h1 className="text-2xl font-bold text-white drop-shadow">
            网络故障排查模拟器
          </h1>
          <p className="text-sm text-white/90">
            选择一个练习场景，使用虚拟终端与网络配置工具完成排查，并记录你的操作。
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          {exercises.map((exercise) => {
            const isActive = exercise.id === activeExerciseId;
            return (
              <button
                key={exercise.id}
                onClick={() => setActiveExerciseId(exercise.id)}
                className={`win-button px-4 py-2 text-sm ${
                  isActive ? "bg-[hsl(var(--secondary))]" : ""
                }`}
              >
                {exercise.title}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-6 auto-rows-fr">
          <ProblemDescription exercise={activeExercise} />

          <div className="space-y-4">
            <div className="win-window">
              <div className="win-titlebar">
                <span className="text-sm font-semibold">虚拟桌面</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-fit">
                  <DesktopIcon icon={<Monitor className="text-blue-600" />} label="我的电脑" />
                  <DesktopIcon
                    icon={<Network className="text-blue-600" />}
                    label="网络"
                    onDoubleClick={() => setIsNetworkConfigOpen(true)}
                  />
                  <DesktopIcon
                    icon={<Router className="text-green-500" />}
                    label="路由器"
                    onDoubleClick={() => setIsRouterConfigOpen(true)}
                  />
                  <DesktopIcon icon={<Folder className="text-yellow-500" />} label="我的文档" />
                  <DesktopIcon icon={<FileText className="text-white" />} label="回收站" />
                </div>
              </div>
            </div>

            <VirtualTerminal history={terminalHistory} onExecute={handleExecuteCommand} />
          </div>

          <DocumentationPanel value={documentation} onChange={setDocumentation} />
        </div>
      </div>

      <Taskbar />

      {isNetworkConfigOpen && (
        <NetworkConfig
          initialSettings={networkConfig}
          onApply={handleApplyNetworkConfig}
          onClose={() => setIsNetworkConfigOpen(false)}
        />
      )}

      {isRouterConfigOpen && (
        <RouterConfig
          initialSettings={routerSettings}
          onApply={handleApplyRouterConfig}
          onClose={() => setIsRouterConfigOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
