import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualTerminalProps {
  history: string[];
  onExecute: (command: string) => void;
}

export const VirtualTerminal = ({ history, onExecute }: VirtualTerminalProps) => {
  const [command, setCommand] = useState("");
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const focusInput = useCallback(() => {
    const node = inputRef.current;
    if (!node) {
      return;
    }

    node.focus();

    const valueLength = node.value.length;
    requestAnimationFrame(() => {
      node.setSelectionRange(valueLength, valueLength);
    });
  }, []);

  useEffect(() => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
    }

    focusInput();
  }, [history, focusInput]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    const containerNode = containerRef.current;
    if (!containerNode) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete" || event.key === "Enter") {
        focusInput();
      }
    };

    containerNode.addEventListener("keydown", handleKeyDown);

    return () => {
      containerNode.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusInput]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = command.trim();

    if (!trimmed) {
      return;
    }

    onExecute(trimmed);
    setCommand("");
  };

  const handleContainerPointerDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const target = event.target as HTMLElement | null;
    if (target && target.tagName === "INPUT") {
      return;
    }

    focusInput();
  };

  return (
    <div
      ref={containerRef}
      className="win-window h-full flex flex-col focus-within:ring-2 focus-within:ring-[hsl(var(--secondary))]"
      onMouseDown={handleContainerPointerDown}
      onTouchStart={handleContainerPointerDown}
      tabIndex={0}
      onFocus={focusInput}
      role="group"
      aria-label="虚拟命令提示符"
    >
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
          ref={inputRef}
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="flex-1 bg-neutral-900 text-green-200 px-2 py-1 font-mono text-sm focus:outline-none"
          autoComplete="off"
          type="text"
        />
      </form>
    </div>
  );
};
