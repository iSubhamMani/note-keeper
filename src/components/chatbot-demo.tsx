"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const initialMessages: Message[] = [
  { id: 1, text: "Show me my notes about project deadlines", sender: "user" },
];

const botResponses: Message[] = [
  {
    id: 2,
    text: "I found 3 notes about project deadlines:",
    sender: "bot",
  },
  {
    id: 3,
    text: "1. Marketing campaign due on March 25th\n2. Website redesign deadline: April 10th\n3. Q2 planning meeting: April 15th",
    sender: "bot",
  },
];

export default function ChatbotDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  //const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (messages.length === 1) {
      const timer = setTimeout(() => {
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, botResponses[0]]);

          setTimeout(() => {
            setIsTyping(true);

            setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [...prev, botResponses[1]]);
            }, 1500);
          }, 1000);
        }, 1500);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + botResponses.length + 1,
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Reset the demo after user interaction
    setTimeout(() => {
      setMessages(initialMessages);
    }, 3000);
  };

  return (
    <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="bg-black text-white p-4 font-bold">
        AI Chatbot Assistant
      </div>

      <div className="h-96 p-4 overflow-y-auto bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-3 mb-4 ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`p-3 rounded-xl max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-black text-white rounded-tr-none"
                    : "bg-white border-2 border-black rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
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
        </AnimatePresence>
      </div>

      <div className="p-4 border-t-4 border-black">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about your notes..."
            className="flex-1 p-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
