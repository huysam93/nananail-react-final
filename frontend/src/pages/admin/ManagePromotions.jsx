import { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { Plus, Trash2, Edit3, Tag, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const emptyForm = {
    title: '', description: '', discount_percent: 10,
    original_price: '', promo_price: '', valid_from: '', valid_to: '',
    badge: 'HOT', color: 'from-rose-400 to-pink-500', is_active: 1,
};

const ManagePromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchPromotions(); }, []);

    const fetchPromotions = async () => {
        try {
            const res = await apiClient.get('/promotions/all');
            setPromotions(Array.isArray(res.data) ? res.data : []);
        } catch {
            try {
                const res = await apiClient.get('/promotions');
                setPromotions(Array.isArray(res.data) ? res.data : []);
            } catch {
                setPromotions([]);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await apiClient.put(`/promotions/${editId}`, form);
            } else {
                await apiClient.post('/promotions', form);
            }
            setForm(emptyForm);
            setEditId(null);
            setShowForm(false);
            fetchPromotions();
        } catch (err) {
            console.error('Failed to save promotion:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (promo) => {
        setForm({
            title: promo.title || '',
            description: promo.description || '',
            discount_percent: promo.discount_percent || 10,
            original_price: promo.original_price || '',
            promo_price: promo.promo_price || '',
            valid_from: promo.valid_from ? promo.valid_from.slice(0, 16) : '',
            valid_to: promo.valid_to ? promo.valid_to.slice(0, 16) : '',
            badge: promo.badge || 'HOT',
            color: promo.color || 'from-rose-400 to-pink-500',
            is_active: promo.is_active ?? 1,
        });
        setEditId(promo.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa khuyến mãi này?')) {
            await apiClient.delete(`/promotions/${id}`);
            fetchPromotions();
        }
    };

    const toggleActive = async (promo) => {
        await apiClient.put(`/promotions/${promo.id}`, { ...promo, is_active: promo.is_active ? 0 : 1 });
        fetchPromotions();
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
    const promoList = Array.isArray(promotions) ? promotions : [];

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Quản lý {promoList.length} khuyến mãi</h3>
                <button
                    onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(s => !s); }}
                    className="btn-primary text-sm px-4 py-2"
                >
                    <Plus size={15} /> Thêm mới
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-pink-light/30 border border-brand-pink-light rounded-xl p-5"
                >
                    <h4 className="font-serif font-bold text-brand-pink-dark mb-4">
                        {editId ? 'Chỉnh sửa' : 'Thêm'} Khuyến Mãi
                    </h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Tiêu đề *</label>
                            <input name="title" value={form.title} onChange={handleChange} required placeholder="Combo Gel + Nail Art..." className="input-field" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input-field resize-none" placeholder="Mô tả chi tiết ưu đãi..." />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Giảm (%)</label>
                            <input type="number" name="discount_percent" value={form.discount_percent} onChange={handleChange} min={0} max={100} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Badge label</label>
                            <input name="badge" value={form.badge} onChange={handleChange} placeholder="HOT / SIÊU TIẾT KIỆM / VIP" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Giá gốc (đ)</label>
                            <input type="number" name="original_price" value={form.original_price} onChange={handleChange} className="input-field" placeholder="350000" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi (đ)</label>
                            <input type="number" name="promo_price" value={form.promo_price} onChange={handleChange} className="input-field" placeholder="250000" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Hiệu lực từ</label>
                            <input type="datetime-local" name="valid_from" value={form.valid_from} onChange={handleChange} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Hết hạn</label>
                            <input type="datetime-local" name="valid_to" value={form.valid_to} onChange={handleChange} className="input-field" />
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" name="is_active" checked={!!form.is_active} onChange={handleChange} className="w-4 h-4 accent-brand-pink-dark" />
                                Đang kích hoạt
                            </label>
                        </div>
                        <div className="sm:col-span-2 flex gap-3 justify-end">
                            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm px-5 py-2">Hủy</button>
                            <button type="submit" disabled={loading} className="btn-primary text-sm px-5 py-2">
                                {loading ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* List */}
            {promoList.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">Chưa có khuyến mãi nào.</div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {promoList.map((promo, i) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-2 ${!promo.is_active ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm leading-snug">{promo.title}</p>
                                    {promo.badge && (
                                        <span className="text-xs font-bold text-brand-pink-dark bg-brand-pink-light px-2 py-0.5 rounded-full mt-1 inline-block">
                                            {promo.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-2xl font-black text-brand-pink-dark flex-shrink-0">-{promo.discount_percent}%</span>
                            </div>
                            {promo.description && <p className="text-xs text-gray-500 line-clamp-2">{promo.description}</p>}
                            <div className="text-xs text-gray-400 flex gap-3">
                                {promo.valid_to && <span>Hết: {formatDate(promo.valid_to)}</span>}
                                <span className={promo.is_active ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                                    {promo.is_active ? '● Active' : '○ Inactive'}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-1">
                                <button onClick={() => handleEdit(promo)} className="flex-1 text-xs btn-ghost py-1.5 border border-gray-200"><Edit3 size={12} /> Sửa</button>
                                <button onClick={() => toggleActive(promo)} className="flex-1 text-xs py-1.5 px-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                                    {promo.is_active ? <XCircle size={12} className="inline mr-1" /> : <CheckCircle size={12} className="inline mr-1" />}
                                    {promo.is_active ? 'Tắt' : 'Bật'}
                                </button>
                                <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManagePromotions;
