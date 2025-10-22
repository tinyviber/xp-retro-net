import { useEffect, useState } from "react";
import { WindowFrame } from "./WindowFrame";
import { NetworkAdapterConfig } from "@/types/network";

interface NetworkConfigProps {
  initialSettings: NetworkAdapterConfig;
  onApply: (settings: NetworkAdapterConfig) => void;
  onClose: () => void;
}

export const NetworkConfig = ({ initialSettings, onApply, onClose }: NetworkConfigProps) => {
  const [ipMode, setIpMode] = useState<"auto" | "manual">(initialSettings.ipMode);
  const [dnsMode, setDnsMode] = useState<"auto" | "manual">(initialSettings.dnsMode);
  const [ipAddress, setIpAddress] = useState(initialSettings.ipAddress);
  const [subnetMask, setSubnetMask] = useState(initialSettings.subnetMask);
  const [gateway, setGateway] = useState(initialSettings.gateway);
  const [dns, setDns] = useState(initialSettings.dns);

  useEffect(() => {
    setIpAddress(initialSettings.ipAddress);
    setSubnetMask(initialSettings.subnetMask);
    setGateway(initialSettings.gateway);
    setDns(initialSettings.dns);

    setIpMode(initialSettings.ipMode);
    setDnsMode(initialSettings.dnsMode);
  }, [initialSettings]);

  const handleApply = () => {
    onApply({
      ipMode,
      dnsMode,
      ipAddress,
      subnetMask,
      gateway,
      dns,
    });
    onClose();
  };

  return (
    <WindowFrame title="网络连接属性" onClose={onClose} className="max-w-lg">
      <div className="space-y-4">
        <div className="bg-white border-2 border-[hsl(var(--border))] p-4">
          <h3 className="text-sm font-semibold mb-3">Internet 协议版本 4 (TCP/IPv4) 属性</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="ipAuto"
                name="ipMode"
                checked={ipMode === "auto"}
                onChange={() => setIpMode("auto")}
                className="w-4 h-4"
              />
              <label htmlFor="ipAuto" className="text-sm">
                自动获得 IP 地址
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="ipManual"
                name="ipMode"
                checked={ipMode === "manual"}
                onChange={() => setIpMode("manual")}
                className="w-4 h-4"
              />
              <label htmlFor="ipManual" className="text-sm">
                使用下面的 IP 地址:
              </label>
            </div>

            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">IP 地址:</label>
                <input
                  type="text"
                  value={ipMode === "auto" ? "" : ipAddress}
                  onChange={(event) => setIpAddress(event.target.value)}
                  disabled={ipMode === "auto"}
                  className="win-input flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm w-32">子网掩码:</label>
                <input
                  type="text"
                  value={ipMode === "auto" ? "" : subnetMask}
                  onChange={(event) => setSubnetMask(event.target.value)}
                  disabled={ipMode === "auto"}
                  className="win-input flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm w-32">默认网关:</label>
                <input
                  type="text"
                  value={ipMode === "auto" ? "" : gateway}
                  onChange={(event) => setGateway(event.target.value)}
                  disabled={ipMode === "auto"}
                  className="win-input flex-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[hsl(var(--border))]">
              <input
                type="radio"
                id="dnsAuto"
                name="dnsMode"
                checked={dnsMode === "auto"}
                onChange={() => setDnsMode("auto")}
                className="w-4 h-4"
              />
              <label htmlFor="dnsAuto" className="text-sm">
                自动获得 DNS 服务器地址
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="dnsManual"
                name="dnsMode"
                checked={dnsMode === "manual"}
                onChange={() => setDnsMode("manual")}
                className="w-4 h-4"
              />
              <label htmlFor="dnsManual" className="text-sm">
                使用下面的 DNS 服务器地址:
              </label>
            </div>

            <div className="ml-6">
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">首选 DNS 服务器:</label>
                <input
                  type="text"
                  value={dnsMode === "auto" ? "" : dns}
                  onChange={(event) => setDns(event.target.value)}
                  disabled={dnsMode === "auto"}
                  className="win-input flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={handleApply} className="win-button">
            确定
          </button>
          <button onClick={onClose} className="win-button">
            取消
          </button>
        </div>
      </div>
    </WindowFrame>
  );
};
