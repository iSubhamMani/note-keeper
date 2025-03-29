"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Message } from "@/models/Message";
import ReactMarkdown from "react-markdown";
import { Textarea } from "./ui/textarea";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm your AI assistant. Ask me anything about your notes.",
      role: "model",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [...prev, { text: inputValue, role: "user" }]);
    setInputValue("");

    try {
      setIsThinking(true);
      const res = await axios.post("/api/chat", {
        query: inputValue,
        history: messages,
      });

      if (res.data) {
        setMessages((prev) => [
          ...prev,
          { text: res.data.response, role: "model" },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    console.log("Messages changed");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 z-50"
          >
            <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Header */}
              <div className="bg-blue-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-white">AI Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}

              <div className="assistant-msg-container h-80 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        message.role === "user"
                          ? "bg-black text-white rounded-tr-none"
                          : "bg-blue-100 border-2 border-blue-300 rounded-tl-none"
                      }`}
                      ref={bottomRef}
                    >
                      {message.role === "model" ? (
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      ) : (
                        <p>{message.text}</p>
                      )}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 mb-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>

                    <div className="p-3 rounded-xl max-w-[80%] bg-white border-2 border-black rounded-tl-none">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 0.8,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 0.8,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 0.8,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t-2 border-gray-200">
                <div className="flex gap-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        setInputValue((prev) => prev + "\n");
                        return;
                      }

                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Ask about your notes..."
                    className="border-2 border-black rounded-lg resize-none max-h-20"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
