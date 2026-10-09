import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarHeart, CheckCircle, Phone, MapPin, Clock,
  Info, X, ChevronRight, ChevronLeft, User, Star, Sparkles,
  Sun, Sunset, Moon, Calendar as CalendarIcon, HeartHandshake, ShieldCheck
} from 'lucide-react';
import { maskPrice } from '../components/shared/ServiceCard';
import usePageSEO from '../hooks/usePageSEO';

// ─── Time slots grouped by time of day ─────────────────────────────────────────
const TIME_GROUPS = [
  {
    title: 'Buổi Sáng',
    icon: Sun,
    slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
  },
  {
    title: 'Buổi Chiều',
    icon: Sunset,
    slots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
  },
  {
    title: 'Buổi Tối',
    icon: Moon,
    slots: ['18:00', '18:30', '19:00', '19:30', '20:00']
  }
];

const categoryIcons = {
  'Gel': '💅', 'Acrylic': '💎', 'Nail Art': '🎨',
  'Chăm Sóc': '✨', 'Pedicure': '🦶',
};

// ─── Step Indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-between mb-8 sm:mb-10 max-w-xl mx-auto px-2">
    {steps.map((step, i) => {
      const isActive = i + 1 === currentStep;
      const isDone   = i + 1 < currentStep;
      return (
        <div key={i} className="flex items-center flex-1 last:flex-initial">
          <div className="flex flex-col items-center gap-1.5 relative group cursor-pointer">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm ${
              isDone
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : isActive
                ? 'bg-gradient-to-r from-brand-pink-dark to-brand-pink-medium text-white shadow-glow-pink ring-4 ring-brand-pink-light'
                : 'bg-gray-100 text-gray-400 border border-gray-200'
            }`}>
              {isDone ? <CheckCircle size={18} /> : <span>0{i + 1}</span>}
            </div>
            <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive ? 'text-brand-pink-dark font-bold' : isDone ? 'text-emerald-600' : 'text-gray-400'
            }`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-1 flex-1 mx-2 sm:mx-3 rounded-full transition-all duration-500 ${
              isDone ? 'bg-emerald-400' : 'bg-gray-100'
            }`} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Step 1: Chọn dịch vụ ─────────────────────────────────────────────────────
const Step1Services = ({ services, selected, onChange }) => {
  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];

  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
            <span>💅</span> Chọn Dịch Vụ Nail
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Bạn có thể chọn nhiều dịch vụ mong muốn cùng lúc</p>
        </div>
        {selected.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-light text-brand-pink-dark text-xs font-bold border border-brand-pink/30 self-start">
            Đã chọn {selected.length} dịch vụ
          </span>
        )}
      </div>

      {categories.length > 0 ? (
        categories.map(cat => (
          <div key={cat} className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-pink-dark uppercase tracking-wider bg-brand-pink-light/40 px-3 py-1.5 rounded-lg w-fit">
              <span>{categoryIcons[cat] || '✦'}</span>
              <span>{cat}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.filter(s => s.category === cat).map(service => {
                const isSelected = selected.includes(service.id);
                return (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    key={service.id}
                    type="button"
                    onClick={() => toggle(service.id)}
                    className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-brand-pink-dark bg-gradient-to-br from-brand-pink-light/90 to-white shadow-glow-pink'
                        : 'border-gray-100 bg-white hover:border-brand-pink-medium/60 hover:bg-brand-pink-light/30 shadow-xs'
                    }`}
                  >
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                      isSelected ? 'border-brand-pink-dark bg-brand-pink-dark shadow-xs' : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-bold ${isSelected ? 'text-brand-pink-dark' : 'text-gray-800'}`}>{service.name}</p>
                        {service.featured === 1 && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Hot 🔥</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        {service.duration_minutes && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={11} />{service.duration_minutes} phút
                          </span>
                        )}
                        <span className={`text-xs font-mono font-bold ${isSelected ? 'text-brand-pink-dark' : 'text-gray-600'}`}>
                          {maskPrice(service.price)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map(service => {
            const isSelected = selected.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggle(service.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected ? 'border-brand-pink-dark bg-brand-pink-light shadow-glow-pink' : 'border-gray-100 bg-white'
                }`}
              >
                <p className="font-bold text-sm text-gray-800">{service.name}</p>
                <p className="text-xs font-mono text-brand-pink-dark mt-1">{maskPrice(service.price)}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Step 2: Chọn ngày & giờ ──────────────────────────────────────────────────
const Step2DateTime = ({ formData, onChange }) => {
  const todayObj = new Date();
  const todayStr = todayObj.toISOString().slice(0, 10);

  const tomorrowObj = new Date(todayObj);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().slice(0, 10);

  const nextDayObj = new Date(todayObj);
  nextDayObj.setDate(nextDayObj.getDate() + 2);
  const nextDayStr = nextDayObj.toISOString().slice(0, 10);

  const [dateStr, setDateStr] = useState(formData.date || todayStr);
  const [timeSlot, setTimeSlot] = useState(formData.timeSlot || '');

  useEffect(() => {
    if (!formData.date) {
      setDateStr(todayStr);
      onChange({ date: todayStr, timeSlot: '' });
    }
  }, []);

  const handleDateSelect = (d) => {
    setDateStr(d);
    setTimeSlot('');
    onChange({ date: d, timeSlot: '' });
  };

  const handleTimeSelect = (slot) => {
    setTimeSlot(slot);
    onChange({ date: dateStr, timeSlot: slot });
  };

  const quickDates = [
    { label: 'Hôm nay', date: todayStr, dayName: todayObj.toLocaleDateString('vi-VN', { weekday: 'short' }) },
    { label: 'Ngày mai', date: tomorrowStr, dayName: tomorrowObj.toLocaleDateString('vi-VN', { weekday: 'short' }) },
    { label: 'Ngày kia', date: nextDayStr, dayName: nextDayObj.toLocaleDateString('vi-VN', { weekday: 'short' }) },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon size={20} className="text-brand-pink-dark" /> Chọn Ngày & Khung Giờ
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Tiệm làm việc từ 8:00 – 20:00 (T2-T6) và 8:00 – 21:00 (T7-CN)</p>
      </div>

      {/* Quick date pills */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          1. Chọn Ngày Đến
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-3">
          {quickDates.map(qd => {
            const isSel = dateStr === qd.date;
            return (
              <button
                key={qd.date}
                type="button"
                onClick={() => handleDateSelect(qd.date)}
                className={`py-3 px-2 rounded-2xl border-2 text-center transition-all ${
                  isSel
                    ? 'border-brand-pink-dark bg-brand-pink-dark text-white shadow-glow-pink font-bold'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-brand-pink-medium hover:bg-brand-pink-light/30'
                }`}
              >
                <p className="text-xs opacity-90">{qd.dayName}</p>
                <p className="text-sm font-bold mt-0.5">{qd.label}</p>
                <p className="text-[10px] opacity-75 mt-0.5">{qd.date.slice(5)}</p>
              </button>
            );
          })}
          <div className="relative flex flex-col justify-center items-center p-2 rounded-2xl border-2 border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Ngày Khác</span>
            <input
              type="date"
              min={todayStr}
              value={dateStr}
              onChange={e => handleDateSelect(e.target.value)}
              className="w-full text-xs bg-transparent border-0 text-center font-bold text-brand-pink-dark focus:ring-0 p-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Time slot grouping */}
      {dateStr && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            2. Chọn Khung Giờ Hẹn
          </label>

          {TIME_GROUPS.map(group => {
            const IconComponent = group.icon;
            return (
              <div key={group.title} className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2.5">
                  <IconComponent size={14} className="text-brand-pink-dark" />
                  <span>{group.title}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {group.slots.map(slot => {
                    const isSel = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                          isSel
                            ? 'border-brand-pink-dark bg-gradient-to-r from-brand-pink-dark to-brand-pink-medium text-white shadow-glow-pink scale-105'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-brand-pink-medium hover:text-brand-pink-dark'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

// ─── Step 3: Thông tin cá nhân ────────────────────────────────────────────────
const Step3Info = ({ formData, onChange }) => (
  <div className="space-y-5">
    <div className="border-b border-gray-100 pb-4">
      <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
        <User size={20} className="text-brand-pink-dark" /> Thông Tin Khách Hàng
      </h3>
      <p className="text-xs sm:text-sm text-gray-400 mt-0.5">NanaNail sẽ liên hệ để xác nhận lịch hẹn của bạn trong 30 phút</p>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Họ và Tên <span className="text-brand-pink-dark">*</span>
        </label>
        <div className="relative">
          <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={formData.name}
            onChange={e => onChange({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Nguyễn Thùy Trang"
            className="input-field pl-11 rounded-2xl text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Số Điện Thoại <span className="text-gray-400 font-normal text-xs">(Zalo)</span>
        </label>
        <div className="relative">
          <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            value={formData.phone}
            onChange={e => onChange({ ...formData, phone: e.target.value })}
            placeholder="09xx xxx xxx"
            className="input-field pl-11 rounded-2xl text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Ghi Chú Yêu Cầu
        </label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={e => onChange({ ...formData, notes: e.target.value })}
          placeholder="Mô tả kiểu nail yêu thích, mang theo mẫu ảnh, móng nhạy cảm..."
          className="input-field rounded-2xl text-sm resize-none"
        />
      </div>
    </div>
  </div>
);

// ─── Step 4: Xác nhận ─────────────────────────────────────────────────────────
const Step4Confirm = ({ services, selectedIds, dateTime, info }) => {
  const selectedServices = services.filter(s => selectedIds.includes(s.id));
  const totalCost = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration_minutes || 45), 0);

  return (
    <div className="space-y-5">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <ShieldCheck size={22} className="text-emerald-500" /> Kiểm Tra & Xác Nhận
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Vui lòng kiểm tra kỹ thông tin lịch hẹn trước khi xác nhận</p>
      </div>

      <div className="bg-gradient-to-br from-brand-pink-light/40 to-white rounded-2xl p-5 border border-brand-pink/30 space-y-4 shadow-xs">
        {/* Services summary */}
        <div>
          <p className="text-xs font-bold text-brand-pink-dark uppercase tracking-wider mb-2">💅 Dịch Vụ Đã Chọn ({selectedServices.length})</p>
          <div className="space-y-1.5">
            {selectedServices.map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-100/60 last:border-0">
                <span className="font-semibold text-gray-800">{s.name}</span>
                <span className="font-mono text-brand-pink-dark font-bold">{maskPrice(s.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date Time */}
        <div className="pt-2 border-t border-brand-pink/20 flex flex-wrap justify-between items-center text-sm">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Thời Gian Hẹn</p>
            <p className="font-bold text-gray-800 mt-0.5">
              {dateTime.date && new Date(dateTime.date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">Khung Giờ</p>
            <p className="font-bold text-brand-pink-dark text-base mt-0.5">{dateTime.timeSlot}</p>
          </div>
        </div>

        {/* Customer */}
        <div className="pt-2 border-t border-brand-pink/20">
          <p className="text-xs font-bold text-gray-400 uppercase">Thông Tin Khách</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">{info.name} — <span className="text-brand-pink-dark font-mono">{info.phone || 'Chưa nhập SĐT'}</span></p>
          {info.notes && <p className="text-xs text-gray-500 italic mt-1">"{info.notes}"</p>}
        </div>

        {/* Total Price & Duration */}
        <div className="pt-3 border-t-2 border-dashed border-brand-pink/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Ước tính thời gian</p>
            <p className="text-xs font-bold text-gray-700 flex items-center gap-1"><Clock size={12} /> ~{totalDuration} phút</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Tổng chi phí dự kiến</p>
            <p className="text-lg font-bold font-mono text-brand-pink-dark">{maskPrice(totalCost)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
const SuccessScreen = ({ name, onReset }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="text-center max-w-md bg-white p-8 rounded-3xl shadow-glass border border-brand-pink-light/60"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
      >
        <CheckCircle size={44} strokeWidth={1.8} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-2">Đặt Lịch Thành Công!</h2>
        <p className="text-gray-600 leading-relaxed mb-2 text-sm">
          Cảm ơn <strong className="text-brand-pink-dark">{name}</strong> đã tin tưởng lựa chọn NanaNail Đà Lạt.
        </p>
        <p className="text-gray-400 text-xs mb-6">
          Nhân viên chăm sóc sẽ liên hệ lại trong vòng <strong>30 phút</strong> để xác nhận chi tiết lịch hẹn.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onReset} className="btn-primary px-6 py-3 text-sm">
            <Sparkles size={16} />
            Đặt Lịch Khác
          </button>
          <Link to="/" className="btn-outline px-6 py-3 text-sm">
            Về Trang Chủ
          </Link>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

// ─── MAIN BOOKING PAGE ────────────────────────────────────────────────────────
const STEPS = ['Dịch Vụ', 'Ngày & Giờ', 'Thông Tin', 'Xác Nhận'];

const BookingPage = () => {
  usePageSEO({
    title: 'Đặt Lịch Hẹn Nail Online | NanaNail Đà Lạt',
    description: 'Đặt lịch nail online tại NanaNail Đà Lạt nhanh chóng, chọn giờ linh hoạt, xác nhận trong 30 phút.',
    keywords: 'đặt lịch nail Đà Lạt, book nail online, NanaNail đặt lịch',
  });
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('service');

  const [services, setServices] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState(
    preselectedId ? [parseInt(preselectedId, 10)] : []
  );
  const [dateTime, setDateTime] = useState({ date: '', timeSlot: '' });
  const [info, setInfo] = useState({ name: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    apiClient.get('/services').then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setServices(data);
      if (preselectedId) {
        const found = data.find(s => String(s.id) === preselectedId);
        if (found) setSelectedServices([found.id]);
      }
    }).catch(err => {
      console.error(err);
      setServices([]);
    });
  }, []);

  const canNext = () => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) return dateTime.date && dateTime.timeSlot;
    if (step === 3) return info.name.trim().length >= 2;
    return true;
  };

  const handleNext = () => {
    setError('');
    if (!canNext()) {
      const msgs = ['Vui lòng chọn ít nhất một dịch vụ.', 'Vui lòng chọn cả ngày và khung giờ hẹn.', 'Vui lòng nhập họ và tên của bạn.'];
      setError(msgs[step - 1]);
      return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const serviceNames = services.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(', ');
      const appointmentDate = `${dateTime.date}T${dateTime.timeSlot.length === 5 ? dateTime.timeSlot + ':00' : dateTime.timeSlot}`;

      await apiClient.post('/appointments', {
        customer_name: info.name,
        customer_phone: info.phone,
        phone: info.phone,
        service_id: selectedServices[0],
        services_list: serviceNames,
        appointment_date: appointmentDate,
        time_slot: dateTime.timeSlot,
        notes: info.notes,
      });

      setDone(true);
    } catch (err) {
      setError('Đã có lỗi xảy ra khi đặt lịch. Vui lòng gọi trực tiếp hotline 0965 371 841.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setDone(false);
    setStep(1);
    setSelectedServices([]);
    setDateTime({ date: '', timeSlot: '' });
    setInfo({ name: '', phone: '', notes: '' });
    setError('');
  };

  if (done) return <SuccessScreen name={info.name} onReset={handleReset} />;

  const chosenServices = services.filter(s => selectedServices.includes(s.id));
  const estimatedCost = chosenServices.reduce((acc, s) => acc + (s.price || 0), 0);

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge mx-auto"
          >
            <CalendarHeart size={14} />
            Đặt Lịch Hẹn Trực Tuyến
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-2"
          >
            Đặt Lịch Tại <span className="text-gradient">NanaNail</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm sm:text-base max-w-md mx-auto"
          >
            Chọn dịch vụ yêu thích & khung giờ giữ chỗ giữ vị trí riêng cho bạn
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">

          {/* ── Main Step Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-glass border border-brand-pink-light/60 p-6 sm:p-8">
              <StepIndicator currentStep={step} steps={STEPS} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 1 && (
                    <Step1Services
                      services={services}
                      selected={selectedServices}
                      onChange={setSelectedServices}
                    />
                  )}
                  {step === 2 && (
                    <Step2DateTime
                      formData={dateTime}
                      onChange={setDateTime}
                    />
                  )}
                  {step === 3 && (
                    <Step3Info
                      formData={info}
                      onChange={setInfo}
                    />
                  )}
                  {step === 4 && (
                    <Step4Confirm
                      services={services}
                      selectedIds={selectedServices}
                      dateTime={dateTime}
                      info={info}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs sm:text-sm font-semibold">
                  <Info size={16} />
                  {error}
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(s => s - 1); }}
                    className="btn-outline flex-1 py-3 text-sm rounded-2xl"
                  >
                    <ChevronLeft size={16} />
                    Quay Lại
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary flex-1 py-3 text-sm rounded-2xl shadow-glow-pink"
                  >
                    Tiếp Theo
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary flex-1 py-3.5 text-sm rounded-2xl shadow-glow-pink"
                  >
                    {submitting ? 'Đang gửi...' : 'Xác Nhận Đặt Lịch'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Summary & Info Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Real-time Order Preview Receipt Card */}
            <div className="bg-gradient-to-b from-brand-pink-light/40 to-white rounded-3xl p-5 border border-brand-pink-light shadow-glass">
              <h3 className="font-serif font-bold text-gray-800 mb-3 text-sm flex items-center justify-between">
                <span>📋 Phiếu Đặt Hẹn Tạm Tính</span>
                <span className="text-[10px] bg-brand-pink-dark text-white px-2 py-0.5 rounded-full font-sans font-bold">NanaNail</span>
              </h3>

              <div className="space-y-2 mb-4 text-xs">
                {chosenServices.length > 0 ? (
                  chosenServices.map(s => (
                    <div key={s.id} className="flex justify-between items-center text-gray-700">
                      <span className="font-medium truncate max-w-[140px]">{s.name}</span>
                      <span className="font-mono font-bold text-brand-pink-dark">{maskPrice(s.price)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Chưa chọn dịch vụ nào</p>
                )}
              </div>

              <div className="pt-3 border-t border-brand-pink/20 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Ngày hẹn:</span>
                  <span className="font-bold text-gray-800">{dateTime.date || 'Chưa chọn'}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Khung giờ:</span>
                  <span className="font-bold text-brand-pink-dark">{dateTime.timeSlot || 'Chưa chọn'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-dashed border-brand-pink/30 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Tạm tính:</span>
                <span className="text-base font-bold font-mono text-brand-pink-dark">
                  {estimatedCost > 0 ? maskPrice(estimatedCost) : '0đ'}
                </span>
              </div>
            </div>

            {/* Salon Info Card */}
            <div className="bg-white rounded-3xl shadow-glass border border-gray-100 p-5 space-y-3">
              <h4 className="font-serif font-bold text-gray-800 text-xs uppercase tracking-wider text-brand-pink-dark">📍 Địa Chỉ NanaNail</h4>
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <MapPin size={14} className="text-brand-pink-dark mt-0.5 flex-shrink-0" />
                55B/7 Hàn Thuyên, P.4, Đà Lạt
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Phone size={14} className="text-brand-pink-dark flex-shrink-0" />
                <a href="tel:0965371841" className="font-bold text-brand-pink-dark hover:underline">0965 371 841</a>
              </p>
            </div>

            {/* Quality Commitment */}
            <div className="bg-emerald-50/60 rounded-3xl p-4 border border-emerald-100 flex items-center gap-3">
              <HeartHandshake size={28} className="text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-800">Cam Kết Chất Lượng</p>
                <p className="text-[11px] text-emerald-600">Dụng cụ tiệt trùng 100% — Bảo hành sơn gel 7 ngày</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;