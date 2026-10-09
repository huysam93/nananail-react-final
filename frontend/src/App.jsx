import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbox from './components/Chatbox';
import ScrollToTop from './components/ScrollToTop';
import FloatingCTA from './components/ui/FloatingCTA';
import ZaloButton from './components/ui/ZaloButton';
import { useEffect } from 'react';
import { recordVisit } from './api/visitors';

// ─── Lazy-loaded pages (code splitting) ────────────────────────────────────────
const HomePage       = lazy(() => import('./pages/HomePage'));
const AboutPage      = lazy(() => import('./pages/AboutPage'));
const ServicesPage   = lazy(() => import('./pages/ServicesPage'));
const GalleryPage    = lazy(() => import('./pages/GalleryPage'));
const ReviewsPage    = lazy(() => import('./pages/ReviewsPage'));
const ContactPage    = lazy(() => import('./pages/ContactPage'));
const BookingPage    = lazy(() => import('./pages/BookingPage'));
const NewsPage       = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage'));
const BeforeAfterPage = lazy(() => import('./pages/BeforeAfterPage'));
const LoginPage      = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'));
const LoyaltyPage    = lazy(() => import('./pages/LoyaltyPage'));

// ─── Page Loading Skeleton ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-brand-pink-light" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-pink-dark border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-brand-pink-dark font-medium animate-pulse">Đang tải...</p>
    </div>
  </div>
);

// ─── Page transition wrapper ───────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

const PageTransition = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    recordVisit(location.pathname);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"             element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/about"        element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/services"     element={<PageTransition><ServicesPage /></PageTransition>} />
              <Route path="/gallery"      element={<PageTransition><GalleryPage /></PageTransition>} />
              <Route path="/reviews"      element={<PageTransition><ReviewsPage /></PageTransition>} />
              <Route path="/contact"      element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/booking"      element={<PageTransition><BookingPage /></PageTransition>} />
              <Route path="/news"         element={<PageTransition><NewsPage /></PageTransition>} />
              <Route path="/news/:idOrSlug" element={<PageTransition><NewsDetailPage /></PageTransition>} />
              <Route path="/promotions"   element={<PageTransition><PromotionsPage /></PageTransition>} />
              <Route path="/before-after" element={<PageTransition><BeforeAfterPage /></PageTransition>} />
              <Route path="/loyalty"       element={<PageTransition><LoyaltyPage /></PageTransition>} />
              <Route path="/login"        element={<PageTransition><LoginPage /></PageTransition>} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <Chatbox />
      <ScrollToTop />
      {!isAdminPage && (
        <>
          <FloatingCTA />
          <ZaloButton />
        </>
      )}
    </div>
  );
}

export default App;
