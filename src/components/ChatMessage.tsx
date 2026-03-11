interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <p
        className="max-w-[85%] leading-relaxed"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {content}
      </p>
    </div>
  );
};

export default ChatMessage;
