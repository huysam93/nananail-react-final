import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ZaloButton — Nút Zalo nổi góc phải màn hình, nằm trên nút Chatbot
 */
const ZaloButton = () => {
  const [hovered, setHovered] = useState(false);
  const ZALO_NUMBER = '0965371841';
  const zaloUrl = `https://zalo.me/${ZALO_NUMBER}`;

  return (
    <div className="fixed right-4 sm:right-6 bottom-36 sm:bottom-24 z-[998] flex flex-col items-end gap-2">
      {/* Tooltip label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-glass border border-gray-100 whitespace-nowrap"
          >
            Chat Zalo với chúng tôi! 💬
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zalo button */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative rounded-full flex items-center justify-center shadow-floating hover:scale-110 active:scale-95 transition-all duration-300"
        style={{ width: 50, height: 50 }}
      >
        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#0068FF] opacity-30 animate-pulseRing" />
        <span className="absolute inset-0 rounded-full bg-[#0068FF] opacity-20 animate-pulseRing" style={{ animationDelay: '0.5s' }} />

        {/* Zalo icon background */}
        <span className="relative w-full h-full rounded-full bg-[#0068FF] flex items-center justify-center shadow-md">
          {/* Zalo SVG logo */}
          <svg width="26" height="26" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 5C25.1 5 5 25.1 5 50C5 61.1 9.1 71.2 16.1 78.9L10 95L27.2 89.3C33.9 93 41.7 95 50 95C74.9 95 95 74.9 95 50C95 25.1 74.9 5 50 5Z"
              fill="white"
            />
            <text x="50" y="60" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#0068FF" fontFamily="Arial">
              Z
            </text>
          </svg>
        </span>
      </a>
    </div>
  );
};

export default ZaloButton;
