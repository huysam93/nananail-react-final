import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { Menu, X, CalendarHeart, Phone, Sparkles, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WishlistDrawer from '../ui/WishlistDrawer';

// ─── Announcement Bar ──────────────────────────────────────────────────────────
const AnnouncementBar = ({ onClose }) => (
  <div className="announcement-bar relative">
    <div className="container mx-auto flex items-center justify-center gap-2">
      <Sparkles size={12} className="opacity-80" />
      <span>🌸 Ưu đãi tháng {new Date().getMonth() + 1}: Giảm <strong>15%</strong> Combo Gel + Nail Art —</span>
      <Link to="/promotions" className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">
        Xem ngay
      </Link>
      <button
        onClick={onClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Đóng"
      >
        <X size={14} />
      </button>
    </div>
  </div>
);

// ─── Header ────────────────────────────────────────────────────────────────────
const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (y / docH) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMenuOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navItems = [
    { to: '/', label: 'Trang Chủ', end: true, emoji: '🏠' },
    { to: '/about', label: 'Giới Thiệu', emoji: '💌' },
    { to: '/services', label: 'Dịch Vụ', emoji: '💅' },
    { to: '/news', label: 'Tin Tức', emoji: '📰' },
    { to: '/gallery', label: 'Bộ Sưu Tập', emoji: '🖼️' },
    { to: '/reviews', label: 'Đánh Giá', emoji: '⭐' },
    { to: '/promotions', label: 'Ưu Đãi', emoji: '🎁' },
    { to: '/loyalty', label: 'Thành Viên', emoji: '👑' },
    { to: '/contact', label: 'Liên Hệ', emoji: '📞' },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-200 group ${
      isActive ? 'text-brand-pink-dark' : 'text-gray-600 hover:text-brand-pink-dark'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-brand-pink-light to-brand-blush text-brand-pink-dark'
        : 'text-gray-700 hover:bg-brand-pink-light/60 hover:text-brand-pink-dark'
    }`;

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <header
        ref={menuRef}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-nav' : 'bg-white/95'
        }`}
      >
        {/* Scroll progress bar */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-brand-pink-dark via-brand-pink-medium to-brand-rose-400 transition-all duration-100 z-10"
          style={{ width: `${scrollProgress}%` }}
        />

        <nav className={`container mx-auto px-4 transition-all duration-300 ${scrolled ? 'py-1.5' : 'py-2.5'}`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <span className={`animate-float transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>💅</span>
              <div>
                <span className={`font-serif font-bold text-gradient group-hover:opacity-90 transition-all duration-300 leading-none block ${scrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                  NanaNail
                </span>
                <span className={`text-[10px] text-gray-400 font-medium tracking-widest leading-none hidden sm:block transition-all duration-300 ${scrolled ? 'opacity-0 h-0' : 'opacity-100'}`}>
                  NAIL SALON ĐÀ LẠT
                </span>
              </div>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-0.5">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'opacity-100 bg-gradient-to-r from-brand-pink-dark to-brand-pink-medium'
                            : 'opacity-0 group-hover:opacity-60 bg-brand-pink-medium'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
              {isAuthenticated && (
                <NavLink to="/admin" className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      Dashboard
                      <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-brand-pink-dark to-brand-pink-medium transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                    </>
                  )}
                </NavLink>
              )}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 rounded-full text-gray-600 hover:text-brand-pink-dark hover:bg-brand-pink-light/60 transition-colors flex items-center justify-center"
                aria-label="Wishlist"
                title="Mẫu nail đã lưu"
              >
                <Heart size={20} className={wishlistCount > 0 ? 'fill-brand-pink-dark text-brand-pink-dark' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-pink-dark text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-brand-pink-dark transition-colors px-3 py-2 rounded-full hover:bg-brand-pink-light/50"
                >
                  Đăng xuất
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="text-sm text-gray-400 hover:text-brand-pink-dark transition-colors px-3 py-2 rounded-full hover:bg-brand-pink-light/50"
                >
                  Đăng nhập
                </NavLink>
              )}
              <a
                href="tel:0965371841"
                className="hidden xl:flex items-center gap-1.5 text-sm text-brand-pink-dark font-medium px-3 py-2 rounded-full hover:bg-brand-pink-light transition-colors"
              >
                <Phone size={14} />
                0965 371 841
              </a>
              <Link to="/booking" className="btn-primary text-sm px-5 py-2.5">
                <CalendarHeart size={16} />
                Đặt Lịch
              </Link>
            </div>

            {/* Mobile: Wishlist + phone + hamburger */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 rounded-xl text-brand-pink-dark hover:bg-brand-pink-light transition-colors touch-target flex items-center justify-center"
                aria-label="Wishlist"
              >
                <Heart size={20} className={wishlistCount > 0 ? 'fill-brand-pink-dark' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-pink-dark text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <a
                href="tel:0965371841"
                className="p-2 rounded-xl text-brand-pink-dark hover:bg-brand-pink-light transition-colors touch-target flex items-center justify-center"
                aria-label="Gọi điện"
              >
                <Phone size={20} />
              </a>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-gray-700 hover:bg-brand-pink-light hover:text-brand-pink-dark transition-colors touch-target flex items-center justify-center"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu — slide down */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden border-t border-brand-pink-light/60 bg-white"
            >
              <div className="container mx-auto px-4 py-3 space-y-1 max-h-[75vh] overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={mobileNavLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl w-7 text-center">{item.emoji}</span>
                    {item.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <NavLink
                    to="/admin"
                    className={mobileNavLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl w-7 text-center">⚙️</span>
                    Dashboard
                  </NavLink>
                )}

                <div className="pt-3 pb-1 border-t border-brand-pink-light/60 mt-2 flex flex-col gap-2">
                  <Link
                    to="/booking"
                    className="btn-primary justify-center py-3.5 text-base w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CalendarHeart size={18} />
                    Đặt Lịch Ngay
                  </Link>
                  {isAuthenticated ? (
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="text-sm text-center text-gray-400 hover:text-brand-pink-dark py-2 transition-colors rounded-xl hover:bg-brand-pink-light/50"
                    >
                      Đăng xuất
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      className="text-sm text-center text-gray-400 hover:text-brand-pink-dark py-2 block transition-colors rounded-xl hover:bg-brand-pink-light/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập Admin
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* Overlay backdrop khi mobile menu mở */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;