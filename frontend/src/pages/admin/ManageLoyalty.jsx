import { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { motion } from 'framer-motion';
import { Plus, Search, TrendingUp, TrendingDown, Trophy, Edit, Trash2, Gift } from 'lucide-react';

const TIERS = {
  'Kim Cương': { emoji: '💎', bg: 'bg-blue-100',   text: 'text-blue-700'   },
  'Vàng':      { emoji: '🥇', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Bạc':       { emoji: '🥈', bg: 'bg-gray-100',   text: 'text-gray-700'   },
  'Đồng':      { emoji: '🥉', bg: 'bg-orange-100', text: 'text-orange-700' },
};

const ManageLoyalty = () => {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('Tất cả');
  const [stats, setStats] = useState(null);

  // Add points modal
  const [pointsModal, setPointsModal] = useState(null);
  const [pointsForm, setPointsForm] = useState({ points_change: '', type: 'earn', description: '' });
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsMsg, setPointsMsg] = useState('');

  // Register modal
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ full_name: '', phone: '', email: '', notes: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regMsg, setRegMsg] = useState('');

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    let list = members;
    if (search) list = list.filter(m => m.full_name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search));
    if (tierFilter !== 'Tất cả') list = list.filter(m => m.tier === tierFilter);
    setFiltered(list);
  }, [members, search, tierFilter]);

  const fetchAll = async () => {
    const [mRes, sRes] = await Promise.allSettled([
      apiClient.get('/loyalty/members'),
      apiClient.get('/loyalty/stats'),
    ]);
    if (mRes.status === 'fulfilled') setMembers(mRes.value.data);
    if (sRes.status === 'fulfilled') setStats(sRes.value.data);
  };

  const handleAddPoints = async (e) => {
    e.preventDefault();
    setPointsLoading(true);
    setPointsMsg('');
    try {
      const res = await apiClient.post(`/loyalty/members/${pointsModal.id}/points`, {
        points_change: pointsForm.type === 'redeem' ? -Math.abs(pointsForm.points_change) : Math.abs(pointsForm.points_change),
        type: pointsForm.type,
        description: pointsForm.description || (pointsForm.type === 'earn' ? 'Cộng điểm từ dịch vụ' : 'Trừ điểm đổi quà'),
      });
      setPointsMsg(res.data.message);
      fetchAll();
      setTimeout(() => { setPointsModal(null); setPointsMsg(''); }, 1500);
    } catch (err) {
      setPointsMsg(err.response?.data?.error || 'Lỗi!');
    } finally {
      setPointsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMsg('');
    try {
      await apiClient.post('/loyalty/register', regForm);
      setRegMsg('✅ Đã thêm thành viên mới!');
      fetchAll();
      setTimeout(() => { setShowRegister(false); setRegMsg(''); setRegForm({ full_name: '', phone: '', email: '', notes: '' }); }, 1500);
    } catch (err) {
      setRegMsg(err.response?.data?.error || 'Lỗi!');
    } finally {
      setRegLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa thành viên "${name}"? Lịch sử điểm cũng sẽ bị xóa.`)) return;
    await apiClient.delete(`/loyalty/members/${id}`);
    fetchAll();
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Kim Cương', 'Vàng', 'Bạc', 'Đồng'].map(tier => {
            const t = TIERS[tier];
            const count = stats.tierStats?.find(s => s.tier === tier)?.count || 0;
            return (
              <div key={tier} className={`${t.bg} rounded-xl p-3 text-center border border-white`}>
                <div className="text-xl mb-1">{t.emoji}</div>
                <div className={`font-bold text-lg ${t.text}`}>{count}</div>
                <div className="text-xs text-gray-500">{tier}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên hoặc SĐT..."
            className="input-field pl-9 text-sm py-2"
          />
        </div>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="input-field text-sm py-2 w-36">
          <option value="Tất cả">Tất cả hạng</option>
          <option value="Kim Cương">💎 Kim Cương</option>
          <option value="Vàng">🥇 Vàng</option>
          <option value="Bạc">🥈 Bạc</option>
          <option value="Đồng">🥉 Đồng</option>
        </select>
        <button onClick={() => setShowRegister(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5 flex-shrink-0">
          <Plus size={15} /> Thêm Thành Viên
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gradient-to-r from-brand-pink-light to-white">
            <tr>
              <th className="th-cell text-left">Thành Viên</th>
              <th className="th-cell">Hạng</th>
              <th className="th-cell">Điểm</th>
              <th className="th-cell">Lần Ghé</th>
              <th className="th-cell">Tham Gia</th>
              <th className="th-cell">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                {search ? 'Không tìm thấy kết quả.' : 'Chưa có thành viên nào.'}
              </td></tr>
            )}
            {filtered.map((m, i) => {
              const t = TIERS[m.tier] || TIERS['Đồng'];
              return (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-brand-pink-light/10 transition-colors"
                >
                  <td className="td-cell">
                    <div>
                      <p className="font-semibold text-gray-800">{m.full_name}</p>
                      <p className="text-xs text-gray-400">{m.phone}</p>
                    </div>
                  </td>
                  <td className="td-cell text-center">
                    <span className={`${t.bg} ${t.text} text-xs font-bold px-2.5 py-1 rounded-full`}>
                      {t.emoji} {m.tier}
                    </span>
                  </td>
                  <td className="td-cell text-center font-bold text-brand-pink-dark">
                    {m.points.toLocaleString()}
                  </td>
                  <td className="td-cell text-center text-gray-500">{m.total_visits}</td>
                  <td className="td-cell text-xs text-gray-400 whitespace-nowrap">
                    {new Date(m.joined_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="td-cell whitespace-nowrap">
                    <button
                      onClick={() => { setPointsModal(m); setPointsForm({ points_change: '', type: 'earn', description: '' }); setPointsMsg(''); }}
                      className="text-brand-pink-dark hover:text-brand-pink-medium mr-2 p-1.5 rounded-lg hover:bg-brand-pink-light transition-colors"
                      title="Cộng/Trừ điểm"
                    >
                      <Gift size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.full_name)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Points Modal */}
      {pointsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-floating w-full max-w-sm">
            <h3 className="font-serif font-bold text-gray-800 mb-1">Cộng / Trừ Điểm</h3>
            <p className="text-sm text-gray-500 mb-4">
              {TIERS[pointsModal.tier]?.emoji} <span className="font-semibold">{pointsModal.full_name}</span> — hiện có <span className="font-bold text-brand-pink-dark">{pointsModal.points} điểm</span>
            </p>
            <form onSubmit={handleAddPoints} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${pointsForm.type === 'earn' ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                  <input type="radio" name="type" value="earn" checked={pointsForm.type === 'earn'} onChange={e => setPointsForm(p => ({ ...p, type: e.target.value }))} className="hidden" />
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">Cộng Điểm</span>
                </label>
                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${pointsForm.type === 'redeem' ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <input type="radio" name="type" value="redeem" checked={pointsForm.type === 'redeem'} onChange={e => setPointsForm(p => ({ ...p, type: e.target.value }))} className="hidden" />
                  <TrendingDown size={16} className="text-red-500" />
                  <span className="text-sm font-medium text-red-600">Trừ Điểm</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Số Điểm *</label>
                <input
                  type="number"
                  min={1}
                  value={pointsForm.points_change}
                  onChange={e => setPointsForm(p => ({ ...p, points_change: e.target.value }))}
                  placeholder="VD: 10"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ghi Chú</label>
                <input
                  value={pointsForm.description}
                  onChange={e => setPointsForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="VD: Sơn gel màu - dịch vụ 200k"
                  className="input-field"
                />
              </div>
              {pointsMsg && (
                <p className={`text-sm font-medium ${pointsMsg.includes('Lỗi') || pointsMsg.includes('lỗi') ? 'text-red-600' : 'text-green-600'}`}>
                  {pointsMsg}
                </p>
              )}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setPointsModal(null)} className="btn-outline text-sm px-4 py-2">Hủy</button>
                <button type="submit" disabled={pointsLoading} className="btn-primary text-sm px-5 py-2 flex-1">
                  {pointsLoading ? '...' : pointsForm.type === 'earn' ? '✅ Cộng Điểm' : '⬇️ Trừ Điểm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-floating w-full max-w-md">
            <h3 className="font-serif font-bold text-gray-800 mb-5">Thêm Thành Viên Mới</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Họ Tên *</label>
                  <input value={regForm.full_name} onChange={e => setRegForm(p => ({ ...p, full_name: e.target.value }))} required className="input-field" placeholder="Nguyễn Thị Lan" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số Điện Thoại *</label>
                  <input type="tel" value={regForm.phone} onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))} required className="input-field" placeholder="0912345678" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email (tùy chọn)</label>
                <input type="email" value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} className="input-field" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ghi Chú</label>
                <input value={regForm.notes} onChange={e => setRegForm(p => ({ ...p, notes: e.target.value }))} className="input-field" placeholder="VD: Thích màu hồng, dị ứng acrylic..." />
              </div>
              {regMsg && <p className="text-sm font-medium text-green-600">{regMsg}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowRegister(false)} className="btn-outline text-sm px-4 py-2">Hủy</button>
                <button type="submit" disabled={regLoading} className="btn-primary text-sm px-5 py-2 flex-1">
                  {regLoading ? '...' : '🎉 Thêm & Tặng 50 Điểm Chào Mừng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLoyalty;
