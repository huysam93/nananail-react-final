import { Sparkles, Clock, CalendarHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mặt nạ giá: hiển số đầu, thay giữa bằng 'x', giữ 3 số cuối
// 150000 → '1xx.000đ' | 50000 → '5x.000đ' | 300000 → '3xx.000đ'
export const maskPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ';
  const str = Math.round(price).toString();
  if (str.length <= 3) return str + 'đ';
  const suffix = str.slice(-3);                         // "000"
  const visible = str.slice(0, 1);                      // chữ số đầu
  const middleLen = str.length - 1 - 3;                 // số chữ số cần ẩn
  const masked = 'x'.repeat(Math.max(1, middleLen));
  return `${visible}${masked}.${suffix}đ`;
};

const ServiceCard = ({ service }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-[0_8px_25px_rgba(219,39,119,0.08)] hover:shadow-[0_20px_40px_rgba(219,39,119,0.18)] border border-pink-200/90 hover:border-brand-pink-dark/60 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col h-full">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-pink-medium to-brand-pink-dark" />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-pink-light flex items-center justify-center flex-shrink-0 group-hover:bg-brand-pink group-hover:scale-110 transition-all duration-300">
            <Sparkles className="text-brand-pink-dark" size={18} />
          </div>
          <h3 className="text-lg font-serif font-bold text-gray-800 leading-snug pt-1">
            {service.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
          {service.description}
        </p>

        {/* Footer: duration + masked price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {service.duration_minutes ? (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={13} />
              <span>{service.duration_minutes} phút</span>
            </div>
          ) : (
            <span />
          )}
          {/* Giá mặt nạ – hover gợi ý liên hệ */}
          <span className="text-lg font-bold font-mono tracking-wide text-brand-pink-dark">
            {maskPrice(service.price)}
          </span>
        </div>

        {/* CTA Button */}
        <Link
          to={`/booking?service=${service.id}`}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-brand-pink-dark text-brand-pink-dark text-sm font-semibold hover:bg-brand-pink-dark hover:text-white transition-all duration-300 group-hover:shadow-glow-pink"
        >
          <CalendarHeart size={15} />
          Đặt lịch ngay
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;