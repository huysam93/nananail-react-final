import { Star, Quote } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(-2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="group bg-white rounded-2xl shadow-[0_8px_25px_rgba(219,39,119,0.08)] hover:shadow-[0_20px_40px_rgba(219,39,119,0.18)] border border-pink-200/90 hover:border-brand-pink-dark/60 transition-all duration-300 hover:-translate-y-1.5 p-6 flex flex-col h-full">
      {/* Quote icon */}
      <Quote className="text-brand-pink-light mb-3" size={32} strokeWidth={1.5} />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed flex-1 italic mb-5">
        "{review.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink-medium to-brand-pink-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {getInitials(review.customer_name)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">{review.customer_name}</h4>
          <p className="text-xs text-gray-400">Khách hàng NanaNail</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;