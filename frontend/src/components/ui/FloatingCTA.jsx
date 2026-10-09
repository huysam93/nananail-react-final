import { useState, useEffect } from 'react';
import { Phone, CalendarHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FloatingCTA — Bottom bar chỉ hiện trên mobile (< md)
 * Xuất hiện sau khi scroll 100px, ẩn khi đang ở gần đầu trang
 */
const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Hiện khi scroll xuống > 100px
      if (currentY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Top border gradient */}
          <div className="h-px bg-gradient-to-r from-brand-pink-medium via-brand-pink-dark to-brand-pink-medium" />

          <div className="bg-white/95 backdrop-blur-md shadow-floating px-4 py-3 flex gap-3">
            {/* Gọi điện */}
            <a
              href="tel:0965371841"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-brand-pink-dark text-brand-pink-dark font-semibold text-sm hover:bg-brand-pink-light active:scale-95 transition-all duration-200 touch-target"
              aria-label="Gọi điện cho NanaNail"
            >
              <Phone size={17} />
              Gọi Ngay
            </a>

            {/* Đặt lịch */}
            <Link
              to="/booking"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all duration-200 shadow-glow-pink touch-target"
              style={{ background: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)' }}
              aria-label="Đặt lịch tại NanaNail"
            >
              <CalendarHeart size={17} />
              Đặt Lịch
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
