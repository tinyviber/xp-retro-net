import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualTerminalProps {
  history: string[];
  onExecute: (command: string) => void;
}

export const VirtualTerminal = ({ history, onExecute }: VirtualTerminalProps) => {
  const [command, setCommand] = useState("");
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isActiveRef = useRef(false);

  useEffect(() => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = useCallback(() => {
    const trimmed = command.trim();

    if (!trimmed) {
      return;
    }

    onExecute(trimmed);
    setCommand("");
  }, [command, onExecute]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand();
  };

  const focusInput = () => {
    isActiveRef.current = true;
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      if (!container.contains(event.target as Node)) {
        isActiveRef.current = false;
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActiveRef.current || !inputRef.current) {
        return;
      }

      if (document.activeElement === inputRef.current) {
        return;
      }

      const hasModifier = event.metaKey || event.ctrlKey || event.altKey;

      if (event.key === "Enter") {
        event.preventDefault();
        runCommand();
        inputRef.current.focus({ preventScroll: true });
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        setCommand((previous) => previous.slice(0, -1));
        inputRef.current.focus({ preventScroll: true });
        return;
      }

      if (event.key.length === 1 && !hasModifier) {
        event.preventDefault();
        inputRef.current.focus({ preventScroll: true });
        setCommand((previous) => previous + event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCommand]);

  return (
    <div
      ref={containerRef}
      className="win-window h-full flex flex-col"
      onClick={focusInput}
      onMouseDownCapture={focusInput}
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
          autoFocus
          type="text"
          onFocus={() => {
            isActiveRef.current = true;
          }}
          onBlur={() => {
            isActiveRef.current = false;
          }}
        />
      </form>
    </div>
  );
};
