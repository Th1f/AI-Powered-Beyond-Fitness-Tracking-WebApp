import React, { useState, useRef, useEffect } from 'react';
import './ChatBox.css';
import { AImessage, SendAImessage, addFoodItem, FoodItem, addFoodDescription} from '../auth/backendAuth';

interface Message extends AImessage {
    id: string;
    type: 'user' | 'ai';
    timestamp: string;
}

const ChatBox: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const formatTimestamp = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const generateMessageId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    const addMessage = (content: string, type: 'user' | 'ai') => {
        const newMessage: Message = {
            id: generateMessageId(),
            message: content,
            type,
            timestamp: formatTimestamp()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleAction = async (action: string, actionDesc: addFoodDescription) => {
        if (action === 'add_food') {
            const newFood: FoodItem = {
                id: Date.now().toString(),
                name: actionDesc.food_name,
                calories: Number(actionDesc.food_calories),
                proteins: Number(actionDesc.food_proteins),
                carbs: Number(actionDesc.food_carbs),
                fats: Number(actionDesc.food_fats),
                timestamp: Date.now(),
            }
            addFoodItem(newFood);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;
        addMessage(inputMessage, 'user');
        const userMessage = inputMessage;
        setInputMessage('');
        setIsLoading(true);
        try {
            const aiMessageRequest: AImessage = {
                message: userMessage
            };
            const aiResponse = await SendAImessage(aiMessageRequest);
            const keys = Object.keys(aiResponse.action);
            console.log(keys[0]);
            handleAction(keys[0], aiResponse.action[keys[0]]);
            addMessage(aiResponse.reply, 'ai');
        } catch (error) {
            addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputMessage.trim()) return;
        addMessage(inputMessage, 'user');
        const userMessage = inputMessage;
        setInputMessage('');
        setIsLoading(true);
        try {
            const aiMessageRequest: AImessage = {
                message: userMessage
            };
            const aiResponse = await SendAImessage(aiMessageRequest);
            const keys = Object.keys(aiResponse.action);
            console.log(keys[0]);
            handleAction(keys[0], aiResponse.action[keys[0]]);
            addMessage(aiResponse.reply, 'ai');
        } catch (error) {
            addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            {!isOpen ? (
                <div className="chat-button" onClick={toggleChat}>
                    <div className="chat-button-eye left"></div>
                    <div className="chat-button-eye right"></div>
                </div>
            ) : (
                <div className="chat-box">
                    <div className="chat-header">
                        <h3>Sprite Assistant</h3>
                        <button onClick={toggleChat}>×</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${
                                    message.type === 'user' ? 'user-message' : 'bot-message'
                                }`}
                            >
                                {message.message}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot-message">
                                <span className="typing-indicator"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} style={{ height: 0 }} /> {/* Invisible scroll anchor */}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                        <button
                            className="send-button"
                            onClick={handleSend}
                            disabled={isLoading || !inputMessage.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
