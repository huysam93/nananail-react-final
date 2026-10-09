/* Hallmark · genre: modern-minimal · theme: Soft Light Pink & Blush · design-system: design.md · designed-as-app */
import { useEffect, useState, useRef } from 'react';
import apiClient from '../api/axiosConfig';
import ServiceCard from '../components/shared/ServiceCard';
import ReviewCard from '../components/shared/ReviewCard';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Award, Gem, Heart, Smile, ArrowRight, Newspaper, Gift, Sparkles, CalendarHeart, Clock, CheckCircle } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import AppointmentScheduler from '../components/AppointmentScheduler';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/imageHelper';

// ─── Hero Slider (Vivid Images with Soft Dark Gradient for Readability) ─────────
const HeroSlider = ({ images = [] }) => {
  const safeImages = Array.isArray(images) ? images : [];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (newIndex) => {
    if (!safeImages.length) return;
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  };

  const prev = () => {
    if (!safeImages.length) return;
    const newIndex = (index - 1 + safeImages.length) % safeImages.length;
    goTo(newIndex);
  };

  const next = () => {
    if (!safeImages.length) return;
    const newIndex = (index + 1) % safeImages.length;
    goTo(newIndex);
  };

  useEffect(() => {
    if (!safeImages.length) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [index, safeImages.length]);

  const HeroContent = () => (
    <div className="relative container mx-auto px-6 h-full flex flex-col justify-center text-center text-white z-10 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 text-rose-200 font-semibold tracking-[0.25em] text-xs uppercase mb-3 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mx-auto border border-white/20"
      >
        <Sparkles size={14} className="text-rose-300" />
        ✦ Tiệm Nail Số 1 Đà Lạt ✦
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.15] mb-5 text-white drop-shadow-md"
      >
        Vẻ Đẹp Tinh Tế Trên <br />
        <span className="text-pink-300">Từng Ngón Tay</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-base md:text-lg max-w-xl mx-auto text-white/90 leading-relaxed mb-8 font-light drop-shadow-sm"
      >
        Trải nghiệm nghệ thuật làm móng chuyên nghiệp và thư giãn trong không gian ấm cúng tại NanaNail.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="flex flex-wrap gap-4 items-center justify-center"
      >
        <Link to="/booking" className="btn-primary px-8 py-4 text-base shadow-glow-pink">
          <CalendarHeart size={18} />
          Đặt Lịch Ngay
        </Link>
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/60 text-white font-medium hover:bg-white/20 backdrop-blur-sm transition-all text-base"
        >
          Xem Bộ Sưu Tập
        </Link>
      </motion.div>
    </div>
  );

  if (!safeImages.length) {
    return (
      <div
        className="relative h-[82vh] min-h-[540px] bg-cover bg-center text-white flex items-center"
        style={{ backgroundImage: "url('https://r2.flowith.net/files/o/1750308709889-swarovski_crystal_gel_nail_design_index_6@1536x1024.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <HeroContent />
      </div>
    );
  }

  return (
    <div className="relative h-[82vh] min-h-[540px] w-full overflow-hidden bg-stone-900">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(safeImages[index]?.image_base64)})` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Dark semi-transparent gradient overlay to make background image popping & text legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15" />

      <HeroContent />

      {/* Prev/Next arrows on sides */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all z-10 border border-white/20"
        aria-label="Slide trước"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all z-10 border border-white/20"
        aria-label="Slide tiếp"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {safeImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === index ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Chuyển tới slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Stat Strip (Light Pink Soft Bar) ──────────────────────────────────────────
const StatsStrip = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { value: 500, suffix: '+', label: 'Khách hàng hài lòng', icon: <Smile className="text-brand-pink-dark" size={20} /> },
    { value: 5, suffix: '+', label: 'Năm kinh nghiệm', icon: <Award className="text-brand-pink-dark" size={20} /> },
    { value: 4.9, suffix: '★', label: 'Đánh giá trung bình', icon: <Star className="text-amber-500 fill-amber-400" size={20} />, decimals: 1 },
    { value: 50, suffix: '+', label: 'Mẫu Nail sáng tạo', icon: <Gem className="text-brand-pink-dark" size={20} /> },
  ];

  return (
    <div className="border-b border-pink-100 bg-[#FFF3F7] py-7" ref={ref}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3.5 bg-white p-4.5 rounded-2xl border border-pink-200/90 shadow-[0_6px_20px_rgba(219,39,119,0.07)] hover:shadow-[0_12px_30px_rgba(219,39,119,0.15)] transition-all">
              <div className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 border border-pink-100">
                {stat.icon}
              </div>
              <div>
                <div className="text-xl md:text-2xl font-serif font-bold text-brand-pink-dark leading-tight">
                  {inView ? (
                    <CountUp start={0} end={stat.value} duration={2} decimals={stat.decimals || 0} suffix={stat.suffix} />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Gallery Carousel (Light Cards) ────────────────────────────────────────────
const GalleryCarousel = ({ images = [] }) => {
  const safeImages = Array.isArray(images) ? images : [];
  const { isInWishlist, toggleWishlist } = useWishlist();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  if (!safeImages.length) return null;

  return (
    <div className="relative group/gallery">
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 py-2 scrollbar-hide snap-x snap-mandatory">
        {safeImages.map((image) => {
          const isSaved = isInWishlist(image.id);
          return (
            <div
              key={image.id}
              className="relative flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 snap-start rounded-2xl overflow-hidden shadow-[0_8px_25px_rgba(219,39,119,0.09)] group border border-pink-200/90 bg-white"
            >
              <img
                src={getImageUrl(image.image_base64)}
                alt={image.tag || 'Nail art'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(image);
                }}
                className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                  isSaved
                    ? 'bg-brand-pink-dark text-white shadow-glow-pink scale-105'
                    : 'bg-white/85 text-gray-600 hover:bg-white hover:text-brand-pink-dark shadow-sm'
                }`}
                title={isSaved ? 'Bỏ lưu' : 'Lưu mẫu này'}
              >
                <Heart size={14} className={isSaved ? 'fill-white' : ''} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button
          onClick={() => scroll(-1)}
          className="w-9 h-9 rounded-full border border-pink-200 bg-white text-gray-700 hover:bg-pink-50 transition-colors flex items-center justify-center shadow-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="w-9 h-9 rounded-full border border-pink-200 bg-white text-gray-700 hover:bg-pink-50 transition-colors flex items-center justify-center shadow-sm"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ─── Before / After Slider ──────────────────────────────────────────────────
const BeforeAfterHomeSlider = ({ before, after, title }) => {
  const [pos, setPos] = useState(50);
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
        <img src={getImageUrl(after)} alt="Sau" className={`${imgClass} absolute inset-0`} />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={getImageUrl(before)} alt="Trước" className={imgClass} style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }} />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 flex items-center justify-center pointer-events-none"
          style={{ left: `${pos}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-md text-brand-pink-dark flex items-center justify-center border border-pink-200 text-xs font-bold">
            ↔
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-xs font-medium">TRƯỚC</div>
        <div className="absolute top-3 right-3 bg-brand-pink-dark/90 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-xs font-medium">SAU</div>
      </div>
      {title && (
        <div className="p-3.5 text-center font-serif font-bold text-sm text-gray-800 bg-white">
          {title}
        </div>
      )}
    </div>
  );
};

// ─── Main HomePage Component ───────────────────────────────────────────────────
const HomePage = () => {
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [beforeAfterList, setBeforeAfterList] = useState([]);

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, reviewsRes, sliderRes, galleryRes, postsRes, baRes] = await Promise.all([
          apiClient.get('/services?_limit=3').catch(() => ({ data: [] })),
          apiClient.get('/reviews?_limit=3').catch(() => ({ data: [] })),
          apiClient.get('/slider').catch(() => ({ data: [] })),
          apiClient.get('/gallery?_limit=8').catch(() => ({ data: [] })),
          apiClient.get('/posts?_limit=2').catch(() => ({ data: [] })),
          apiClient.get('/before-after?_limit=2').catch(() => ({ data: [] })),
        ]);
        setServices(Array.isArray(servicesRes?.data) ? servicesRes.data : []);
        setReviews(Array.isArray(reviewsRes?.data) ? reviewsRes.data : []);
        setSliderImages(Array.isArray(sliderRes?.data) ? sliderRes.data : []);
        setGalleryImages(Array.isArray(galleryRes?.data) ? galleryRes.data : []);
        setPosts(Array.isArray(postsRes?.data) ? postsRes.data : []);
        setBeforeAfterList(Array.isArray(baRes?.data) ? baRes.data : []);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      }
    };
    fetchData();
  }, []);

  const fallbackPromos = [
    { id: 1, badge: 'HOT', title: 'Combo Gel + Nail Art', discount_percent: 15, description: 'Sơn gel màu + vẽ nail art 2 ngón' },
    { id: 2, badge: 'SINH NHẬT', title: 'Giảm 30% Sinh Nhật', discount_percent: 30, description: 'Tặng 30% cho khách có sinh nhật trong tháng' },
  ];

  return (
    <div className="bg-[#FAF4F6] text-gray-800 min-h-screen">
      {/* ── 1. Hero Block & Stats Strip ────────────────────────────────────────── */}
      <HeroSlider images={sliderImages} />
      <StatsStrip />

      {/* ── 2. Light Bento Grid: Services & Special Offers ─────────────────────── */}
      <section className="py-16 md:py-20 bg-[#FAF4F6]">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-pink-200/60 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                Dịch Vụ & Ưu Đãi Nổi Bật
              </h2>
              <p className="text-gray-600 mt-1.5 text-base max-w-xl">
                Khám phá dịch vụ nail chất lượng cao và các gói ưu đãi tại NanaNail Đà Lạt.
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink-dark hover:underline">
              Xem tất cả dịch vụ <ArrowRight size={16} />
            </Link>
          </div>

          {/* Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Main Column: Services Showcase (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="h-full">
                    <ServiceCard service={service} />
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="p-8 text-center bg-pink-50/50 rounded-2xl col-span-2 text-gray-400">
                    Đang tải danh sách dịch vụ...
                  </div>
                )}
              </div>

              {/* 3 Step Process Strip */}
              <div className="bg-white border border-pink-200/90 rounded-2xl p-6 md:p-7 shadow-[0_8px_25px_rgba(219,39,119,0.08)]">
                <h3 className="font-serif text-lg font-bold text-brand-pink-dark mb-3">
                  Quy Trình Phục Vụ 3 Bước
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs md:text-sm">
                  <div className="bg-[#FFF5F8] p-4 rounded-xl border border-pink-100">
                    <span className="text-brand-pink-dark font-bold block mb-1">01. Chọn Dịch Vụ</span>
                    <span className="text-gray-600">Xem menu & chọn mẫu nail yêu thích.</span>
                  </div>
                  <div className="bg-[#FFF5F8] p-4 rounded-xl border border-pink-100">
                    <span className="text-brand-pink-dark font-bold block mb-1">02. Đặt Lịch Online</span>
                    <span className="text-gray-600">Chọn giờ phù hợp trong 30 giây.</span>
                  </div>
                  <div className="bg-[#FFF5F8] p-4 rounded-xl border border-pink-100">
                    <span className="text-brand-pink-dark font-bold block mb-1">03. Thư Giãn</span>
                    <span className="text-gray-600">Đến tiệm và tận hưởng trải nghiệm.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Special Offers & News (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Promotions Box */}
              <div className="bg-white border border-pink-200/90 rounded-2xl p-6 shadow-[0_8px_25px_rgba(219,39,119,0.08)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink-dark inline-flex items-center gap-1.5">
                    <Gift size={15} /> Ưu Đãi Đặc Biệt
                  </span>
                  <Link to="/promotions" className="text-xs font-semibold text-gray-500 hover:text-brand-pink-dark">
                    Xem tất cả
                  </Link>
                </div>

                <div className="space-y-3">
                  {fallbackPromos.map((promo) => (
                    <div key={promo.id} className="bg-[#FFF5F8] p-4 rounded-xl border border-pink-100 flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-white bg-brand-pink-dark px-2 py-0.5 rounded-full">
                          {promo.badge}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-gray-800 mt-1">{promo.title}</h4>
                        <p className="text-xs text-gray-500">{promo.description}</p>
                      </div>
                      <span className="text-xl font-bold text-brand-pink-dark font-serif pl-3">
                        -{promo.discount_percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* News & Tips Card */}
              <div className="bg-white border border-pink-200/90 rounded-2xl p-6 shadow-[0_8px_25px_rgba(219,39,119,0.08)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 inline-flex items-center gap-1.5">
                    <Newspaper size={15} className="text-brand-pink-dark" /> Bí Quyết Làm Đẹp
                  </span>
                  <Link to="/news" className="text-xs font-semibold text-gray-500 hover:text-brand-pink-dark">
                    Tin tức
                  </Link>
                </div>

                {posts.length > 0 ? (
                  <div className="space-y-3.5">
                    {posts.map((post) => (
                      <div key={post.id} className="group border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <Link to={`/news/${post.slug || post.id}`} className="font-serif font-bold text-sm text-gray-800 group-hover:text-brand-pink-dark transition-colors line-clamp-1">
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{post.excerpt}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Cập nhật tin tức mới nhất tại chuyên mục tin tức...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Booking Workbench ─────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#FAF4F6] via-[#FFF5F8] to-[#FAF4F6]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold tracking-widest text-brand-pink-dark uppercase block mb-1">
              ✦ Đặt Lịch Hẹn Trực Tuyến
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Đặt Lịch Tại NanaNail
            </h2>
            <p className="text-gray-600 text-base">
              Chọn ngày giờ phù hợp – Chúng tôi sẽ tự động lưu lịch và gửi xác nhận cho bạn.
            </p>
          </div>

          <div className="bg-white border border-pink-200/90 text-gray-800 rounded-3xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(219,39,119,0.10)]">
            <AppointmentScheduler />
          </div>
        </div>
      </section>

      {/* ── 3.5 Before & After Interactive Showcase ─────────────────────────── */}
      {beforeAfterList.length > 0 && (
        <section className="py-14 md:py-16 bg-[#FFF5F8] border-t border-pink-100/80">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-pink-200/60 gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-brand-pink-dark uppercase block mb-1">
                  ✦ Biến Hóa Kỳ Diệu
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                  So Sánh Trước & Sau Khi Làm Nail
                </h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Kéo thanh trượt để cảm nhận sự thay đổi trước và sau khi làm móng tại NanaNail.
                </p>
              </div>
              <Link to="/before-after" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink-dark hover:underline">
                Xem tất cả mẫu so sánh <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {beforeAfterList.map((item) => (
                <BeforeAfterHomeSlider
                  key={item.id}
                  before={item.before_image}
                  after={item.after_image}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Community Proof & Gallery Showcase ────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#FFF8FA] border-t border-pink-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Customer Reviews (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full px-4 py-1 text-xs font-semibold mb-3">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {avgRating}/5 từ khách hàng
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">
                  Cảm Nhận Khách Hàng
                </h2>
                <p className="text-gray-500 text-sm mt-1.5">
                  Sự hài lòng của quý khách là niềm tự hào lớn nhất của NanaNail.
                </p>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              <Link to="/reviews" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink-dark hover:underline pt-1">
                Xem tất cả đánh giá <ArrowRight size={14} />
              </Link>
            </div>

            {/* Gallery Showcase (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">
                    Bộ Sưu Tập Mới Nhất
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">Các mẫu nail art được thực hiện tại tiệm.</p>
                </div>
                <Link to="/gallery" className="text-xs font-semibold text-brand-pink-dark hover:underline">
                  Xem bộ sưu tập
                </Link>
              </div>

              <GalleryCarousel images={galleryImages} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Soft Blush CTA Banner ─────────────────────────────────────────── */}
      <section className="py-14 md:py-18 bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFF0F4] border-y border-pink-200/90 text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-brand-pink-dark font-semibold tracking-widest text-xs uppercase mb-3 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-pink-200 shadow-xs">
            <Sparkles size={14} className="text-brand-pink-dark" />
            ✦ Trải Nghiệm Thư Giãn Tinh Tế ✦
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3.5">
            Sẵn Sàng Cho <span className="text-brand-pink-dark">Bộ Móng Mới?</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-8 font-normal max-w-xl mx-auto leading-relaxed">
            Ghé thăm NanaNail Đà Lạt hoặc đặt lịch online ngay hôm nay để nhận ưu đãi hấp dẫn!
          </p>
          <Link
            to="/booking"
            className="btn-primary px-9 py-4 text-base shadow-glow-pink inline-flex items-center gap-2.5"
          >
            <CalendarHeart size={18} />
            Đặt Lịch Ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
