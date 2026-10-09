import { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Users, Award, Gem, Heart, Sparkles } from 'lucide-react';
import usePageSEO from '../hooks/usePageSEO';

const AboutPage = () => {
  usePageSEO({
    title: 'Về NanaNail | Nail Salon Uy Tín Tại Đà Lạt',
    description: 'Tìm hiểu về NanaNail Đà Lạt — hành trình đam mê nghệ thuật móng, dịch vụ chăm sóc móng tận tâm, không gian thư giãn sang trọng.',
    keywords: 'về NanaNail, tiệm nail Đà Lạt, câu chuyện NanaNail, nail salon Đà Lạt',
  });

  const [aboutContent, setAboutContent] = useState('');

  useEffect(() => {
    apiClient.get('/about')
      .then(res => setAboutContent(res.data.content))
      .catch(err => console.error('Failed to fetch about content:', err));
  }, []);

  const milestones = [
    { year: '2019', desc: 'NanaNail chính thức khai trương tại Đà Lạt' },
    { year: '2020', desc: 'Mở rộng dịch vụ Nail Art Design và Đắp Bột' },
    { year: '2022', desc: 'Đạt 300+ khách hàng thân thiết, mở rộng không gian' },
    { year: '2024', desc: 'Ra mắt hệ thống đặt lịch online tiện lợi' },
  ];

  const stats = [
    { icon: <Users className="text-brand-pink-dark" size={24} />, value: '500+', label: 'Khách Hàng' },
    { icon: <Award className="text-brand-pink-dark" size={24} />, value: '5+', label: 'Năm Kinh Nghiệm' },
    { icon: <Gem className="text-brand-pink-dark" size={24} />, value: '50+', label: 'Mẫu Nail' },
    { icon: <Heart className="text-brand-pink-dark" size={24} />, value: '4.9★', label: 'Đánh Giá' },
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
            <Sparkles size={14} />
            Câu Chuyện NanaNail
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3"
          >
            Về <span className="text-gradient">NanaNail</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg"
          >
            Câu chuyện về tình yêu và đam mê với nghệ thuật làm móng tại Đà Lạt
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Content grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-card-hover border border-brand-pink-light/60"
            >
              <img
                src="https://scontent.fsgn24-1.fna.fbcdn.net/v/t39.30808-6/486595788_2484655618563367_3153967403476806946_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFUxNNAdCDcWtsnQbB5z4ZEpJPWxsOKaqekk9bGw4pqp3oMqhvo1bSsEViNNYS6lN4__fsIE71vs7ex2lgNa5Yl&_nc_ohc=1Fg4P8GYJfMQ7kNvwHyfs5j&_nc_oc=AdmGJlXYMazKmA4sORWG_PWUeLEGjJWZBGelRBkQJobOLNRDcHBXT0Qa4yXdHqcIOY8&_nc_zt=23&_nc_ht=scontent.fsgn24-1.fna&oh=00_AfMjjLoa94AhiJuJ36DgXtojvkNIirn8lQJ5EBBja0Z7Ww&oe=685AC1F8"
                alt="NanaNail Salon Interior"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-4 sm:space-y-5"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">Tôn Vinh Vẻ Đẹp Đôi Tay</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {aboutContent || 'Chào mừng đến với NanaNail! Chúng tôi tự hào mang đến cho bạn những dịch vụ chăm sóc móng chuyên nghiệp và chất lượng nhất tại Đà Lạt. Với đội ngũ kỹ thuật viên giàu kinh nghiệm, chúng tôi luôn cập nhật những xu hướng nail art mới nhất để mang lại cho bạn vẻ đẹp rạng rỡ và tự tin.'}
              </p>
              <blockquote className="border-l-4 border-brand-pink-dark pl-4 py-3 bg-brand-pink-light/60 rounded-r-xl">
                <p className="italic text-gray-700 text-sm sm:text-base font-medium">
                  "Nơi mỗi bộ móng là một tác phẩm nghệ thuật, và mỗi khách hàng là một nguồn cảm hứng."
                </p>
              </blockquote>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="stat-badge"
              >
                <div className="w-12 h-12 bg-brand-pink-light rounded-xl flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-8 text-center">Hành Trình Phát Triển</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-brand-pink-light hidden md:block" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white rounded-2xl p-5 shadow-glass border border-brand-pink-light/50 inline-block text-left hover:border-brand-pink-medium/50 transition-colors">
                        <span className="text-brand-pink-dark font-bold text-lg font-serif">{m.year}</span>
                        <p className="text-gray-600 text-sm mt-1">{m.desc}</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-brand-pink-dark border-4 border-brand-pink-light flex-shrink-0 hidden md:block" />
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;