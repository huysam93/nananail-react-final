import { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/axiosConfig';
import { Trash2, PlusCircle, UploadCloud, Tag, Sparkles, Filter, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../utils/imageHelper';

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ image_base64: null, tag: '' });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/gallery');
      setImages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch gallery images", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ image_base64: null, tag: '' });
    setPreview(null);
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        setFormData(prev => ({ ...prev, image_base64: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_base64) {
      alert('Vui lòng chọn một hình ảnh.');
      return;
    }
    try {
      await apiClient.post('/gallery', formData);
      fetchImages();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add image", error);
      alert('Lỗi: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi bộ sưu tập?')) {
      try {
        await apiClient.delete(`/gallery/${id}`);
        fetchImages();
      } catch (error) {
        console.error("Failed to delete image", error);
      }
    }
  };

  // Get unique tags
  const tagsList = useMemo(() => {
    const set = new Set();
    const list = Array.isArray(images) ? images : [];
    list.forEach(img => {
      if (img.tag) set.add(img.tag.trim());
    });
    return Array.from(set);
  }, [images]);

  const filteredImages = useMemo(() => {
    const list = Array.isArray(images) ? images : [];
    if (selectedTag === 'all') return list;
    return list.filter(img => img.tag && img.tag.trim().toLowerCase() === selectedTag.toLowerCase());
  }, [images, selectedTag]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="text-brand-pink-dark" size={20} />
            Bộ Sưu Tập Mẫu Nail ({filteredImages.length}/{images.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý các mẫu móng hiển thị trên trang chủ & trang bộ sưu tập</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="btn-primary px-4 py-2.5 text-xs font-semibold shadow-glow-pink"
        >
          <PlusCircle size={16} />
          Thêm Ảnh Mới
        </button>
      </div>

      {/* Filter by Tag */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter size={12} /> Lọc theo Tag:
        </span>
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedTag === 'all'
              ? 'bg-brand-pink-dark text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Tất cả ({images.length})
        </button>

        {tagsList.map(tag => {
          const count = images.filter(i => i.tag && i.tag.trim() === tag).length;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTag === tag
                  ? 'bg-brand-pink-dark text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              #{tag} ({count})
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl">Đang tải bộ sưu tập...</div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl">Chưa có hình ảnh nào trong bộ sưu tập này.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="relative group aspect-square rounded-2xl overflow-hidden shadow-soft border border-gray-100 bg-gray-50"
            >
              <img
                src={getImageUrl(image.image_base64)}
                alt={image.tag || 'Nail design'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-all hover:scale-110 shadow-lg"
                  title="Xóa ảnh này"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Tag label badge */}
              {image.tag && (
                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                  #{image.tag}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Add New Image */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-serif font-bold text-gray-800 mb-1">Thêm Ảnh Mới Vào Bộ Sưu Tập</h3>
              <p className="text-xs text-gray-500 mb-5">Tải lên mẫu móng đẹp nhất để quảng bá dịch vụ của NanaNail</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Hình Ảnh</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-brand-pink transition-colors bg-gray-50/50">
                    {preview ? (
                      <div className="relative inline-block group">
                        <img src={preview} alt="Preview" className="h-40 w-auto rounded-xl object-cover shadow-soft mx-auto" />
                        <button
                          type="button"
                          onClick={() => { setPreview(null); setFormData(p => ({ ...p, image_base64: null })); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="file-upload-gallery" className="cursor-pointer block">
                        <UploadCloud className="mx-auto h-12 w-12 text-brand-pink-dark/60 mb-2" />
                        <span className="text-sm font-semibold text-brand-pink-dark">Nhấp để tải ảnh lên</span>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP tối đa 10MB</p>
                        <input
                          id="file-upload-gallery"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Phân Loại / Tag</label>
                  <input
                    name="tag"
                    value={formData.tag}
                    onChange={handleTextChange}
                    placeholder="Ví dụ: Ombre, Tết, Noel, Đính Đá, Mắt Mèo"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium"
                  />
                  {/* Quick Tag suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Ombre', 'Sơn Gel', 'Đính Đá', 'Mắt Mèo', 'Tết', 'Pháp (French)'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, tag: t }))}
                        className="text-[11px] bg-brand-pink-light text-brand-pink-dark font-medium px-2 py-0.5 rounded-md hover:bg-brand-pink transition-colors"
                      >
                        +{t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-5 py-2 text-xs font-semibold"
                  >
                    Lưu Ảnh
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageGallery;