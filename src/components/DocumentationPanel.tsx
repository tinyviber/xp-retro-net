import { useState } from "react";

interface DocumentationPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocumentationPanel = ({ value, onChange }: DocumentationPanelProps) => {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCopy = async () => {
    if (!value.trim()) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 1500);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 1500);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 1500);
    }
  };

  return (
    <div className="win-window h-full flex flex-col">
      <div className="win-titlebar">
        <span className="text-sm font-semibold">操作记录</span>
      </div>
      <div className="p-3 flex-1 flex flex-col gap-3">
        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
          请记录你的排查步骤、命令输出和最终结论。切换练习时，此处内容会被清空。
        </p>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 win-input resize-none font-mono text-sm text-foreground bg-white min-h-[220px]"
          placeholder="示例：\n1. 运行 ipconfig，发现默认网关为空...\n2. 打开网络配置窗口，补全网关...\n3. 再次 ping 8.8.8.8，连通。"
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2">
        <button onClick={handleCopy} className="win-button text-xs px-3 py-1">
          {copyStatus === "success" ? "已复制" : copyStatus === "error" ? "复制失败" : "复制内容"}
        </button>
      </div>
    </div>
  );
};
