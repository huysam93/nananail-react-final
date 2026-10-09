import { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { Edit, Trash2, PlusCircle, Star, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusConfig = {
  approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={13} /> },
  pending:  { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={13} /> },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600', icon: <XCircle size={13} /> },
};

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [formData, setFormData] = useState({ customer_name: '', content: '', rating: 5 });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/reviews/all');
      setReviews(res.data);
    } catch {
      // fallback to public endpoint
      const res = await apiClient.get('/reviews');
      setReviews(res.data);
    }
  };

  const handleApprove = async (id) => {
    await apiClient.patch(`/reviews/${id}/approve`);
    fetchReviews();
  };

  const handleReject = async (id) => {
    await apiClient.patch(`/reviews/${id}/reject`);
    fetchReviews();
  };

  const handleOpenModal = (review = null) => {
    setCurrentReview(review);
    setFormData(review ? { ...review } : { customer_name: '', content: '', rating: 5 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, rating: parseInt(formData.rating, 10), status: 'approved' };
    if (currentReview) {
      await apiClient.put(`/reviews/${currentReview.id}`, payload);
    } else {
      await apiClient.post('/reviews', payload);
    }
    fetchReviews();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      await apiClient.delete(`/reviews/${id}`);
      fetchReviews();
    }
  };

  const filtered = filter === 'all' ? reviews : reviews.filter(r => (r.status || 'approved') === filter);
  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'pending', label: `Chờ duyệt${pendingCount ? ` (${pendingCount})` : ''}` },
          { key: 'approved', label: 'Đã duyệt' },
          { key: 'rejected', label: 'Từ chối' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-brand-pink-dark text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={() => handleOpenModal()}
            className="bg-brand-pink-dark text-white px-4 py-2 rounded-lg flex items-center hover:bg-brand-pink-medium transition-colors text-sm"
          >
            <PlusCircle size={16} className="mr-2" /> Thêm Đánh Giá
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Khách Hàng</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Nội Dung</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Sao</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Trạng Thái</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(review => {
              const st = statusConfig[review.status || 'approved'];
              return (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-sm">{review.customer_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs">{review.content}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{review.rating}</span>
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                      {st.icon} {st.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {(review.status === 'pending' || !review.status) && (
                        <>
                          <button onClick={() => handleApprove(review.id)} title="Duyệt" className="text-green-600 hover:text-green-800">
                            <CheckCircle size={17} />
                          </button>
                          <button onClick={() => handleReject(review.id)} title="Từ chối" className="text-orange-500 hover:text-orange-700">
                            <XCircle size={17} />
                          </button>
                        </>
                      )}
                      {review.status === 'rejected' && (
                        <button onClick={() => handleApprove(review.id)} title="Duyệt lại" className="text-green-600 hover:text-green-800">
                          <CheckCircle size={17} />
                        </button>
                      )}
                      <button onClick={() => handleOpenModal(review)} className="text-blue-500 hover:text-blue-800">
                        <Edit size={17} />
                      </button>
                      <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:text-red-800">
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
          <div className="text-center py-10 text-gray-400 text-sm">Không có đánh giá nào</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-5">{currentReview ? 'Chỉnh Sửa' : 'Thêm Mới'} Đánh Giá</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Tên khách hàng" className="input-field" required />
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Nội dung đánh giá" className="input-field resize-none" rows={3} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số Sao</label>
                <select name="rating" value={formData.rating} onChange={handleChange} className="input-field">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-brand-pink-dark text-white rounded-xl text-sm hover:bg-brand-pink-medium">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;