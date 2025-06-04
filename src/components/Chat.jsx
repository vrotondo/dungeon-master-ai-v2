import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../utils/api';

const Chat = ({ character, gameSession }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem('dnd_chat_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Welcome message
      setMessages([{
        id: Date.now(),
        type: 'dm',
        content: "Welcome, adventurer! I am your AI Dungeon Master. Tell me about your character and what kind of adventure you'd like to embark on, or simply say 'start adventure' to begin!",
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem('dnd_chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'player',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputMessage, character, gameSession, messages);
      
      const dmMessage = {
        id: Date.now() + 1,
        type: 'dm',
        content: response.message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, dmMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${error.message}. Please check your connection and try again.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'dm',
      content: "The adventure has been reset. What would you like to do next?",
      timestamp: new Date().toISOString()
    }]);
    localStorage.removeItem('dnd_chat_messages');
  };

  return (
    <div className="bg-fantasy-medium rounded-lg shadow-xl h-[calc(100vh-200px)] flex flex-col">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 border-b border-fantasy-light">
        <h2 className="text-xl font-bold text-fantasy-gold">Adventure Chat</h2>
        <button
          onClick={clearChat}
          className="bg-fantasy-accent hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          <i className="fas fa-trash mr-1"></i>
          Clear Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'player' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-3 rounded-lg ${
                message.type === 'player'
                  ? 'bg-fantasy-accent text-white'
                  : message.type === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-fantasy-light text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                <i className={`fas ${
                  message.type === 'player' 
                    ? 'fa-user' 
                    : message.type === 'error'
                    ? 'fa-exclamation-triangle'
                    : 'fa-dragon'
                } mt-1 flex-shrink-0`}></i>
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <small className="text-xs opacity-75 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-fantasy-light text-white p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <i className="fas fa-dragon"></i>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-fantasy-gold rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-fantasy-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-fantasy-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-fantasy-light">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your action, ask a question, or give commands..."
            className="flex-1 bg-fantasy-dark text-white border border-fantasy-light rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-fantasy-accent"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-fantasy-accent hover:bg-red-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
