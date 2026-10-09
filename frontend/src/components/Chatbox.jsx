import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Phone, MapPin, CalendarHeart, Sparkles, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const QUICK_ACTIONS = [
  { label: '💰 Bảng giá dịch vụ', keyword: 'giá' },
  { label: '📅 Cách đặt lịch hẹn', keyword: 'đặt lịch' },
  { label: '📍 Địa chỉ & Giờ làm việc', keyword: 'địa chỉ' },
  { label: '🎁 Ưu đãi khuyến mãi', keyword: 'ưu đãi' },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Xin chào! 🌸 NanaNail hân hạnh hỗ trợ bạn. Bạn cần tư vấn thông tin gì ạ?',
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  },
];

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const getBotResponse = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('giá') || lower.includes('nhiêu') || lower.includes('bảng giá')) {
      return {
        text: 'Bảng giá dịch vụ tại NanaNail rất linh hoạt:\n• Sơn Gel màu: 80.000đ\n• Nail Art Design: từ 120.000đ\n• Chăm sóc móng trọn gói: từ 100.000đ\n\nBạn có thể xem chi tiết bảng giá tại trang Dịch Vụ nhé! ✨',
        link: '/services',
        linkText: 'Xem Bảng Giá Chi Tiết',
      };
    }

    if (lower.includes('địa chỉ') || lower.includes('ở đâu') || lower.includes('đường') || lower.includes('vị trí')) {
      return {
        text: '📍 NanaNail tọa lạc tại:\n55B/7 Hàn Thuyên, Phường 4, Đà Lạt, Lâm Đồng.\n\n⏰ Giờ mở cửa:\n• T2 – T6: 8:00 – 20:00\n• T7 – CN: 8:00 – 21:00',
        link: '/contact',
        linkText: 'Xem Bản Đồ Chỉ Đường',
      };
    }

    if (lower.includes('đặt lịch') || lower.includes('hẹn') || lower.includes('slot') || lower.includes('book')) {
      return {
        text: '📅 Bạn có thể đặt lịch online trực tiếp ngay trên website chỉ trong 1 phút! Hệ thống sẽ xác nhận lịch hẹn cho bạn trong vòng 30 phút.',
        link: '/booking',
        linkText: 'Đặt Lịch Hẹn Ngay',
      };
    }

    if (lower.includes('ưu đãi') || lower.includes('khuyến mãi') || lower.includes('giảm giá') || lower.includes('voucher')) {
      return {
        text: '🎁 Ưu đãi HOT tháng này:\n• Giảm 15% Combo Gel + Nail Art\n• Giảm 30% tháng sinh nhật\n• Giảm 10% cho thứ 2 vui vẻ',
        link: '/promotions',
        linkText: 'Xem Các Khuyến Mãi',
      };
    }

    return {
      text: 'Cảm ơn bạn đã nhắn tin! 🌸 Tin nhắn của bạn đã được chuyển đến nhân viên tư vấn. NanaNail sẽ liên hệ lại với bạn qua số điện thoại/Zalo trong thời gian sớm nhất!',
      link: null,
    };
  };

  const handleSendText = async (textToSend) => {
    const content = textToSend || message;
    if (!content.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: content,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setMessage('');
    setIsTyping(true);

    // Send to backend API as background call
    try {
      await apiClient.post('/messages', { content });
    } catch {
      // Ignore background error
    }

    // Simulate bot thinking
    setTimeout(() => {
      const botRes = getBotResponse(content);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botRes.text,
        link: botRes.link,
        linkText: botRes.linkText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating button with ripple */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[999]">
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-brand-pink-dark/30 animate-ripple" />
            <span className="absolute inset-0 rounded-full bg-brand-pink-dark/20 animate-ripple [animation-delay:0.5s]" />
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleChat}
          className="relative w-14 h-14 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-glow-pink"
          style={{ background: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)' }}
          aria-label="Open chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageSquare size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-36 sm:bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-85 max-w-sm bg-white rounded-2xl shadow-2xl z-[1000] overflow-hidden border border-gray-100 flex flex-col h-[480px]"
          >
            {/* Header */}
            <div className="p-3.5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)' }}>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shadow-inner">
                💅
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                  Trợ Lý NanaNail
                  <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-normal">Auto</span>
                </h3>
                <p className="text-white/80 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block animate-pulse" />
                  Đang hoạt động • Trả lời tự động
                </p>
              </div>
              <button onClick={toggleChat} className="text-white/80 hover:text-white p-1" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-brand-pink-light flex items-center justify-center text-xs flex-shrink-0 mt-0.5 border border-brand-pink-medium/30">
                      💅
                    </div>
                  )}

                  <div className={`max-w-[78%] rounded-2xl px-3 py-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-pink-dark to-brand-rose-500 text-white rounded-br-xs shadow-sm'
                      : 'bg-white text-gray-700 rounded-bl-xs border border-gray-100 shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.link && (
                      <Link
                        to={msg.link}
                        onClick={toggleChat}
                        className="mt-2 inline-flex items-center gap-1 font-semibold text-brand-pink-dark bg-brand-pink-light hover:bg-brand-pink text-[11px] px-2.5 py-1 rounded-full transition-colors"
                      >
                        <Sparkles size={11} />
                        {msg.linkText}
                      </Link>
                    )}
                    <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-300'}`}>
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                  <div className="w-7 h-7 rounded-full bg-brand-pink-light flex items-center justify-center text-xs">💅</div>
                  <div className="bg-white rounded-2xl px-3 py-2 border border-gray-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-pink-dark rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-pink-dark rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-pink-dark rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 bg-white border-t border-gray-100">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSendText(action.keyword)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-brand-pink-light/70 text-brand-pink-dark hover:bg-brand-pink hover:text-brand-pink-dark transition-colors font-medium border border-brand-pink/20"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="Hỏi trợ lý (giá, địa chỉ, lịch...)"
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium focus:border-transparent bg-gray-50"
              />
              <button
                onClick={() => handleSendText()}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all flex-shrink-0 hover:opacity-90 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)' }}
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbox;
