import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, CalendarHeart, Sparkles, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const handleBookingWithWishlist = () => {
    const tagsOrNames = wishlist.map((item, idx) => item.tag || `Mẫu #${idx + 1}`).join(', ');
    const note = encodeURIComponent(`Mẫu đã chọn từ Wishlist (${wishlist.length} mẫu): ${tagsOrNames}`);
    onClose();
    window.location.href = `/booking?note=${note}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[1900]"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[1950] flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-brand-pink-light flex items-center justify-between bg-gradient-to-r from-brand-pink-light/40 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-pink-light flex items-center justify-center text-brand-pink-dark">
                  <Heart size={18} className="fill-brand-pink-dark" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-gray-800 text-lg">Mẫu Nail Đã Lưu</h3>
                  <p className="text-xs text-gray-400">{wishlist.length} mẫu trong danh sách</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {wishlist.length > 0 ? (
                <>
                  <div className="flex items-center justify-between text-xs text-gray-400 pb-1">
                    <span>Danh sách ưu thích của bạn</span>
                    <button
                      onClick={clearWishlist}
                      className="text-red-500 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 size={12} />
                      Xóa tất cả
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {wishlist.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative rounded-xl overflow-hidden border border-brand-pink-light/60 bg-white shadow-sm hover:shadow-card-hover transition-all"
                      >
                        <img
                          src={getImageUrl(item.image_base64)}
                          alt={item.tag || 'Saved design'}
                          className="w-full h-36 object-cover"
                        />
                        {/* Tag */}
                        {item.tag && (
                          <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {item.tag}
                          </span>
                        )}
                        {/* Remove button */}
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center transition-all opacity-90 hover:scale-110 shadow-sm"
                          aria-label="Remove item"
                        >
                          <X size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-pink-light/60 flex items-center justify-center mb-4 text-brand-pink-dark">
                    <Heart size={32} className="stroke-1 text-brand-pink-medium" />
                  </div>
                  <h4 className="font-serif font-bold text-gray-700 text-base mb-1">Chưa Có Mẫu Nào</h4>
                  <p className="text-xs text-gray-400 max-w-xs mb-6 leading-relaxed">
                    Hãy bấm biểu tượng trái tim ❤️ tại trang Gallery để lưu lại những mẫu nail bạn yêu thích nhé!
                  </p>
                  <Link
                    to="/gallery"
                    onClick={onClose}
                    className="btn-primary text-xs px-5 py-2.5"
                  >
                    <Sparkles size={14} />
                    Khám Phá Gallery
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {wishlist.length > 0 && (
              <div className="p-5 border-t border-brand-pink-light/60 bg-gray-50/80 space-y-3">
                <button
                  onClick={handleBookingWithWishlist}
                  className="btn-primary w-full py-3 text-sm justify-center"
                >
                  <CalendarHeart size={16} />
                  Đặt Lịch Với Các Mẫu Đã Chọn ({wishlist.length})
                </button>
                <Link
                  to="/gallery"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 text-xs text-brand-pink-dark font-medium hover:underline text-center"
                >
                  Xem thêm mẫu khác <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
