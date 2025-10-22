import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualTerminalProps {
  history: string[];
  onExecute: (command: string) => void;
}

export const VirtualTerminal = ({ history, onExecute }: VirtualTerminalProps) => {
  const [command, setCommand] = useState("");
  const [isPromptFocused, setIsPromptFocused] = useState(false);
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasActivatedRef = useRef(false);

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

    if (!hasActivatedRef.current) {
      return;
    }

    focusInput();
  }, [history, focusInput]);

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

    hasActivatedRef.current = true;
    focusInput();
  };

  const showPlaceholder =
    !isPromptFocused && command.length === 0 && history.length === 0;

  return (
    <div
      ref={containerRef}
      className="win-window h-full flex flex-col focus-within:ring-2 focus-within:ring-[hsl(var(--secondary))]"
      onMouseDown={handleContainerPointerDown}
      onTouchStart={handleContainerPointerDown}
      tabIndex={0}
      onFocus={() => {
        hasActivatedRef.current = true;
        focusInput();
      }}
      role="group"
      aria-label="虚拟命令提示符"
    >
      <div className="win-titlebar">
        <span className="text-sm font-semibold">命令提示符</span>
      </div>
      <div className="flex-1 bg-black text-green-300 font-mono text-sm p-3 overflow-y-auto">
        <div className="space-y-2">
          {history.map((entry, index) => (
            <pre key={`${index}-${entry}`} className="whitespace-pre-wrap leading-relaxed">
              {entry}
            </pre>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-3 flex items-start gap-2">
          <span className="pt-[3px] text-green-300">C:\&gt;</span>
          <div className="relative flex-1">
            {showPlaceholder && (
              <span className="pointer-events-none absolute inset-0 flex items-center text-green-300/60">
                在此输入命令开始排查...
              </span>
            )}
            <input
              ref={inputRef}
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onFocus={() => {
                hasActivatedRef.current = true;
                setIsPromptFocused(true);
              }}
              onBlur={() => setIsPromptFocused(false)}
              className="w-full bg-transparent text-green-200 caret-green-200 focus:outline-none"
              autoComplete="off"
              spellCheck={false}
              type="text"
            />
          </div>
        </form>
        <div ref={scrollTargetRef} />
      </div>
    </div>
  );
};
