import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (!success) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex">
      {/* Left: Brand visual */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-brand-pink-dark via-brand-pink-medium to-brand-pink-light relative overflow-hidden p-12">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute bottom-20 right-5 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/15" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-center relative z-10"
        >
          <div className="text-6xl mb-4 animate-float">💅</div>
          <h1 className="text-4xl font-serif font-bold mb-3">NanaNail</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-xs">
            Nơi mỗi bộ móng là một tác phẩm nghệ thuật
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {['500+ Khách hàng', '5+ Năm KN', '50+ Mẫu nail', '4.9★ Đánh giá'].map((s, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-white/90">
                {s}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile only */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl">💅</span>
            <h2 className="text-2xl font-serif font-bold text-gradient mt-2">NanaNail</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-1">Đăng Nhập</h2>
            <p className="text-gray-500 text-sm">Đăng nhập vào trang quản trị NanaNail</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên Đăng Nhập
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={17} />
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Nhập tên đăng nhập..."
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật Khẩu
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={17} />
                </span>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-11"
                  placeholder="Nhập mật khẩu..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-pink-dark transition-colors"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : 'Đăng Nhập'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;