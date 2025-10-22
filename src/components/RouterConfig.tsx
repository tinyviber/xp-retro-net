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

  useEffect(() => {
    setDhcpEnabled(initialSettings.dhcpEnabled);
  }, [initialSettings]);

  const handleApply = () => {
    onApply({ ...initialSettings, dhcpEnabled });
    onClose();
  };

  return (
    <WindowFrame title="路由器设置" onClose={onClose} className="max-w-md">
      <div className="space-y-4">
        <div className="bg-white border-2 border-[hsl(var(--border))] p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">DHCP 服务</h3>
            <p className="text-xs text-black/70">
              启用 DHCP 时，路由器会自动为局域网客户端分配 IP 地址。
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm" htmlFor="router-dhcp-on">
              <input
                id="router-dhcp-on"
                type="radio"
                name="router-dhcp"
                checked={dhcpEnabled}
                onChange={() => setDhcpEnabled(true)}
                className="w-4 h-4"
              />
              开启 DHCP 服务
            </label>
            <label className="flex items-center gap-2 text-sm" htmlFor="router-dhcp-off">
              <input
                id="router-dhcp-off"
                type="radio"
                name="router-dhcp"
                checked={!dhcpEnabled}
                onChange={() => setDhcpEnabled(false)}
                className="w-4 h-4"
              />
              关闭 DHCP 服务
            </label>
          </div>

          <div className="bg-[hsl(var(--win-panel))] border border-[hsl(var(--border))] p-3">
            <p className="text-xs leading-relaxed text-black/80">
              提示：如果关闭 DHCP，请确保手动为客户端配置静态 IP 地址，否则设备可能无法访问网络。
            </p>
          </div>
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
