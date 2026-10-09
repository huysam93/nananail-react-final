import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Phone, CalendarHeart, ArrowLeft, Sparkles } from 'lucide-react';

const NotFoundPage = () => {
  const links = [
    { to: '/', label: 'Trang Chủ', icon: <Home size={16} />, primary: true },
    { to: '/booking', label: 'Đặt Lịch', icon: <CalendarHeart size={16} />, primary: true },
    { to: '/services', label: 'Dịch Vụ', icon: <Sparkles size={16} />, primary: false },
    { to: '/contact', label: 'Liên Hệ', icon: <Phone size={16} />, primary: false },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brand-pink-light via-white to-brand-blush px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Big 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-6"
        >
          <div className="text-8xl sm:text-9xl font-serif font-black text-gradient leading-none select-none">
            404
          </div>
          <div className="text-4xl mt-2 animate-float">💅</div>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-3">
          Ôi! Trang Không Tìm Thấy
        </h1>
        <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
          Có vẻ như trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.<br />
          Hãy khám phá những trang khác của NanaNail nhé!
        </p>

        {/* Navigation cards */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          {links.filter(l => l.primary).map(link => (
            <Link key={link.to} to={link.to} className="btn-primary py-3 px-6">
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-3 justify-center mt-3 flex-wrap">
          {links.filter(l => !l.primary).map(link => (
            <Link key={link.to} to={link.to} className="btn-ghost py-2 px-4 text-sm">
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hotline */}
        <div className="mt-10 pt-6 border-t border-brand-pink-light">
          <p className="text-sm text-gray-400 mb-2">Cần hỗ trợ? Gọi ngay:</p>
          <a
            href="tel:0965371841"
            className="inline-flex items-center gap-2 text-brand-pink-dark font-bold text-lg hover:underline"
          >
            <Phone size={18} />
            0965 371 841
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
