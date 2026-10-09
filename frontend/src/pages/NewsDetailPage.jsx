import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Tag, Newspaper } from 'lucide-react';

const NewsDetailPage = () => {
  const { idOrSlug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/posts/${idOrSlug}`)
      .then((res) => {
        if (res.data && !res.data.error && res.data.title) {
          setPost(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <div className="skeleton h-8 w-1/2 rounded mb-4" />
        <div className="skeleton h-64 rounded-2xl mb-6" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-4 rounded" style={{ width: `${85 - i * 5}%` }} />)}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16">
        <Newspaper size={56} strokeWidth={1} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-gray-700 mb-2">Không Tìm Thấy Bài Viết</h2>
        <p className="text-gray-400 mb-6">Bài viết này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/news" className="btn-primary">
          <ArrowLeft size={16} />
          Về Trang Tin Tức
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      {post.cover_image && (
        <div className="w-full h-64 md:h-96 bg-gray-100 overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {/* Back link */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm text-brand-pink-dark hover:text-brand-pink-medium font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Về Trang Tin Tức
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category badge */}
          <span className="inline-flex items-center gap-1.5 bg-[#FDF0F5] text-brand-pink-dark text-xs font-semibold px-3 py-1.5 rounded-full border border-[#F8D7E6] mb-4">
            <Tag size={12} />
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author || 'NanaNail'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {formatDate(post.created_at)}
            </span>
          </div>

          {/* Content */}
          <div
            className="prose prose-pink max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </motion.article>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 mb-4 font-medium">Bạn thấy bài viết hữu ích?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/news" className="btn-outline text-sm px-6 py-2.5">
              Xem Thêm Bài Viết
            </Link>
            <Link to="/booking" className="btn-primary text-sm px-6 py-2.5">
              Đặt Lịch Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
