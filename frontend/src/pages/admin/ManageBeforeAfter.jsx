import { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { Plus, Trash2, Upload, ImageIcon, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/imageHelper';

const ManageBeforeAfter = () => {
    const [images, setImages] = useState([]);
    const [form, setForm] = useState({ title: '', category: 'Gel', description: '' });
    const [beforeFile, setBeforeFile] = useState(null);
    const [afterFile, setAfterFile] = useState(null);
    const [beforePreview, setBeforePreview] = useState(null);
    const [afterPreview, setAfterPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchImages(); }, []);

    const fetchImages = async () => {
        try {
            const res = await apiClient.get('/before-after');
            setImages(res.data);
        } catch { setImages([]); }
    };

    const handleFileChange = (e, side) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            if (side === 'before') { setBeforeFile(file); setBeforePreview(ev.target.result); }
            else { setAfterFile(file); setAfterPreview(ev.target.result); }
        };
        reader.readAsDataURL(file);
    };

    // Convert file to base64
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!beforeFile || !afterFile) {
            alert('Vui lòng chọn cả ảnh Trước và ảnh Sau!');
            return;
        }
        setLoading(true);
        try {
            const before_b64 = await toBase64(beforeFile);
            const after_b64  = await toBase64(afterFile);
            await apiClient.post('/before-after', {
                ...form,
                before_image: before_b64,
                after_image: after_b64,
            });
            setForm({ title: '', category: 'Gel', description: '' });
            setBeforeFile(null); setAfterFile(null);
            setBeforePreview(null); setAfterPreview(null);
            setShowForm(false);
            fetchImages();
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Lỗi khi tải ảnh. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa cặp ảnh trước/sau này?')) return;
        await apiClient.delete(`/before-after/${id}`);
        fetchImages();
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">{images.length} cặp ảnh Trước / Sau</h3>
                <button
                    onClick={() => setShowForm(s => !s)}
                    className="btn-primary text-sm px-4 py-2"
                >
                    <Plus size={15} /> Thêm Cặp Ảnh
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-pink-light/30 border border-brand-pink-light rounded-xl p-5"
                >
                    <h4 className="font-serif font-bold text-brand-pink-dark mb-4">Thêm Cặp Ảnh Trước / Sau</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Tiêu đề *</label>
                                <input
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    required
                                    placeholder="Nail Art Hoa..."
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Danh mục</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                    className="input-field"
                                >
                                    <option value="Gel">💅 Gel</option>
                                    <option value="Nail Art">🎨 Nail Art</option>
                                    <option value="Acrylic">💎 Acrylic</option>
                                    <option value="Pedicure">🦶 Pedicure</option>
                                    <option value="Chăm Sóc">✨ Chăm Sóc</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
                            <input
                                value={form.description}
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                placeholder="Mô tả ngắn về kết quả..."
                                className="input-field"
                            />
                        </div>

                        {/* Image upload side by side */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Before */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">📷 Ảnh TRƯỚC *</label>
                                <label className="cursor-pointer block">
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'before')} />
                                    <div className={`relative h-36 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${beforePreview ? 'border-brand-pink-dark' : 'border-gray-300 hover:border-brand-pink-medium bg-gray-50'}`}>
                                        {beforePreview ? (
                                            <img src={beforePreview} alt="before" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <Upload size={24} className="mx-auto mb-1" />
                                                <p className="text-xs">Chọn ảnh</p>
                                            </div>
                                        )}
                                        {beforePreview && (
                                            <div className="absolute top-1 left-1 bg-gray-800/70 text-white text-xs px-1.5 py-0.5 rounded font-bold">TRƯỚC</div>
                                        )}
                                    </div>
                                </label>
                            </div>

                            {/* After */}
                            <div>
                                <label className="block text-xs font-bold text-brand-pink-dark mb-1.5">✨ Ảnh SAU *</label>
                                <label className="cursor-pointer block">
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'after')} />
                                    <div className={`relative h-36 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${afterPreview ? 'border-brand-pink-dark' : 'border-gray-300 hover:border-brand-pink-medium bg-gray-50'}`}>
                                        {afterPreview ? (
                                            <img src={afterPreview} alt="after" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <Upload size={24} className="mx-auto mb-1" />
                                                <p className="text-xs">Chọn ảnh</p>
                                            </div>
                                        )}
                                        {afterPreview && (
                                            <div className="absolute top-1 left-1 bg-brand-pink-dark/90 text-white text-xs px-1.5 py-0.5 rounded font-bold">SAU</div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm px-5 py-2">Hủy</button>
                            <button type="submit" disabled={loading} className="btn-primary text-sm px-5 py-2">
                                {loading ? 'Đang tải...' : 'Lưu Cặp Ảnh'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Grid list */}
            {images.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <ImageIcon size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Chưa có cặp ảnh nào. Nhấn "Thêm Cặp Ảnh" để bắt đầu!</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {images.map((img, i) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl shadow-glass border border-gray-100 overflow-hidden group"
                        >
                            {/* Before/After preview side by side */}
                            <div className="flex h-36">
                                <div className="flex-1 relative overflow-hidden">
                                    {img.before_image ? (
                                        <img
                                            src={getImageUrl(img.before_image)}
                                            alt="before"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <ImageIcon size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-1 left-1 bg-gray-800/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">TRƯỚC</div>
                                </div>
                                <div className="w-0.5 bg-white z-10 shadow-sm" />
                                <div className="flex-1 relative overflow-hidden">
                                    {img.after_image ? (
                                        <img
                                            src={getImageUrl(img.after_image)}
                                            alt="after"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-pink-light flex items-center justify-center">
                                            <ImageIcon size={20} className="text-brand-pink-dark/40" />
                                        </div>
                                    )}
                                    <div className="absolute top-1 left-1 bg-brand-pink-dark/90 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">SAU</div>
                                </div>
                            </div>

                            <div className="p-3 flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{img.title || 'Không có tiêu đề'}</p>
                                    {img.category && (
                                        <span className="text-xs text-brand-pink-dark bg-brand-pink-light px-1.5 py-0.5 rounded-full">{img.category}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageBeforeAfter;
