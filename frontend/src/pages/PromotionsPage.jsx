import { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Tag, Clock, Percent, Gift, Phone, CalendarHeart, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePageSEO from '../hooks/usePageSEO';

const PromotionsPage = () => {
  usePageSEO({
    title: 'Ưu Đãi Khuyến Mãi',
    description: 'Khám phá các chương trình khuyến mãi hấp dẫn tại NanaNail Đà Lạt. Giảm giá sơn gel, nail art, combo tiết kiệm cho khách hàng thân thiết.',
    keywords: 'khuyến mãi nail Đà Lạt, giảm giá nail, combo nail, ưu đãi NanaNail',
  });
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/promotions')
      .then(res => setPromotions(res.data))
      .catch(() => setPromotions([]))
      .finally(() => setLoading(false));
  }, []);

  // Fallback data nếu backend chưa có
  const fallbackPromos = [
    {
      id: 1,
      title: 'Combo Gel + Vẽ Nail Art',
      description: 'Sơn gel màu tùy chọn + vẽ nail art 2 ngón theo yêu cầu. Bền đẹp đến 3 tuần!',
      discount_percent: 15,
      original_price: 250000,
      promo_price: 212000,
      valid_to: '2026-07-31',
      badge: 'HOT',
      color: 'from-rose-400 to-pink-500',
    },
    {
      id: 2,
      title: 'Chăm Sóc Móng Tay + Chân',
      description: 'Trọn gói chăm sóc móng tay và móng chân cùng lúc. Thư giãn hoàn toàn!',
      discount_percent: 20,
      original_price: 300000,
      promo_price: 240000,
      valid_to: '2026-07-15',
      badge: 'SIÊU TIẾT KIỆM',
      color: 'from-fuchsia-400 to-rose-500',
    },
    {
      id: 3,
      title: 'Sinh Nhật Giảm 30%',
      description: 'Mang CMND/CCCD đến vào tháng sinh nhật — nhận ngay 30% cho tất cả dịch vụ!',
      discount_percent: 30,
      original_price: null,
      promo_price: null,
      valid_to: null,
      badge: 'ƯU ĐÃI THƯỜNG NIÊN',
      color: 'from-pink-400 to-brand-pink-dark',
    },
    {
      id: 4,
      title: 'Giới Thiệu Bạn Bè',
      description: 'Giới thiệu bạn mới đến NanaNail, cả hai đều được giảm 10% cho lần tiếp theo.',
      discount_percent: 10,
      original_price: null,
      promo_price: null,
      valid_to: null,
      badge: 'LOYALTY',
      color: 'from-rose-300 to-pink-400',
    },
    {
      id: 5,
      title: 'Thứ 2 Vui Vẻ',
      description: 'Đặt lịch vào thứ Hai nhận ngay 10% cho tất cả dịch vụ gel và nail art.',
      discount_percent: 10,
      original_price: null,
      promo_price: null,
      valid_to: '2026-12-31',
      badge: 'MỌI THỨ 2',
      color: 'from-pink-300 to-rose-400',
    },
    {
      id: 6,
      title: 'Khách Thân Thiết VIP',
      description: 'Đã ghé NanaNail từ 5 lần trở lên? Nhận thẻ VIP — giảm cố định 10% mọi lúc.',
      discount_percent: 10,
      original_price: null,
      promo_price: null,
      valid_to: null,
      badge: 'VIP',
      color: 'from-brand-pink-dark to-rose-600',
    },
  ];

  const displayPromos = promotions.length > 0 ? promotions : fallbackPromos;

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge mx-auto"
          >
            <Gift size={14} />
            Ưu Đãi Đặc Biệt
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            🎁 Khuyến Mãi{' '}
            <span className="text-gradient">Hấp Dẫn</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg leading-relaxed"
          >
            Những ưu đãi tốt nhất dành riêng cho bạn — đừng bỏ lỡ!
          </motion.p>
        </div>
      </section>

      {/* Promo grid */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayPromos.map((promo, i) => {
              const daysLeft = getDaysLeft(promo.valid_to);
              return (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative bg-white/95 backdrop-blur-md rounded-2xl border border-rose-100 shadow-md hover:shadow-xl shadow-rose-900/5 hover:border-rose-200 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col"
                >
                  {/* Top gradient bar */}
                  <div className={`h-2 bg-gradient-to-r ${promo.color || 'from-brand-pink-medium to-brand-pink-dark'}`} />

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${promo.color || 'from-brand-pink-medium to-brand-pink-dark'}`}>
                        <Flame size={10} />
                        {promo.badge || 'ƯU ĐÃI'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-serif font-black text-brand-pink-dark">
                        -{promo.discount_percent}%
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-gray-800 text-base sm:text-lg mb-2 leading-snug group-hover:text-brand-pink-dark transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                      {promo.description}
                    </p>

                    {/* Price + deadline */}
                    <div className="flex items-center justify-between mb-4">
                      {promo.original_price && promo.promo_price ? (
                        <div>
                          <span className="text-xs text-gray-400 line-through">
                            {promo.original_price.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="block text-lg font-bold text-brand-pink-dark">
                            {promo.promo_price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">Áp dụng trực tiếp tại tiệm</div>
                      )}

                      {daysLeft !== null && (
                        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          daysLeft <= 3 ? 'bg-red-50 text-red-600' : 'bg-brand-pink-light text-brand-pink-dark'
                        }`}>
                          <Clock size={11} className="inline mr-1" />
                          {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hết hạn'}
                        </div>
                      )}
                    </div>

                    <Link
                      to="/booking"
                      className="btn-primary w-full justify-center py-2.5 text-sm"
                    >
                      <CalendarHeart size={15} />
                      Đặt Lịch Ngay
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Hotline CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 bg-gradient-to-r from-brand-pink-dark via-brand-rose-500 to-brand-pink-dark text-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center shadow-glow-pink-lg"
        >
          <div className="text-3xl sm:text-4xl mb-3">🌸</div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold mb-2">Còn Thắc Mắc?</h3>
          <p className="text-white/80 mb-6 text-sm sm:text-base">
            Gọi ngay cho chúng tôi để được tư vấn ưu đãi phù hợp nhất với bạn!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:0965371841"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-brand-pink-dark font-bold hover:bg-brand-pink-light transition-all duration-300 hover:shadow-lg"
            >
              <Phone size={16} />
              0965 371 841
            </a>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/60 text-white font-semibold hover:bg-white/15 transition-all duration-300"
            >
              <CalendarHeart size={16} />
              Đặt Lịch Online
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PromotionsPage;
