import { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Phone, CalendarHeart, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { maskPrice } from '../components/shared/ServiceCard';
import usePageSEO from '../hooks/usePageSEO';

// Icon theo category
const categoryIcons = {
  'Gel': '💅',
  'Acrylic': '💎',
  'Nail Art': '🎨',
  'Chăm Sóc': '✨',
  'Pedicure': '🦶',
  'Tất cả': '🌸',
};

// Category colors
const categoryColors = {
  'Gel': 'from-pink-400 to-rose-500',
  'Acrylic': 'from-purple-400 to-pink-500',
  'Nail Art': 'from-rose-400 to-orange-400',
  'Chăm Sóc': 'from-green-400 to-teal-500',
  'Pedicure': 'from-blue-400 to-cyan-500',
};

const ServiceCardLarge = ({ service, index }) => {
  const [expanded, setExpanded] = useState(false);
  const gradientColor = categoryColors[service.category] || 'from-brand-pink-medium to-brand-pink-dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white/95 backdrop-blur-md rounded-2xl border border-rose-100/80 shadow-md hover:shadow-xl shadow-rose-900/5 hover:border-rose-200 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col"
    >
      {/* Gradient header */}
      <div className={`h-1.5 bg-gradient-to-r ${gradientColor}`} />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Icon */}
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0 text-xl sm:text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 text-white`}>
            {categoryIcons[service.category] || '💅'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-serif font-bold text-gray-800 leading-snug group-hover:text-brand-pink-dark transition-colors">
              {service.name}
            </h3>
            {service.category && (
              <span className="text-xs text-brand-pink-dark font-medium bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                {service.category}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
          {service.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between py-3 border-t border-b border-rose-50 mb-4">
          {/* Duration */}
          {service.duration_minutes ? (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={13} />
              <span>{service.duration_minutes} phút</span>
            </div>
          ) : <span />}

          {/* Rating dots */}
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < 5 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
            ))}
          </div>

          {/* Price */}
          <span className="text-base sm:text-lg font-bold font-mono tracking-wide text-brand-pink-dark">
            {maskPrice(service.price)}
          </span>
        </div>

        {/* CTA */}
        <Link
          to={`/booking?service=${service.id}`}
          className="btn-primary w-full justify-center py-2.5 sm:py-3 text-sm shadow-md shadow-rose-500/10"
        >
          <CalendarHeart size={15} />
          Đặt Lịch Ngay
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Bảng Giá dạng table ────────────────────────────────────────────────────
const PriceTable = ({ services }) => {
  const grouped = services.reduce((acc, s) => {
    const cat = s.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto rounded-2xl border border-rose-100 shadow-md shadow-rose-900/5 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-brand-pink-light to-brand-blush">
            <th className="text-left px-4 sm:px-6 py-3.5 font-semibold text-brand-pink-dark">Dịch Vụ</th>
            <th className="text-center px-3 py-3.5 font-semibold text-brand-pink-dark hidden sm:table-cell">Thời Gian</th>
            <th className="text-right px-4 sm:px-6 py-3.5 font-semibold text-brand-pink-dark">Giá Tham Khảo</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([cat, items]) => (
            <>
              <tr key={`cat-${cat}`} className="bg-brand-pink-light/40">
                <td colSpan={3} className="px-4 sm:px-6 py-2 text-xs font-bold text-brand-pink-dark uppercase tracking-wider">
                  {categoryIcons[cat] || '✦'} {cat}
                </td>
              </tr>
              {items.map((service, i) => (
                <tr
                  key={service.id}
                  className={`border-t border-gray-100 hover:bg-brand-pink-light/20 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 sm:px-6 py-3.5">
                    <p className="font-medium text-gray-800">{service.name}</p>
                    {service.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-center text-gray-400 text-xs hidden sm:table-cell">
                    {service.duration_minutes ? `${service.duration_minutes} phút` : '—'}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-right font-bold font-mono text-brand-pink-dark">
                    {maskPrice(service.price)}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── ServicesPage ──────────────────────────────────────────────────────────────
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  useEffect(() => {
    apiClient.get('/services')
      .then(res => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error(err);
        setServices([]);
      });
  }, []);

  // Lấy categories
  const safeServices = Array.isArray(services) ? services : [];
  const categories = ['Tất cả', ...new Set(safeServices.map(s => s.category).filter(Boolean))];
  const filtered = activeCategory === 'Tất cả' ? safeServices : safeServices.filter(s => s.category === activeCategory);

  return (
    <div>
      {/* Hero Banner */}
      <section className="page-hero">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge mx-auto"
          >
            <Sparkles size={14} />
            Dịch Vụ Chuyên Nghiệp
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            Bảng Giá{' '}
            <span className="text-gradient">Dịch Vụ</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg leading-relaxed"
          >
            Đa dạng dịch vụ chăm sóc móng chuyên nghiệp — giá tham khảo, liên hệ để báo giá chính xác
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Filter + View mode */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pill ${activeCategory === cat ? 'pill-active' : 'pill-inactive'} flex items-center gap-1.5`}
              >
                <span>{categoryIcons[cat] || '✦'}</span>
                {cat}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-white text-brand-pink-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ☰ Thẻ
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-white text-brand-pink-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              📋 Bảng Giá
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {(filtered.length ? filtered : services).map((service, index) => (
                <ServiceCardLarge key={service.id} service={service} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PriceTable services={filtered.length ? filtered : services} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-600 bg-brand-blush border border-brand-pink-light rounded-2xl px-5 sm:px-8 py-4 max-w-2xl mx-auto"
        >
          <Phone size={15} className="text-brand-pink-dark flex-shrink-0" />
          <span className="text-center sm:text-left">
            <span className="text-brand-pink-dark font-semibold">* </span>
            Giá hiển thị là giá tham khảo. Vui lòng{' '}
            <a href="tel:0965371841" className="text-brand-pink-dark font-bold hover:underline">
              gọi 0965 371 841
            </a>
            {' '}để được báo giá chính xác.
          </span>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-10">
          <Link to="/booking" className="btn-primary px-8 py-3.5 text-base">
            <CalendarHeart size={18} />
            Đặt Lịch Ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;