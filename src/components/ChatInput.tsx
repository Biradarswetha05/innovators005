import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-3 border-t border-border pt-6">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-input border border-[hsl(var(--input-border))] focus:border-[hsl(var(--input-border-focus))] outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors"
        style={{ fontFamily: "var(--font-serif)" }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors px-2 py-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Send →
      </button>
    </div>
  );
};

export default ChatInput;
