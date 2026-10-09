import { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Phone, Star, Gift, Clock, ChevronRight,
  Search, Sparkles, Trophy, Award, TrendingUp, CalendarHeart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import usePageSEO from '../hooks/usePageSEO';

// ─── Tier config ───────────────────────────────────────────────────────────────
const TIERS = {
  'Kim Cương': { emoji: '💎', color: 'from-blue-400 to-cyan-300',   bg: 'bg-blue-50',   border: 'border-blue-200', text: 'text-blue-600',   min: 2000 },
  'Vàng':      { emoji: '🥇', color: 'from-yellow-400 to-amber-300', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', min: 1000 },
  'Bạc':       { emoji: '🥈', color: 'from-gray-400 to-slate-300',   bg: 'bg-gray-50',   border: 'border-gray-200', text: 'text-gray-600',   min: 500  },
  'Đồng':      { emoji: '🥉', color: 'from-orange-400 to-amber-400', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', min: 0    },
};

const TIER_ORDER = ['Đồng', 'Bạc', 'Vàng', 'Kim Cương'];

const NEXT_TIER = { 'Đồng': 'Bạc', 'Bạc': 'Vàng', 'Vàng': 'Kim Cương', 'Kim Cương': null };
const TIER_MIN  = { 'Đồng': 0, 'Bạc': 500, 'Vàng': 1000, 'Kim Cương': 2000 };

// ─── Member Card ───────────────────────────────────────────────────────────────
const MemberCard = ({ member }) => {
  const tier = TIERS[member.tier] || TIERS['Đồng'];
  const nextTierName = NEXT_TIER[member.tier];
  const nextTierMin = nextTierName ? TIER_MIN[nextTierName] : null;
  const progress = nextTierMin
    ? Math.min(100, Math.round(((member.points - TIER_MIN[member.tier]) / (nextTierMin - TIER_MIN[member.tier])) * 100))
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Main card */}
      <div className={`relative rounded-3xl overflow-hidden shadow-xl border-2 ${tier.border}`}>
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${tier.color} p-6 sm:p-8 text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Thẻ Thành Viên</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">{member.full_name}</h2>
              <p className="text-white/80 mt-1 text-sm">{member.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-4xl sm:text-5xl">{tier.emoji}</span>
              <p className="text-white/90 font-bold mt-1">Hạng {member.tier}</p>
            </div>
          </div>

          {/* Points big display */}
          <div className="mt-6 flex items-end gap-3">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest font-medium">Điểm tích lũy</p>
              <p className="text-5xl sm:text-6xl font-bold font-mono">{member.points.toLocaleString()}</p>
            </div>
            <p className="text-white/70 mb-2 text-sm">điểm</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="bg-white grid grid-cols-3 divide-x divide-gray-100">
          <div className="py-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Lần ghé</p>
            <p className="font-bold text-gray-800 text-lg">{member.total_visits}</p>
          </div>
          <div className="py-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Điểm</p>
            <p className={`font-bold text-lg ${tier.text}`}>{member.points.toLocaleString()}</p>
          </div>
          <div className="py-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Hạng</p>
            <p className="font-bold text-gray-800 text-sm">{tier.emoji} {member.tier}</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTierName && (
          <div className={`${tier.bg} px-5 py-4 border-t ${tier.border}`}>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{tier.emoji} {member.tier}</span>
              <span className={`font-semibold ${tier.text}`}>
                Còn {(nextTierMin - member.points).toLocaleString()} điểm → {TIERS[nextTierName].emoji} {nextTierName}
              </span>
            </div>
            <div className="h-2.5 bg-white rounded-full border border-gray-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${tier.color}`}
              />
            </div>
          </div>
        )}

        {member.tier === 'Kim Cương' && (
          <div className="bg-blue-50 px-5 py-3 border-t border-blue-100 text-center">
            <p className="text-blue-600 text-sm font-semibold">💎 Bạn đã đạt hạng cao nhất — Kim Cương! Cảm ơn bạn đã tin tưởng NanaNail 💖</p>
          </div>
        )}
      </div>

      {/* Transaction history */}
      {member.transactions?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-glass overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Clock size={16} className="text-brand-pink-dark" />
            <h3 className="font-semibold text-gray-700 text-sm">Lịch Sử Điểm Gần Đây</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {member.transactions.map((tx, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.points_change > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.points_change > 0 ? <TrendingUp size={14} className="text-green-600" /> : <span className="text-red-500 text-xs font-bold">−</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 truncate">{tx.description || 'Giao dịch điểm'}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm flex-shrink-0 ${tx.points_change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.points_change > 0 ? '+' : ''}{tx.points_change}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-br from-brand-pink-light to-white rounded-2xl border border-brand-pink-light p-5 text-center">
        <p className="text-sm text-gray-600 mb-3">Mỗi lần làm nail tại NanaNail = <span className="font-bold text-brand-pink-dark">+10 điểm</span></p>
        <Link to="/booking" className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">
          <CalendarHeart size={16} /> Đặt Lịch Ngay
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Tier Benefit Table ────────────────────────────────────────────────────────
const TierBenefits = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {TIER_ORDER.map(tierName => {
      const t = TIERS[tierName];
      return (
        <motion.div
          key={tierName}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${t.bg} border ${t.border} rounded-2xl p-4 text-center`}
        >
          <div className="text-3xl mb-2">{t.emoji}</div>
          <h3 className={`font-bold text-sm ${t.text}`}>{tierName}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {t.min === 0 ? 'Từ 0 điểm' : `Từ ${t.min.toLocaleString()} điểm`}
          </p>
          <div className="mt-3 space-y-1 text-left">
            {tierName === 'Đồng'      && <><p className="text-xs text-gray-600">• Tích điểm cơ bản</p><p className="text-xs text-gray-600">• Ưu đãi sinh nhật</p></>}
            {tierName === 'Bạc'       && <><p className="text-xs text-gray-600">• Giảm 5% mỗi lần</p><p className="text-xs text-gray-600">• Ưu tiên đặt lịch</p></>}
            {tierName === 'Vàng'      && <><p className="text-xs text-gray-600">• Giảm 10% mỗi lần</p><p className="text-xs text-gray-600">• Tặng 1 lần miễn phí/quý</p></>}
            {tierName === 'Kim Cương' && <><p className="text-xs text-gray-600">• Giảm 15% mỗi lần</p><p className="text-xs text-gray-600">• Ưu đãi VIP độc quyền</p></>}
          </div>
        </motion.div>
      );
    })}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const LoyaltyPage = () => {
  usePageSEO({
    title: 'Thẻ Thành Viên Loyalty',
    description: 'Tham gia chương trình khách hàng thân thiết NanaNail. Tích điểm mỗi lần làm nail, đổi quà hấp dẫn. 4 hạng: Đồng, Bạc, Vàng, Kim Cương.',
    keywords: 'loyalty nail Đà Lạt, tích điểm nail, thẻ thành viên NanaNail, khách hàng thân thiết',
  });

  const [phone, setPhone] = useState('');
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ full_name: '', phone: '', email: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    setMember(null);
    try {
      const res = await apiClient.get(`/loyalty/lookup/${phone.trim()}`);
      setMember(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Không tìm thấy. Kiểm tra lại số điện thoại hoặc đăng ký thành viên mới.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    setRegSuccess('');
    try {
      const res = await apiClient.post('/loyalty/register', regForm);
      setRegSuccess(res.data.message);
      setPhone(regForm.phone);
      setShowRegister(false);
      // Auto lookup
      const res2 = await apiClient.get(`/loyalty/lookup/${regForm.phone}`);
      setMember(res2.data);
    } catch (err) {
      setRegError(err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge"><Trophy size={14} /> Chương Trình Thành Viên</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-800 mb-4">
              Tích Điểm — <span className="text-gradient">Đổi Quà</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
              Mỗi lần làm nail tại NanaNail, bạn nhận điểm thưởng. Tích điểm để lên hạng và nhận ưu đãi độc quyền 💖
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-12">

        {/* Lookup form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-brand-pink-light shadow-glass p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-brand-pink-light flex items-center justify-center">
              <Search size={18} className="text-brand-pink-dark" />
            </div>
            <h2 className="font-serif font-bold text-gray-800 text-lg">Tra Cứu Điểm Thành Viên</h2>
          </div>

          <form onSubmit={handleLookup} className="flex gap-3">
            <div className="relative flex-1">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại (vd: 0912345678)"
                className="input-field pl-10"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary px-6 py-3 text-sm flex-shrink-0">
              {loading ? '...' : <><Search size={15} /> Tra Cứu</>}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
              <button onClick={() => setShowRegister(true)} className="ml-2 underline font-semibold">
                Đăng ký thành viên ngay →
              </button>
            </motion.div>
          )}

          {regSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 font-medium">
              🎉 {regSuccess}
            </motion.div>
          )}

          {/* Register form */}
          <AnimatePresence>
            {showRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 border-t border-dashed border-brand-pink-light pt-5"
              >
                <h3 className="font-semibold text-gray-700 text-sm mb-4">✨ Đăng Ký Thành Viên Mới</h3>
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      value={regForm.full_name}
                      onChange={e => setRegForm(p => ({ ...p, full_name: e.target.value }))}
                      placeholder="Họ và tên *"
                      required
                      className="input-field"
                    />
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Số điện thoại *"
                      required
                      className="input-field"
                    />
                  </div>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="Email (tùy chọn)"
                    className="input-field"
                  />
                  {regError && <p className="text-xs text-red-600">{regError}</p>}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowRegister(false)} className="btn-outline text-sm px-5 py-2.5">Hủy</button>
                    <button type="submit" disabled={regLoading} className="btn-primary text-sm px-6 py-2.5 flex-1">
                      {regLoading ? 'Đang đăng ký...' : '🎉 Đăng Ký & Nhận 50 Điểm'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!showRegister && !member && (
            <p className="mt-4 text-center text-sm text-gray-400">
              Chưa có thẻ thành viên?{' '}
              <button onClick={() => setShowRegister(true)} className="text-brand-pink-dark font-semibold hover:underline">
                Đăng ký ngay — nhận 50 điểm chào mừng 🎁
              </button>
            </p>
          )}
        </motion.div>

        {/* Member result */}
        <AnimatePresence>
          {member && <MemberCard member={member} />}
        </AnimatePresence>

        {/* Tier benefits */}
        <div>
          <div className="text-center mb-7">
            <span className="section-badge"><Award size={14} /> Hạng Thành Viên</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">Quyền Lợi Theo Hạng</h2>
          </div>
          <TierBenefits />
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-br from-brand-pink-light/60 to-white rounded-3xl border border-brand-pink-light p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="section-badge"><Sparkles size={14} /> Cách Tích Điểm</span>
            <h2 className="text-2xl font-serif font-bold text-gray-800">Đơn Giản — Dễ Dàng</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 text-center">
            {[
              { icon: '💅', title: 'Làm Nail', desc: 'Mỗi lần ghé NanaNail là tích điểm ngay' },
              { icon: '📞', title: 'Cho Số Điện Thoại', desc: 'Nhân viên sẽ cộng điểm vào tài khoản của bạn' },
              { icon: '🎁', title: 'Nhận Ưu Đãi', desc: 'Lên hạng để nhận giảm giá và quà tặng đặc biệt' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-glass border border-brand-pink-light flex items-center justify-center text-2xl mb-1">
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA bottom */}
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm mb-4">Câu hỏi về điểm thưởng? Liên hệ NanaNail ngay!</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="tel:0965371841" className="btn-outline text-sm px-5 py-2.5 flex items-center gap-2">
              <Phone size={15} /> 0965.371.841
            </a>
            <Link to="/booking" className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2">
              <CalendarHeart size={15} /> Đặt Lịch — Tích Điểm Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
