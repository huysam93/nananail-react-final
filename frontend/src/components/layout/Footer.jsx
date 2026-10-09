import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Clock, Heart, ArrowRight } from 'lucide-react';
import { SiZalo, SiTiktok } from 'react-icons/si';
import { useState, useEffect } from 'react';

// ─── Open/Close indicator ─────────────────────────────────────────────────────
const OpenStatusBadge = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 = Sunday
      const closeHour = (day === 0 || day === 6) ? 21 : 20;
      setIsOpen(hour >= 8 && hour < closeHour);
    };
    checkOpen();
    const timer = setInterval(checkOpen, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
      isOpen
        ? 'bg-green-50 text-green-600 border border-green-200'
        : 'bg-red-50 text-red-500 border border-red-200'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
      {isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'}
    </span>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: 'https://facebook.com', icon: <Facebook size={16} />, label: 'Facebook', color: '#1877F2' },
    { href: 'https://instagram.com', icon: <Instagram size={16} />, label: 'Instagram', color: '#E1306C' },
    { href: 'https://zalo.me/0965371841', icon: <SiZalo size={16} />, label: 'Zalo', color: '#0068FF' },
    { href: 'https://tiktok.com', icon: <SiTiktok size={16} />, label: 'TikTok', color: '#010101' },
  ];

  const quickLinks = [
    { to: '/', label: 'Trang Chủ' },
    { to: '/services', label: 'Dịch Vụ & Bảng Giá' },
    { to: '/gallery', label: 'Bộ Sưu Tập' },
    { to: '/promotions', label: 'Ưu Đãi Đặc Biệt' },
    { to: '/reviews', label: 'Đánh Giá' },
    { to: '/booking', label: 'Đặt Lịch Hẹn' },
    { to: '/loyalty', label: 'Thành Viên' },
    { to: '/contact', label: 'Liên Hệ' },
  ];

  const serviceLinks = [
    'Sơn Gel Cao Cấp',
    'Đắp Bột Acrylic',
    'Nail Art & Vẽ Móng',
    'Chăm Sóc Móng Tay',
    'Chăm Sóc Móng Chân',
    'Thiết Kế Theo Yêu Cầu',
  ];

  return (
    <footer className="bg-white border-t border-brand-pink-light/60 mt-0">
      {/* Top gradient accent */}
      <div className="h-[3px] bg-gradient-to-r from-brand-pink-medium via-brand-pink-dark to-brand-rose-400" />

      {/* Google Maps — tạm ẩn theo yêu cầu */}
      {/* 
      <div className="w-full h-44 sm:h-56 overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.8!2d108.44!3d11.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s55B%2F7%20H%C3%A0n%20Thuy%C3%AAn%2C%20Ph%C6%B0%E1%BB%9Dng%204%2C%20%C4%90%C3%A0%20L%E1%BA%A1t!5e0!3m2!1svi!2svn!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'saturate(0.7) brightness(1.05) contrast(0.95)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Vị trí NanaNail trên bản đồ"
        />
      </div>
      */}

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl animate-float">💅</span>
              <div>
                <span className="text-2xl font-serif font-bold text-gradient block leading-none">NanaNail</span>
                <span className="text-[10px] text-gray-400 tracking-widest">NAIL SALON ĐÀ LẠT</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-xs">
              Nơi mỗi bộ móng là một tác phẩm nghệ thuật. Trải nghiệm chăm sóc chuyên nghiệp và không gian thư giãn tuyệt vời tại Đà Lạt.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink-dark hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-glow-pink"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = social.color}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* CTA booking */}
            <Link to="/booking" className="btn-primary text-sm px-5 py-2.5 w-fit">
              <ArrowRight size={14} />
              Đặt Lịch Ngay
            </Link>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-base text-gray-800 mb-4">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-500 hover:text-brand-pink-dark flex items-center gap-1.5 group transition-colors py-0.5"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-brand-pink-dark to-brand-pink-medium group-hover:w-3 transition-all duration-200 rounded-full flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="font-serif font-bold text-base text-gray-800 mb-4">
              Dịch Vụ
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-sm text-gray-500 hover:text-brand-pink-dark flex items-center gap-1.5 group transition-colors py-0.5"
                  >
                    <span className="text-brand-pink-medium text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">✦</span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="font-serif font-bold text-base text-gray-800 mb-4">
              Liên Hệ
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-pink-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-brand-pink-dark" />
                </div>
                <span className="text-sm text-gray-500 leading-relaxed">
                  55B/7 Hàn Thuyên, Phường 4,<br />Đà Lạt, Lâm Đồng
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-pink-light flex items-center justify-center flex-shrink-0">
                  <Phone size={13} className="text-brand-pink-dark" />
                </div>
                <a href="tel:0965371841" className="text-sm text-gray-500 hover:text-brand-pink-dark transition-colors font-medium">
                  0965 371 841
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-pink-light flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-brand-pink-dark" />
                </div>
                <a href="mailto:huysam93@gmail.com" className="text-sm text-gray-500 hover:text-brand-pink-dark transition-colors truncate">
                  huysam93@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-pink-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={13} className="text-brand-pink-dark" />
                </div>
                <div className="text-sm text-gray-500">
                  <p>Thứ 2 – 6: <span className="font-medium text-gray-700">8:00 – 20:00</span></p>
                  <p>Thứ 7 – CN: <span className="font-medium text-gray-700">8:00 – 21:00</span></p>
                  <div className="mt-1.5">
                    <OpenStatusBadge />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100/80 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © {currentYear} NanaNail. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Thiết kế với <Heart size={11} className="text-brand-pink-dark fill-brand-pink-dark animate-pulse_soft" /> tại Đà Lạt
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <Link to="/news" className="hover:text-brand-pink-dark transition-colors">Blog</Link>
            <span className="opacity-30">·</span>
            <Link to="/reviews" className="hover:text-brand-pink-dark transition-colors">Đánh Giá</Link>
            <span className="opacity-30">·</span>
            <Link to="/contact" className="hover:text-brand-pink-dark transition-colors">Liên Hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;