import { useEffect, useState } from "react";
import { WindowFrame } from "./WindowFrame";
import { RouterSettings } from "@/types/network";

interface RouterConfigProps {
  initialSettings: RouterSettings;
  onApply: (settings: RouterSettings) => void;
  onClose: () => void;
}

export const RouterConfig = ({ initialSettings, onApply, onClose }: RouterConfigProps) => {
  const [dhcpEnabled, setDhcpEnabled] = useState(initialSettings.dhcpEnabled);
  const [lanGateway, setLanGateway] = useState(initialSettings.lanGateway);
  const [lanSubnetMask, setLanSubnetMask] = useState(initialSettings.lanSubnetMask);
  const [dhcpRangeStart, setDhcpRangeStart] = useState(initialSettings.dhcpRangeStart);
  const [dhcpRangeEnd, setDhcpRangeEnd] = useState(initialSettings.dhcpRangeEnd);
  const [dhcpDns, setDhcpDns] = useState(initialSettings.dhcpDns);

  useEffect(() => {
    setDhcpEnabled(initialSettings.dhcpEnabled);
    setLanGateway(initialSettings.lanGateway);
    setLanSubnetMask(initialSettings.lanSubnetMask);
    setDhcpRangeStart(initialSettings.dhcpRangeStart);
    setDhcpRangeEnd(initialSettings.dhcpRangeEnd);
    setDhcpDns(initialSettings.dhcpDns);
  }, [initialSettings]);

  const handleApply = () => {
    onApply({
      ...initialSettings,
      dhcpEnabled,
      lanGateway,
      lanSubnetMask,
      dhcpRangeStart,
      dhcpRangeEnd,
      dhcpDns,
    });
    onClose();
  };

  return (
    <WindowFrame title="路由器设置" onClose={onClose} className="max-w-2xl">
      <div className="space-y-4">
        <div className="bg-white border-2 border-[hsl(var(--border))] p-4 space-y-4">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">LAN 基础信息</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-black/70 uppercase tracking-wide">LAN 网关</span>
                <input
                  value={lanGateway}
                  onChange={(event) => setLanGateway(event.target.value)}
                  className="win-input"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-black/70 uppercase tracking-wide">子网掩码</span>
                <input
                  value={lanSubnetMask}
                  onChange={(event) => setLanSubnetMask(event.target.value)}
                  className="win-input"
                />
              </label>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">DHCP 地址池</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-black/70 uppercase tracking-wide">起始地址</span>
                <input
                  value={dhcpRangeStart}
                  onChange={(event) => setDhcpRangeStart(event.target.value)}
                  className="win-input"
                  disabled={!dhcpEnabled}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-black/70 uppercase tracking-wide">结束地址</span>
                <input
                  value={dhcpRangeEnd}
                  onChange={(event) => setDhcpRangeEnd(event.target.value)}
                  className="win-input"
                  disabled={!dhcpEnabled}
                />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-black/70 uppercase tracking-wide">下发 DNS</span>
                <input
                  value={dhcpDns}
                  onChange={(event) => setDhcpDns(event.target.value)}
                  className="win-input"
                  disabled={!dhcpEnabled}
                />
              </label>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-black/70 uppercase tracking-wide">DHCP 状态</span>
                <div className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-2" htmlFor="router-dhcp-on">
                    <input
                      id="router-dhcp-on"
                      type="radio"
                      name="router-dhcp"
                      checked={dhcpEnabled}
                      onChange={() => setDhcpEnabled(true)}
                      className="w-4 h-4"
                    />
                    开启
                  </label>
                  <label className="flex items-center gap-2" htmlFor="router-dhcp-off">
                    <input
                      id="router-dhcp-off"
                      type="radio"
                      name="router-dhcp"
                      checked={!dhcpEnabled}
                      onChange={() => setDhcpEnabled(false)}
                      className="w-4 h-4"
                    />
                    关闭
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">WAN 接入状态</h3>
            <div className="grid sm:grid-cols-3 gap-3 text-xs text-black/80">
              <div className="bg-[hsl(var(--win-panel))] border border-[hsl(var(--border))] p-2 rounded-sm">
                <p className="font-semibold text-[11px] uppercase tracking-wide text-black/60">连接状态</p>
                <p className="text-sm font-medium mt-1">
                  {initialSettings.wanConnected ? "已连接" : "未连接"}
                </p>
              </div>
              <div className="bg-[hsl(var(--win-panel))] border border-[hsl(var(--border))] p-2 rounded-sm">
                <p className="font-semibold text-[11px] uppercase tracking-wide text-black/60">WAN IP</p>
                <p className="text-sm font-medium mt-1">
                  {initialSettings.wanIp ?? "--"}
                </p>
              </div>
              <div className="bg-[hsl(var(--win-panel))] border border-[hsl(var(--border))] p-2 rounded-sm">
                <p className="font-semibold text-[11px] uppercase tracking-wide text-black/60">上游网关</p>
                <p className="text-sm font-medium mt-1">
                  {initialSettings.wanGateway ?? "--"}
                </p>
              </div>
            </div>
            <p className="text-xs text-black/60">
              提示：若 WAN 显示未连接，则需要检查上联网线或联系上游网络管理员。
            </p>
          </section>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={handleApply} className="win-button">
            保存
          </button>
          <button onClick={onClose} className="win-button">
            取消
          </button>
        </div>
      </div>
    </WindowFrame>
  );
};
