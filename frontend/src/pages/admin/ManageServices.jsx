import { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/axiosConfig';
import { Edit, Trash2, PlusCircle, Search, Scissors, Star, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Gel',
    duration_minutes: 60,
    is_featured: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/services');
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch services", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    setCurrentService(service);
    setFormData(service ? { ...service } : {
      name: '',
      description: '',
      price: '',
      category: 'Gel',
      duration_minutes: 60,
      is_featured: 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentService) {
        await apiClient.put(`/services/${currentService.id}`, formData);
      } else {
        await apiClient.post('/services', formData);
      }
      fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save service", error);
      alert('Lỗi khi lưu dịch vụ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await apiClient.delete(`/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error("Failed to delete service", error);
      }
    }
  };

  const formatCurrency = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const categoriesList = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    const list = Array.isArray(services) ? services : [];
    return list.filter(s => {
      const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-800 flex items-center gap-2">
            <Scissors className="text-brand-pink-dark" size={20} />
            Quản Lý Danh Sách Dịch Vụ ({filteredServices.length}/{services.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Cập nhật giá, thời gian và dịch vụ nổi bật hiển thị trên website</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên dịch vụ..."
              className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium bg-gray-50/50 w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="btn-primary px-4 py-2.5 text-xs font-semibold shadow-glow-pink whitespace-nowrap"
          >
            <PlusCircle size={16} />
            Thêm Dịch Vụ Mới
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-pink-dark text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Tất cả ({services.length})
        </button>

        {categoriesList.map(cat => {
          const count = services.filter(s => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-pink-dark text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl">Đang tải dịch vụ...</div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl">Không tìm thấy dịch vụ nào.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-pink-light/50 border-b border-brand-pink-light">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide">Tên Dịch Vụ</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide">Danh Mục</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide">Mô Tả</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide">Giá</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide">Thời Gian</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.map((service, i) => (
                <tr key={service.id} className="hover:bg-brand-pink-light/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{service.name}</span>
                      {!!service.is_featured && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-full">
                          <Star size={10} className="fill-amber-500" /> Nổi bật
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                      {service.category || 'Nail'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-xs text-gray-500 line-clamp-2" title={service.description}>
                      {service.description || '—'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-pink-dark whitespace-nowrap">
                    {formatCurrency(service.price)}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                    {service.duration_minutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" /> {service.duration_minutes} phút
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Edit / Create */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-serif font-bold text-gray-800 mb-1">
                {currentService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
              </h3>
              <p className="text-xs text-gray-500 mb-5">Nhập đầy đủ thông tin để cập nhật bảng giá salon</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Tên Dịch Vụ *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Sơn Gel Màu Cao Cấp..."
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Mô Tả Dịch Vụ</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tẩy tế bào chết, làm sạch móng, tạo phom & sơn gel bóng bền màu..."
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Giá (VND) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="150000"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Thời Gian (Phút)</label>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                      placeholder="60"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Danh Mục Dịch Vụ</label>
                  <select
                    name="category"
                    value={formData.category || 'Gel'}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium bg-white"
                  >
                    <option value="Gel">💅 Sơn Gel</option>
                    <option value="Acrylic">💎 Đắp Bột (Acrylic)</option>
                    <option value="Nail Art">🎨 Vẽ Móng (Nail Art)</option>
                    <option value="Chăm Sóc">✨ Chăm Sóc Móng & Da</option>
                    <option value="Pedicure">🦶 Chăm Sóc Chân (Pedicure)</option>
                    <option value="Khác">🌸 Dịch Vụ Khác</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-brand-pink-light/40 p-3 rounded-xl">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={!!formData.is_featured}
                    onChange={e => setFormData(p => ({ ...p, is_featured: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 accent-brand-pink-dark rounded cursor-pointer"
                  />
                  <label htmlFor="is_featured" className="text-xs font-semibold text-gray-700 cursor-pointer">
                    Đánh dấu là Dịch Vụ Nổi Bật trên trang chủ
                  </label>
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
                    Lưu Dịch Vụ
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

export default ManageServices;