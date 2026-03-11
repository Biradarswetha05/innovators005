import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

type Message = { role: "user" | "assistant"; content: string };

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: updated },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (e) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* New Chat - fixed top-left */}
      <button
        onClick={handleNewChat}
        className="fixed top-6 left-6 text-muted-foreground hover:text-foreground transition-colors text-sm z-10"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        [ New Chat ]
      </button>

      {/* Centered column */}
      <div className="mx-auto max-w-[800px] min-h-screen flex flex-col px-6 py-20">
        {/* Chat log */}
        <div ref={scrollRef} className="flex-1 space-y-8 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <p className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                Begin a conversation.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={i > 0 && messages[i - 1].role !== msg.role ? "mt-16" : ""}
            >
              <ChatMessage role={msg.role} content={msg.content} />
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <span
                className="blinking-cursor text-foreground text-lg"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                █
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mt-8">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
