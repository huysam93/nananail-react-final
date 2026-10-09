import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Newspaper, Clock, Tag, ArrowRight, Search } from 'lucide-react';

// ─── Post Card ─────────────────────────────────────────────────────────────────
const PostCard = ({ post, index }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group bg-white rounded-2xl shadow-glass hover:shadow-card-hover border border-gray-100 hover:border-[#F8D7E6] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      {/* Cover image */}
      <div className="h-48 bg-gradient-to-br from-[#FDF0F5] to-[#FDE8F0] overflow-hidden flex-shrink-0 relative">
        {post.cover_image ? (
          <img
            src={post.cover_image.startsWith('data:') ? post.cover_image : post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="text-[#F0B3CC]" size={48} strokeWidth={1} />
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-pink-dark text-xs font-semibold px-2.5 py-1 rounded-full border border-[#F8D7E6]">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-serif font-bold text-gray-800 text-lg leading-snug mb-2 group-hover:text-brand-pink-dark transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
          {post.excerpt || 'Nhấp để đọc thêm...'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={12} />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <Link
            to={`/news/${post.slug || post.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink-dark hover:gap-2.5 transition-all duration-200"
          >
            Đọc thêm <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

// ─── NewsPage ──────────────────────────────────────────────────────────────────
const NewsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['Tất cả']);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/posts')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setPosts(data);
        const cats = ['Tất cả', ...new Set(data.map((p) => p.category).filter(Boolean))];
        setCategories(cats);
      })
      .catch((err) => {
        console.error(err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const safePosts = Array.isArray(posts) ? posts : [];
  const filtered = safePosts.filter((p) => {
    const matchCat = activeCategory === 'Tất cả' || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#FDF0F5] via-white to-[#FDF8FB] py-16 border-b border-[#F8D7E6]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#FDF0F5] text-brand-pink-dark rounded-full px-4 py-1.5 text-sm font-medium mb-4 border border-[#F8D7E6]"
          >
            <Newspaper size={14} />
            Tin Tức & Bài Viết
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            Tin Tức NanaNail
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto mb-6"
          >
            Cập nhật xu hướng nail mới nhất, tips chăm sóc móng và ưu đãi hấp dẫn
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#F8D7E6] rounded-full shadow-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-pink-medium focus:border-transparent"
            />
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill ${activeCategory === cat ? 'pill-active' : 'pill-inactive'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Newspaper size={48} strokeWidth={1} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">
              {searchQuery ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết nào'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsPage;
