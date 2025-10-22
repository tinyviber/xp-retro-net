import { useEffect, useRef, useState } from "react";

interface VirtualTerminalProps {
  history: string[];
  onExecute: (command: string) => void;
}

export const VirtualTerminal = ({ history, onExecute }: VirtualTerminalProps) => {
  const [command, setCommand] = useState("");
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = command.trim();

    if (!trimmed) {
      return;
    }

    onExecute(trimmed);
    setCommand("");
  };

  return (
    <div className="win-window h-full flex flex-col">
      <div className="win-titlebar">
        <span className="text-sm font-semibold">命令提示符</span>
      </div>
      <div className="flex-1 bg-black text-green-300 font-mono text-sm p-3 overflow-y-auto space-y-2">
        {history.length === 0 ? (
          <div className="opacity-60">在此输入命令开始排查...</div>
        ) : (
          history.map((entry, index) => (
            <pre key={`${index}-${entry}`} className="whitespace-pre-wrap leading-relaxed">
              {entry}
            </pre>
          ))
        )}
        <div ref={scrollTargetRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex border-t border-black bg-neutral-900">
        <span className="px-2 py-1 font-mono text-sm text-green-300">C:\&gt;</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="flex-1 bg-neutral-900 text-green-200 px-2 py-1 font-mono text-sm focus:outline-none"
          autoComplete="off"
          autoFocus
        />
      </form>
    </div>
  );
};
