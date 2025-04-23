"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import { useCalendar } from "../context/CalendarContext";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const { fetchEvents } = useCalendar();

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you manage your calendar and tasks through text commands.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = "http://localhost:5001";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const processNaturalLanguage = async (text: string) => {
    setIsProcessing(true);
    setIsBotTyping(true);

    try {
      // Get the token from localStorage (same as in your CalendarContext)
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Call the LLM API endpoint
      const response = await fetch(`${API_URL}/llm/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const messageText =
        typeof data.message === "string"
          ? data.message
          : "Sorry, I couldn't process that request.";

      const newMessage: Message = {
        id: messages.length + 2,
        text: messageText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Refresh calendar events if the interaction likely modified the calendar
      if (
        text.toLowerCase().includes("schedule") ||
        text.toLowerCase().includes("meeting") ||
        text.toLowerCase().includes("calendar") ||
        text.toLowerCase().includes("event")
      ) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error processing request:", error);

      // Add error message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    await processNaturalLanguage(inputText);
  };

  // Typing indicator component
  const TypingIndicator = () => {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-xs">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">AI Assistant</h3>
                    <p className="text-xs text-indigo-200">
                      {isProcessing
                        ? "Processing..."
                        : isBotTyping
                        ? "Typing..."
                        : "Online"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`max-w-xs rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                    } p-3`}
                  >
                    <div className="text-sm">
                      {message.sender === "bot" &&
                      typeof message.text === "string" ? (
                        <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown >
                          {message.text}
                        </ReactMarkdown>
                        </div>
                      ) : (
                        <span className="text-sm">
                          {message.text || (
                            <span className="text-gray-400 italic">
                              [No message]
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === "user"
                          ? "text-indigo-200"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </motion.div>
                </div>
              ))}

              {/* Typing indicator */}
              {isBotTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="border-t p-3 bg-white">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isProcessing}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    !inputText.trim() || isProcessing
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
