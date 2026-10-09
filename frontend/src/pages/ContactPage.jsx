import { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, Facebook, Instagram } from 'lucide-react';
import { SiZalo } from 'react-icons/si';
import { motion } from 'framer-motion';
import usePageSEO from '../hooks/usePageSEO';

const ContactPage = () => {
  usePageSEO({
    title: 'Liên Hệ NanaNail | Tiệm Nail Tại Hàn Thuyên, Đà Lạt',
    description: 'Địa chỉ: 55B/7 Hàn Thuyên, P.4, Đà Lạt. Hotline: 0965 371 841. Gửi tin nhắn trực tiếp hoặc liên hệ Zalo, Facebook.',
    keywords: 'liên hệ NanaNail, địa chỉ NanaNail Đà Lạt, tiệm nail Hàn Thuyên, hotline NanaNail',
  });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Đang gửi...', type: 'info' });
    try {
      await apiClient.post('/contacts', formData);
      setStatus({ message: 'Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất!', type: 'success' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại.', type: 'error' });
      console.error(error);
    }
  };

  const contactItems = [
    {
      icon: <MapPin className="text-brand-pink-dark" size={20} />,
      label: 'Địa Chỉ',
      value: '55B/7 Hàn Thuyên, Phường 4, Đà Lạt, Lâm Đồng',
      href: 'https://maps.google.com/?q=55B/7+Hàn+Thuyên+Phường+4+Đà+Lạt',
    },
    {
      icon: <Phone className="text-brand-pink-dark" size={20} />,
      label: 'Điện Thoại',
      value: '0965 371 841',
      href: 'tel:0965371841',
    },
    {
      icon: <Mail className="text-brand-pink-dark" size={20} />,
      label: 'Email',
      value: 'huysam93@gmail.com',
      href: 'mailto:huysam93@gmail.com',
    },
    {
      icon: <Clock className="text-brand-pink-dark" size={20} />,
      label: 'Giờ Làm Việc',
      value: 'T2–T6: 8:00–20:00 | T7–CN: 8:00–21:00',
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="page-hero">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge mx-auto"
          >
            <Mail size={14} />
            Thông Tin Liên Hệ
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            Liên Hệ Với <span className="text-gradient">NanaNail</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg"
          >
            Chúng tôi luôn sẵn sàng lắng nghe, tư vấn và hỗ trợ bạn
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {/* Contact Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-glass border border-brand-pink-light/60 p-6 sm:p-7">
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-5">Thông Tin Salon</h2>
              <ul className="space-y-5">
                {contactItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-pink-light flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-gray-700 text-sm font-semibold hover:text-brand-pink-dark transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-700 text-sm font-semibold">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Social */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-3">Kết Nối Mạng Xã Hội</p>
                <div className="flex gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-brand-pink-light flex items-center justify-center text-brand-pink-dark hover:bg-brand-pink-dark hover:text-white transition-all shadow-sm"
                    aria-label="Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-brand-pink-light flex items-center justify-center text-brand-pink-dark hover:bg-brand-pink-dark hover:text-white transition-all shadow-sm"
                    aria-label="Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href="https://zalo.me/0965371841" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-brand-pink-light flex items-center justify-center text-brand-pink-dark hover:bg-brand-pink-dark hover:text-white transition-all shadow-sm"
                    aria-label="Zalo">
                    <SiZalo size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden shadow-glass border border-brand-pink-light/50 h-56">
              <iframe
                title="NanaNail Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.5624987!2d108.4384!3d11.9404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s55B%2F7+H%C3%A0n+Thuy%C3%AAn%2C+Ph%C6%B0%E1%BB%9Dng+4%2C+%C4%90%C3%A0+L%E1%BA%A1t!5e0!3m2!1svi!2svn!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-glass border border-brand-pink-light/60 p-6 sm:p-7">
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-5">Gửi Tin Nhắn Phản Hồi</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Họ và Tên <span className="text-brand-pink-dark">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên..."
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email / Số điện thoại <span className="text-brand-pink-dark">*</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email hoặc số điện thoại..."
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nội Dung <span className="text-brand-pink-dark">*</span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    className="input-field resize-none"
                    required
                  />
                </div>

                {status.message && (
                  <div className={`flex items-start gap-2 p-3.5 rounded-xl text-sm ${
                    status.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700 font-medium' :
                    status.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600 font-medium' :
                    'bg-gray-50 border border-gray-200 text-gray-600'
                  }`}>
                    {status.type === 'success' && <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-green-500" />}
                    {status.message}
                  </div>
                )}

                <button type="submit" className="btn-primary w-full py-3.5 text-base">
                  <Send size={16} />
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;