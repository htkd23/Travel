import React, { useState, useEffect, useRef } from "react";
import ChatBotIcon from "../../../assets/website/AI.avif";
import { IoClose } from "react-icons/io5";
import axiosClient from "../../../api/axiosClient.jsx";

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Xin chào! Tôi là chatbot hỗ trợ thông tin tour và khách sạn. Bạn muốn hỏi gì?",
        },
    ]);
    const [typing, setTyping] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async (text) => {
        const userMessage = {
            role: "user",
            content: text,
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setTyping(true);

        await callBackendChatAPI(newMessages);
    };

    async function callBackendChatAPI(chatMessages) {
        const userText = chatMessages[chatMessages.length - 1].content;

        const userId = localStorage.getItem("userId");

        try {
            const res = await axiosClient.post("chat", {
                userId: userId,
                message: userText,
            });

            console.log("Backend response:", res.data);

            const reply = res.data?.answer || "Bot không có phản hồi.";

            setMessages([
                ...chatMessages,
                { role: "assistant", content: reply },
            ]);
        } catch (error) {
            console.error(error);
            setMessages([
                ...chatMessages,
                {
                    role: "assistant",
                    content:
                        "Xin lỗi, hệ thống đang gặp lỗi. Vui lòng thử lại sau.",
                },
            ]);
        } finally {
            setTyping(false);
        }
    }

    const ChatMessage = ({ role, paragraphs }) => (
        <div
            className={`flex ${
                role === "user" ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`px-4 py-2 rounded-xl max-w-[80%] text-sm break-words text-gray-700 whitespace-pre-wrap ${
                    role === "user" ? "bg-cyan-100" : "bg-teal-100"
                }`}
            >
                {paragraphs.map((para, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-3" : ""}>
                        {para.split("\n").map((line, lineIdx) => (
                            <React.Fragment key={lineIdx}>
                                {line}
                                {lineIdx !== para.split("\n").length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed bottom-24 right-6 z-50">
            {!isOpen && (
                <div className="group cursor-pointer" onClick={toggleChat}>
                    <div className="relative w-16 h-16">
                        <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-40 z-0 scale-125"></span>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex justify-center items-center shadow-xl z-10">
                            <img
                                src={ChatBotIcon}
                                alt="ChatBot"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="w-[320px] h-[500px] bg-white rounded-[30px] border-2 border-cyan-300 shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-teal-400 text-white px-5 py-4 flex justify-between items-center rounded-t-[30px]">
                        <h2 className="font-semibold text-lg">Chatbot</h2>
                        <button onClick={toggleChat}>
                            <IoClose size={24} />
                        </button>
                    </div>

                    {/* Chat content */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((msg, index) => {
                            if (msg.role === "assistant") {
                                const paragraphs = msg.content
                                    .split(/\n\s*\n/)
                                    .filter((p) => p.trim() !== "");

                                return (
                                    <ChatMessage
                                        key={index}
                                        role={msg.role}
                                        paragraphs={paragraphs}
                                    />
                                );
                            } else {
                                return (
                                    <ChatMessage
                                        key={index}
                                        role={msg.role}
                                        paragraphs={[msg.content]}
                                    />
                                );
                            }
                        })}

                        {typing && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
                                    <span className="text-sm">Đang nhập...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.target.elements.userInput;
                            const text = input.value.trim();
                            if (text) {
                                handleSend(text);
                                input.value = "";
                            }
                        }}
                        className="border-t border-cyan-100 px-4 py-3 flex items-center gap-2 bg-cyan-50"
                    >
                        <input
                            name="userInput"
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            disabled={typing}
                            className={`flex-1 text-sm px-4 py-2 border-2 border-cyan-300 rounded-full focus:outline-none focus:ring focus:border-cyan-400 ${
                                typing ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                        />
                        <button
                            type="submit"
                            disabled={typing}
                            className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-400 text-white rounded-full flex justify-center items-center shadow hover:scale-110 transition-transform duration-300"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBotWidget;
