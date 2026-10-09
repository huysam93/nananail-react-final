import { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/axiosConfig';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Clock, Tag, UploadCloud, X } from 'lucide-react';

const CATEGORIES = ['Tin tức', 'Xu hướng nail', 'Chăm sóc móng', 'Ưu đãi', 'Hướng dẫn', 'Khác'];

const statusConfig = {
  published: { label: 'Đã đăng', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-600' },
};

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: 'Tin tức',
  status: 'published',
  author: 'NanaNail',
};

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState('all');
  const [coverPreview, setCoverPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await apiClient.get('/posts/all');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch {
      try {
        const res = await apiClient.get('/posts');
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch {
        setPosts([]);
      }
    }
  };

  const handleOpenModal = (post = null) => {
    setCurrentPost(post);
    setFormData(post ? { ...post } : EMPTY_FORM);
    // Nếu chỉnh sửa bài đã có ảnh -> hiện preview luôn
    setCoverPreview(post?.cover_image || null);
    setIsModalOpen(true);
  };

  // Convert file -> base64 data URI
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUri = reader.result; // full data URI
      setCoverPreview(dataUri);
      setFormData(prev => ({ ...prev, cover_image: dataUri }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData(prev => ({ ...prev, cover_image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    try {
      if (currentPost) {
        await apiClient.put(`/posts/${currentPost.id}`, formData);
      } else {
        await apiClient.post('/posts', formData);
      }
      fetchPosts();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save post', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    await apiClient.delete(`/posts/${id}`);
    fetchPosts();
  };

  const handleToggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await apiClient.put(`/posts/${post.id}`, { ...post, status: newStatus });
    fetchPosts();
  };

  const postList = Array.isArray(posts) ? posts : [];
  const filtered = filter === 'all' ? postList : postList.filter(p => p.status === filter);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {[
          { key: 'all', label: `Tất cả (${postList.length})` },
          { key: 'published', label: `Đã đăng (${postList.filter(p => p.status === 'published').length})` },
          { key: 'draft', label: `Nháp (${postList.filter(p => p.status === 'draft').length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === tab.key ? 'bg-brand-pink-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={() => handleOpenModal()}
            className="bg-brand-pink-dark text-white px-4 py-2 rounded-lg flex items-center text-sm hover:bg-brand-pink-medium transition-colors"
          >
            <PlusCircle size={16} className="mr-2" /> Viết Bài Mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Tiêu Đề</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Danh Mục</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Tác Giả</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Ngày</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Trạng Thái</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((post) => {
              const st = statusConfig[post.status] || statusConfig.draft;
              return (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-sm text-gray-800 truncate">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{post.excerpt}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 bg-[#FDF0F5] text-brand-pink-dark text-xs px-2 py-0.5 rounded-full border border-[#F8D7E6]">
                      <Tag size={10} /> {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{post.author}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} /> {formatDate(post.created_at)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        title={post.status === 'published' ? 'Chuyển thành nháp' : 'Đăng bài'}
                        className={post.status === 'published' ? 'text-gray-400 hover:text-gray-600' : 'text-green-500 hover:text-green-700'}
                      >
                        {post.status === 'published' ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                      <button onClick={() => handleOpenModal(post)} className="text-blue-500 hover:text-blue-700">
                        <Edit size={17} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Chưa có bài viết nào</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {currentPost ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu Đề *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="input-field"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả Ngắn</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn hiển thị trong danh sách bài viết..."
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội Dung *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Viết nội dung bài viết... (hỗ trợ xuống dòng)"
                  className="input-field resize-none font-mono text-sm"
                  rows={10}
                  required
                />
              </div>

              {/* Cover image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Bìa</label>
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-colors ${
                    coverPreview ? 'border-[#F8D7E6] bg-[#FDF8FB]' : 'border-gray-300 hover:border-brand-pink-medium'
                  }`}
                >
                  {coverPreview ? (
                    // Preview ảnh đã chọn
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                        title="Xóa ảnh"
                      >
                        <X size={14} />
                      </button>
                      <label
                        htmlFor="cover-upload"
                        className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-brand-pink-dark text-xs font-medium px-3 py-1.5 rounded-full border border-[#F8D7E6] cursor-pointer hover:bg-white transition-colors shadow-sm"
                      >
                        Đổi ảnh
                      </label>
                    </div>
                  ) : (
                    // Khu vực kéo thả / click chọn ảnh
                    <label
                      htmlFor="cover-upload"
                      className="flex flex-col items-center justify-center py-8 cursor-pointer"
                    >
                      <UploadCloud className="text-gray-400 mb-2" size={36} strokeWidth={1.5} />
                      <span className="text-sm font-medium text-brand-pink-dark">Nhấp để tải ảnh lên</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — tối đa 10MB</span>
                    </label>
                  )}
                  <input
                    ref={fileInputRef}
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCoverUpload}
                  />
                </div>
              </div>

              {/* Category + Status + Author row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh Mục</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                    <option value="published">Đăng ngay</option>
                    <option value="draft">Lưu nháp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tác Giả</label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="NanaNail"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary text-sm px-6 py-2.5">
                  {currentPost ? 'Cập Nhật' : 'Đăng Bài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePosts;
