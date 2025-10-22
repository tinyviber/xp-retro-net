import { useEffect, useMemo, useState } from "react";
import { Monitor, Network, Folder, FileText, Router, Terminal } from "lucide-react";
import { DesktopIcon } from "@/components/DesktopIcon";
import { NetworkConfig } from "@/components/NetworkConfig";
import { RouterConfig } from "@/components/RouterConfig";
import { Taskbar } from "@/components/Taskbar";
import { ProblemDescription } from "@/components/ProblemDescription";
import { VirtualTerminal } from "@/components/VirtualTerminal";
import { exercises } from "@/data/exercises";
import { executeVirtualCommand } from "@/lib/virtualCommands";
import {
  ExerciseDefinition,
  NetworkAdapterConfig,
  NetworkSettings,
  RouterSettings,
} from "@/types/network";

const ipToNumber = (ip: string) =>
  ip
    .split(".")
    .map(Number)
    .reduce((acc, part) => (acc << 8) + part, 0);

const numberToIp = (value: number) =>
  [24, 16, 8, 0]
    .map((shift) => ((value >> shift) & 255).toString())
    .join(".");

const createDhcpLease = (settings: RouterSettings): NetworkSettings => {
  const startInt = ipToNumber(settings.dhcpRangeStart);
  const endInt = ipToNumber(settings.dhcpRangeEnd);
  const leaseInt = startInt <= endInt ? startInt : endInt;

  return {
    ipAddress: numberToIp(leaseInt),
    subnetMask: settings.lanSubnetMask,
    gateway: settings.lanGateway,
    dns: settings.dhcpDns,
  };
};

const createApipaFallback = (
  exercise: ExerciseDefinition
): NetworkSettings => {
  const { initialNetwork, id } = exercise;

  if (initialNetwork.ipAddress.startsWith("169.254.")) {
    return {
      ipAddress: initialNetwork.ipAddress,
      subnetMask: initialNetwork.subnetMask || "255.255.0.0",
      gateway: "",
      dns: "",
    };
  }

  const thirdOctet = 100 + (id % 100);
  const fourthOctet = 10 + ((id * 17) % 200);

  return {
    ipAddress: `169.254.${thirdOctet}.${fourthOctet}`,
    subnetMask: "255.255.0.0",
    gateway: "",
    dns: "",
  };
};

const createInitialAdapterConfig = (
  exercise: ExerciseDefinition
): NetworkAdapterConfig => ({
  ...exercise.initialNetwork,
  ipMode: exercise.initialNetwork.ipAddress ? "manual" : "auto",
  dnsMode: exercise.initialNetwork.dns ? "manual" : "auto",
});

const Index = () => {
  const [activeExerciseId, setActiveExerciseId] = useState(exercises[0].id);
  const activeExercise = useMemo(
    () => exercises.find((exercise) => exercise.id === activeExerciseId) ?? exercises[0],
    [activeExerciseId]
  );

  const [adapterConfig, setAdapterConfig] = useState<NetworkAdapterConfig>(() =>
    createInitialAdapterConfig(activeExercise)
  );
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [isNetworkConfigOpen, setIsNetworkConfigOpen] = useState(false);
  const [routerSettings, setRouterSettings] = useState<RouterSettings>({ ...activeExercise.initialRouter });
  const [isRouterConfigOpen, setIsRouterConfigOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [dhcpLease, setDhcpLease] = useState<NetworkSettings | null>(() => {
    const initialAdapter = createInitialAdapterConfig(activeExercise);
    if (initialAdapter.ipMode === "auto" && activeExercise.initialRouter.dhcpEnabled) {
      return createDhcpLease(activeExercise.initialRouter);
    }
    return null;
  });

  useEffect(() => {
    const nextAdapter = createInitialAdapterConfig(activeExercise);
    setAdapterConfig(nextAdapter);
    setTerminalHistory([]);
    setIsNetworkConfigOpen(false);
    setRouterSettings({ ...activeExercise.initialRouter });
    setIsRouterConfigOpen(false);
    setDhcpLease(
      activeExercise.initialRouter.dhcpEnabled && nextAdapter.ipMode === "auto"
        ? createDhcpLease(activeExercise.initialRouter)
        : null
    );
  }, [activeExercise]);

  const effectiveNetwork = useMemo<NetworkSettings>(() => {
    if (adapterConfig.ipMode === "manual") {
      const dns =
        adapterConfig.dnsMode === "manual"
          ? adapterConfig.dns
          : routerSettings.dhcpEnabled
          ? routerSettings.dhcpDns
          : "";

      return {
        ipAddress: adapterConfig.ipAddress,
        subnetMask: adapterConfig.subnetMask,
        gateway: adapterConfig.gateway,
        dns,
      };
    }

    if (routerSettings.dhcpEnabled) {
      const lease = dhcpLease ?? createDhcpLease(routerSettings);
      const dns = adapterConfig.dnsMode === "manual" ? adapterConfig.dns : lease.dns;

      return {
        ipAddress: lease.ipAddress,
        subnetMask: lease.subnetMask,
        gateway: lease.gateway,
        dns,
      };
    }

    const fallback = createApipaFallback(activeExercise);
    const dns = adapterConfig.dnsMode === "manual" ? adapterConfig.dns : fallback.dns;

    return {
      ipAddress: fallback.ipAddress,
      subnetMask: fallback.subnetMask,
      gateway: fallback.gateway,
      dns,
    };
  }, [adapterConfig, routerSettings, dhcpLease, activeExercise]);

  useEffect(() => {
    if (adapterConfig.ipMode !== "auto" || !routerSettings.dhcpEnabled) {
      if (dhcpLease !== null) {
        setDhcpLease(null);
      }
      return;
    }

    const lease = createDhcpLease(routerSettings);
    setDhcpLease((previous) => {
      if (
        previous &&
        previous.ipAddress === lease.ipAddress &&
        previous.subnetMask === lease.subnetMask &&
        previous.gateway === lease.gateway &&
        previous.dns === lease.dns
      ) {
        return previous;
      }

      setTerminalHistory((prev) => [
        ...prev,
        `系统: DHCP 已分配 IP 地址 ${lease.ipAddress}。`,
      ]);
      return lease;
    });
  }, [
    adapterConfig.ipMode,
    routerSettings,
    routerSettings.dhcpEnabled,
    routerSettings.dhcpRangeStart,
    routerSettings.dhcpRangeEnd,
    routerSettings.lanGateway,
    routerSettings.lanSubnetMask,
    routerSettings.dhcpDns,
    dhcpLease,
  ]);

  const handleExecuteCommand = (command: string) => {
    const output = executeVirtualCommand(command, effectiveNetwork);

    setTerminalHistory((previous) => {
      const next = [...previous, `C:\\> ${command}`];
      if (output) {
        next.push(output);
      }
      return next;
    });
  };

  const handleApplyNetworkConfig = (settings: NetworkAdapterConfig) => {
    setAdapterConfig({ ...settings });
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

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6 auto-rows-fr">
          <ProblemDescription exercise={activeExercise} />

          <div className="space-y-4 h-full flex flex-col">
            <div className="win-window flex-1 flex flex-col">
              <div className="win-titlebar">
                <span className="text-sm font-semibold">虚拟桌面</span>
              </div>
              <div className="p-6 flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 h-full items-start content-start">
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
                  <DesktopIcon
                    icon={<Terminal className="text-green-500" />}
                    label="命令提示符"
                    onDoubleClick={() => setIsTerminalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Taskbar />

      {isTerminalOpen && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-start justify-center p-4 sm:p-8">
          <div className="pointer-events-auto w-full max-w-3xl">
            <VirtualTerminal
              history={terminalHistory}
              onExecute={handleExecuteCommand}
              onClose={() => setIsTerminalOpen(false)}
            />
          </div>
        </div>
      )}

      {isNetworkConfigOpen && (
        <NetworkConfig
          initialSettings={adapterConfig}
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
