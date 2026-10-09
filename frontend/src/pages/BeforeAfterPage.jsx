import { useEffect, useState, useRef } from 'react';
import apiClient from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, CalendarHeart, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePageSEO from '../hooks/usePageSEO';
import { getImageUrl } from '../utils/imageHelper';

/**
 * BeforeAfterSlider — Kéo tay để so sánh ảnh trước/sau
 */
const BeforeAfterSlider = ({ before, after, caption }) => {
  const [pos, setPos] = useState(50); // % từ trái
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePos = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95);
    setPos(pct);
  };

  const onMouseDown = (e) => { dragging.current = true; updatePos(e.clientX); };
  const onMouseMove = (e) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchStart = (e) => { dragging.current = true; updatePos(e.touches[0].clientX); };
  const onTouchMove = (e) => { if (dragging.current) updatePos(e.touches[0].clientX); };

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  const imgClass = "w-full h-full object-cover select-none pointer-events-none";

  return (
    <div className="rounded-2xl overflow-hidden border border-rose-100 shadow-md hover:shadow-xl shadow-rose-900/5 transition-all duration-300 bg-white">
      <div
        ref={containerRef}
        className="relative h-64 sm:h-72 cursor-ew-resize overflow-hidden"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* After image (base) */}
        <img src={getImageUrl(after)} alt="Sau khi làm" className={`${imgClass} absolute inset-0`} />

        {/* Before image (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={getImageUrl(before)} alt="Trước khi làm" className={imgClass} style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }} />
        </div>

        {/* Divider handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-lg"
          style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-floating flex items-center justify-center border-2 border-brand-pink-medium">
            <ChevronLeft size={13} className="text-brand-pink-dark" />
            <ChevronRight size={13} className="text-brand-pink-dark" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          Trước
        </div>
        <div className="absolute top-3 right-3 bg-brand-pink-dark/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          Sau
        </div>

        {/* Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap">
          ← Kéo để xem →
        </div>
      </div>
      {caption && (
        <div className="px-4 py-3 text-sm text-gray-600 font-medium text-center bg-white">
          {caption}
        </div>
      )}
    </div>
  );
};

const fallbackItems = [
  {
    id: 'f1',
    before_image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80',
    after_image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80&sat=-80&brightness=130',
    title: '✨ Sơn Gel Màu Hồng Pastel',
    category: 'Gel',
  },
  {
    id: 'f2',
    before_image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80',
    after_image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80&hue=50',
    title: '💎 Đắp Bột Acrylic Sang Trọng',
    category: 'Acrylic',
  },
  {
    id: 'f3',
    before_image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80',
    after_image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80&sat=50',
    title: '🌸 Nail Art Hoa Sen Tinh Tế',
    category: 'Nail Art',
  },
];

const BeforeAfterPage = () => {
  usePageSEO({
    title: 'Trước & Sau - Kết Quả Thực Tế | NanaNail Đà Lạt',
    description: 'Xem kết quả thực tế trước và sau khi làm nail tại NanaNail Đà Lạt. Sơn gel, nail art, acrylic đẹp tự nhiên.',
    keywords: 'kết quả nail, trước sau nail, nail art đẹp Đà Lạt',
  });

  const [items, setItems] = useState(fallbackItems);
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  useEffect(() => {
    apiClient.get('/before-after')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        }
      })
      .catch(err => console.error('Failed to fetch before-after items:', err));
  }, []);

  const categories = ['Tất cả', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = activeFilter === 'Tất cả' ? items : items.filter(i => i.category === activeFilter);

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
            <Sparkles size={14} />
            So Sánh Trước & Sau
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            Biến Đổi <span className="text-gradient">Diệu Kỳ</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg"
          >
            Kéo thanh trượt để thấy sự thay đổi ấn tượng trước và sau khi làm nail tại NanaNail
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 sm:mb-10">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              className={`pill ${activeFilter === c ? 'pill-active' : 'pill-inactive'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <BeforeAfterSlider
                before={item.before_image}
                after={item.after_image}
                caption={item.title || item.description}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Không có hình ảnh trong danh mục này</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-14">
          <p className="text-gray-500 mb-5 text-sm sm:text-base">
            Bạn muốn có một bộ móng đẹp như thế này?
          </p>
          <Link to="/booking" className="btn-primary px-8 py-3.5 text-base shadow-glow-pink">
            <CalendarHeart size={18} />
            Đặt Lịch Ngay Hôm Nay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BeforeAfterPage;
