import { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';
import ReviewCard from '../components/shared/ReviewCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, Image, Upload, X } from 'lucide-react';
import usePageSEO from '../hooks/usePageSEO';

const RatingSummary = ({ reviews, filterRating, onFilterRating }) => {
  if (!reviews.length) return null;
  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const counts = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100),
  }));

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg shadow-rose-900/5 p-6 mb-8 max-w-lg mx-auto border border-rose-100 transition-all">
      <div className="flex items-center gap-6">
        <div className="text-center flex-shrink-0">
          <div className="text-5xl font-bold text-gray-800 font-serif">{avg}</div>
          <div className="flex justify-center mt-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
            ))}
          </div>
          <div className="text-xs text-gray-400">{reviews.length} đánh giá</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {counts.map(({ n, count, pct }) => (
            <button
              key={n}
              onClick={() => onFilterRating(filterRating === n ? null : n)}
              className={`flex items-center gap-2 w-full rounded-lg px-2 py-1 transition-colors ${
                filterRating === n ? 'bg-brand-pink-light/80 text-brand-pink-dark font-semibold' : 'hover:bg-brand-pink-light/30'
              }`}
            >
              <span className="text-xs text-gray-600 w-3">{n}</span>
              <Star size={11} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
            </button>
          ))}
        </div>
      </div>
      {filterRating && (
        <div className="mt-3 pt-2 border-t border-gray-100 text-center">
          <button onClick={() => onFilterRating(null)} className="text-xs text-brand-pink-dark font-medium hover:underline">
            ✕ Bỏ lọc {filterRating} sao (hiện tất cả {reviews.length} đánh giá)
          </button>
        </div>
      )}
    </div>
  );
};

const ReviewForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({ customer_name: '', content: '', rating: 5 });
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.content) return;
    setStatus('loading');
    try {
      await apiClient.post('/reviews', {
        ...formData,
        image: imagePreview,
      });
      setStatus('success');
      setFormData({ customer_name: '', content: '', rating: 5 });
      setImagePreview(null);
      if (onSubmitSuccess) onSubmitSuccess();
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg shadow-rose-900/5 p-6 sm:p-7 max-w-xl mx-auto mt-12 border border-rose-100 transition-all">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-brand-pink-light rounded-xl flex items-center justify-center text-brand-pink-dark">
          <MessageSquare size={18} />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-gray-800">Chia Sẻ Trải Nghiệm Của Bạn</h3>
          <p className="text-xs text-gray-400">Ý kiến của bạn giúp NanaNail hoàn thiện hơn mỗi ngày</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ Và Tên</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
            placeholder="Nhập tên của bạn..."
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số Sao Đánh Giá</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="transition-transform hover:scale-110 p-0.5"
              >
                <Star
                  size={28}
                  className={star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội Dung Đánh Giá</label>
          <textarea
            rows={3}
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            placeholder="Chia sẻ trải nghiệm làm nail của bạn tại NanaNail..."
            className="input-field resize-none"
            required
          />
        </div>

        {/* Optional Image Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ảnh Mẫu Móng Của Bạn <span className="text-gray-400 text-xs font-normal">(Tùy chọn)</span>
          </label>
          {imagePreview ? (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-brand-pink-light">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-brand-pink-dark cursor-pointer text-xs text-gray-500 hover:bg-brand-pink-light/30 transition-all w-fit">
              <Upload size={14} className="text-brand-pink-dark" />
              Tải ảnh lên (PNG, JPG)
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {status === 'success' && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            ✅ Cảm ơn bạn! Đánh giá đã được ghi nhận thành công và sẽ được duyệt hiển thị sớm.
          </div>
        )}
        {status === 'error' && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            Đã có lỗi xảy ra. Vui lòng thử lại.
          </div>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3.5 text-sm">
          {status === 'loading' ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Đang gửi...</>
          ) : (
            <><Send size={16} />Gửi Đánh Giá</>
          )}
        </button>
      </form>
    </div>
  );
};

const ReviewsPage = () => {
  usePageSEO({
    title: 'Đánh Giá Khách Hàng | NanaNail Đà Lạt',
    description: 'Xem đánh giá thực tế từ khách hàng về dịch vụ nail tại NanaNail Đà Lạt: Sơn gel, nail art, vẽ hoạt hình, đính đá.',
  });

  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState(null);

  const fetchReviews = () => {
    apiClient.get('/reviews')
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Failed to fetch reviews:', err);
        setReviews([]);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const filteredReviews = filterRating ? safeReviews.filter(r => r.rating === filterRating) : safeReviews;

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
            <Star size={14} className="fill-brand-pink-dark" />
            Đánh Giá Từ Khách Hàng
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            Khách Hàng <span className="text-gradient">Nói Gì Về NanaNail?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg"
          >
            Sự hài lòng và trải nghiệm của bạn là động lực lớn nhất của salon
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Rating Summary */}
        <RatingSummary
          reviews={reviews}
          filterRating={filterRating}
          onFilterRating={setFilterRating}
        />

        {/* Reviews Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Chưa có đánh giá nào {filterRating ? `cho ${filterRating} sao` : ''}</p>
          </div>
        )}

        {/* Review Form */}
        <ReviewForm onSubmitSuccess={fetchReviews} />
      </section>
    </div>
  );
};

export default ReviewsPage;