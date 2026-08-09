import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Bot, X, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

type ChatResponse = {
  message: string;
  response: string;
  type: string;
};
type Props = {
  currentUrl: string;
};
export default function AIChatbot(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hi! 👋 I'm your job portal assistant. How can I help you?",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    // Immediately show user's message
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Clear input immediately
    setInput("");

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post<ChatResponse>(
        `${props.currentUrl}/ai/chat`,
        {
          message: trimmedMessage,
          type: "faq",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.data.response,
      };

      // Add bot response without refreshing
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Chatbot Error:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Sorry, I couldn't process your request. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] rounded-xl border bg-background shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot size={20} />
              </div>

              <div>
                <p className="font-semibold">AI Assistant</p>

                <p className="text-xs text-muted-foreground">How can I help?</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] gap-2 ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    {message.sender === "user" ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`rounded-lg px-3 py-2 text-left text-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me something..."
                disabled={isLoading}
              />

              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <Bot size={24} />
        </Button>
      )}
    </>
  );
}
