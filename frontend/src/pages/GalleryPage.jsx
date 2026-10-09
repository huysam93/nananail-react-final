import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ImageIcon, CalendarHeart, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePageSEO from '../hooks/usePageSEO';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/imageHelper';

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ images, activeIndex, onClose, onPrev, onNext }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState(null);
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? onNext() : onPrev();
    }
    setTouchStart(null);
  };

  const image = images[activeIndex];
  const isSaved = isInWishlist(image.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-20"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={getImageUrl(image.image_base64)}
            alt={image.tag || 'Nail art'}
            className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
          />

          {/* Bottom info bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-lg">
            {image.tag && (
              <span className="bg-white/15 backdrop-blur-xs text-white text-sm px-4 py-1.5 rounded-full">
                {image.tag}
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => toggleWishlist(image)}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                  isSaved
                    ? 'bg-brand-pink-dark text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart size={15} className={isSaved ? 'fill-white' : ''} />
                {isSaved ? 'Đã lưu' : 'Lưu mẫu'}
              </button>

              <Link
                to={`/booking?note=${encodeURIComponent('Muốn làm mẫu: ' + (image.tag || 'Gallery #' + (activeIndex + 1)))}`}
                className="inline-flex items-center gap-2 bg-white text-brand-pink-dark text-sm font-semibold px-5 py-2 rounded-full hover:bg-brand-pink-light hover:shadow-glow-pink transition-all"
                onClick={onClose}
              >
                <CalendarHeart size={14} />
                Muốn làm mẫu này
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Prev/Next */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-xs">
          {activeIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── GalleryPage ───────────────────────────────────────────────────────────────
const GalleryPage = () => {
  usePageSEO({
    title: 'Bộ Sưu Tập Nail | NanaNail Đà Lạt',
    description: 'Khám phá bộ sưu tập nail art đẹp tại NanaNail Đà Lạt: Gel, Acrylic, Nail Art sáng tạo.',
  });

  const { isInWishlist, toggleWishlist } = useWishlist();
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [activeTag, setActiveTag] = useState('Tất cả');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    apiClient.get('/gallery')
      .then(res => {
        const fetchedImages = res.data;
        setImages(fetchedImages);
        setFilteredImages(fetchedImages);
        const allTags = ['Tất cả', ...new Set(fetchedImages.map(img => img.tag).filter(Boolean))];
        setTags(allTags);
      })
      .catch(err => console.error('Failed to fetch gallery:', err));
  }, []);

  const handleFilter = (tag) => {
    setActiveTag(tag);
    setFilteredImages(tag === 'Tất cả' ? images : images.filter(img => img.tag === tag));
  };

  const getTagCount = (tag) => {
    if (tag === 'Tất cả') return images.length;
    return images.filter(img => img.tag === tag).length;
  };

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback(() => {
    setLightboxIndex(i => (i - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);
  const nextImage = useCallback(() => {
    setLightboxIndex(i => (i + 1) % filteredImages.length);
  }, [filteredImages.length]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="page-hero">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge mx-auto"
          >
            <ImageIcon size={14} />
            Bộ Sưu Tập
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            Tác Phẩm <span className="text-gradient">Nghệ Thuật</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg"
          >
            Khám phá những mẫu nail đầy nghệ thuật và sáng tạo tại NanaNail
          </motion.p>
        </div>
      </section>

      {/* Filter pills */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => handleFilter(tag)}
              className={`pill ${activeTag === tag ? 'pill-active' : 'pill-inactive'}`}
            >
              {tag}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTag === tag ? 'bg-white/25' : 'bg-gray-100'}`}>
                {getTagCount(tag)}
              </span>
            </button>
          ))}
        </div>

        {/* Result count + info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            {filteredImages.length} mẫu nail
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">
            💡 Click ❤️ để lưu mẫu yêu thích hoặc click vào ảnh để xem chi tiết
          </p>
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          <AnimatePresence>
            {filteredImages.map((image, i) => {
              const isSaved = isInWishlist(image.id);
              return (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid rounded-2xl overflow-hidden border border-rose-100 shadow-md hover:shadow-xl shadow-rose-900/5 cursor-pointer group relative transition-all duration-300 hover:-translate-y-1"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={getImageUrl(image.image_base64)}
                    alt={image.tag || 'Nail art'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Heart button (top-right corner ALWAYS visible on mobile/hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(image);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                      isSaved
                        ? 'bg-brand-pink-dark text-white shadow-glow-pink scale-105'
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-brand-pink-dark backdrop-blur-xs'
                    }`}
                    title={isSaved ? 'Bỏ lưu' : 'Lưu mẫu này'}
                  >
                    <Heart size={15} className={isSaved ? 'fill-white' : ''} />
                  </button>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-pink-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 gap-2">
                    {image.tag && (
                      <span className="bg-white/90 text-brand-pink-dark text-xs font-semibold px-3 py-1 rounded-full w-fit">
                        {image.tag}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/booking?note=${encodeURIComponent('Muốn làm mẫu: ' + (image.tag || 'Gallery #' + image.id))}`}
                        className="bg-white text-brand-pink-dark text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-pink-light transition-colors inline-flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CalendarHeart size={12} />
                        Muốn làm mẫu này
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon size={48} className="text-gray-200 mx-auto mb-4" strokeWidth={1} />
            <p className="text-gray-400 text-lg">Chưa có ảnh nào trong danh mục này</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/booking" className="btn-primary px-8 py-3.5 text-base">
            <Sparkles size={18} />
            Đặt Lịch Ngay
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

export default GalleryPage;