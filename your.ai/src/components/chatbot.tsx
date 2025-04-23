import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatbotProps {
  onSpeechToText: (text: string) => void; // Pass the transcribed speech to parent
}

const Chatbot: React.FC<ChatbotProps> = ({ onSpeechToText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you manage your calendar and tasks through text commands.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const processNaturalLanguage = async (text: string) => {
    setIsProcessing(true);

    const response = await new Promise<string>((resolve) => {
      setTimeout(() => {
        if (text.toLowerCase().includes('schedule') || text.toLowerCase().includes('meeting')) {
          resolve("I'll help you schedule that. What time works best for you?");
        } else if (text.toLowerCase().includes('task') || text.toLowerCase().includes('todo')) {
          resolve("I'll add that to your task list. Would you like to set a due date?");
        } else if (text.toLowerCase().includes('weather')) {
          resolve("I'll check the weather forecast for you. Which day would you like to know about?");
        } else {
          resolve("I understand you want to manage your schedule. Could you be more specific about what you'd like to do?");
        }
      }, 1000);
    });

    const newMessage: Message = {
      id: messages.length + 2,
      text: response,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(false);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    await processNaturalLanguage(inputText);
  };

  const handleSpeechResult = (speechText: string) => {
    setInputText(speechText);
    handleSubmit();  // Directly call submit logic
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'} text-xl`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
          {/* Chat Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-robot text-2xl mr-2"></i>
              <div>
                <h3 className="font-medium">AI Assistant</h3>
                <p className="text-xs text-indigo-200">
                  {isProcessing ? 'Processing...' : 'Online'}
                </p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-indigo-200 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={(e) => e.preventDefault()} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
