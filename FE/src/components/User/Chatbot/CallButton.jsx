import { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";

const CallButton = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="fixed bottom-6 right-6 z-40 group"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="relative">
                {/* Hiệu ứng ripple */}
                <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-40 z-0 scale-125"></span>

                {/* Nút gọi chính */}
                <div
                    className={`flex items-center text-white font-bold px-5 py-3 rounded-full shadow-xl cursor-pointer transition-all duration-300 
                        ${expanded ? "bg-red-600 pr-6" : "bg-red-600 w-16 h-16 justify-center"}
                    `}
                >
                    <FaPhoneAlt className="text-lg" />
                    {expanded && (
                        <span className="ml-3 text-base">0327446132</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallButton;
