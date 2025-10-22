import { useState } from "react";
import { WindowFrame } from "./WindowFrame";

interface NetworkConfigProps {
  onClose: () => void;
}

export const NetworkConfig = ({ onClose }: NetworkConfigProps) => {
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [subnetMask, setSubnetMask] = useState("255.255.255.0");
  const [gateway, setGateway] = useState("192.168.1.1");
  const [preferredDns, setPreferredDns] = useState("8.8.8.8");
  const [alternateDns, setAlternateDns] = useState("8.8.4.4");

  const handleApply = () => {
    console.log("Network settings applied:", {
      ipAddress,
      subnetMask,
      gateway,
      preferredDns,
      alternateDns,
    });
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
                id="auto"
                name="ipMode"
                className="w-4 h-4"
              />
              <label htmlFor="auto" className="text-sm">自动获得 IP 地址</label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="manual"
                name="ipMode"
                defaultChecked
                className="w-4 h-4"
              />
              <label htmlFor="manual" className="text-sm">使用下面的 IP 地址:</label>
            </div>
            
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">IP 地址:</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="win-input flex-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">子网掩码:</label>
                <input
                  type="text"
                  value={subnetMask}
                  onChange={(e) => setSubnetMask(e.target.value)}
                  className="win-input flex-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">默认网关:</label>
                <input
                  type="text"
                  value={gateway}
                  onChange={(e) => setGateway(e.target.value)}
                  className="win-input flex-1"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-3 border-t border-[hsl(var(--border))]">
              <input
                type="radio"
                id="autoDns"
                name="dnsMode"
                className="w-4 h-4"
              />
              <label htmlFor="autoDns" className="text-sm">自动获得 DNS 服务器地址</label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="manualDns"
                name="dnsMode"
                defaultChecked
                className="w-4 h-4"
              />
              <label htmlFor="manualDns" className="text-sm">使用下面的 DNS 服务器地址:</label>
            </div>
            
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">首选 DNS 服务器:</label>
                <input
                  type="text"
                  value={preferredDns}
                  onChange={(e) => setPreferredDns(e.target.value)}
                  className="win-input flex-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">备用 DNS 服务器:</label>
                <input
                  type="text"
                  value={alternateDns}
                  onChange={(e) => setAlternateDns(e.target.value)}
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
