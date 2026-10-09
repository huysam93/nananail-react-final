import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scissors, ImageIcon, MessageSquare, Calendar, Mail, SlidersHorizontal, MessageCircle, Newspaper, Tag, SplitSquareHorizontal, Crown } from 'lucide-react';
import ManageServices from './admin/ManageServices';
import ManageAppointments from './admin/ManageAppointments';
import ManageGallery from './admin/ManageGallery';
import ManageSlider from './admin/ManageSlider';
import ManageReviews from './admin/ManageReviews';
import ManageContacts from './admin/ManageContacts';
import MessageManagement from './admin/MessageManagement';
import ManagePosts from './admin/ManagePosts';
import ManagePromotions from './admin/ManagePromotions';
import ManageBeforeAfter from './admin/ManageBeforeAfter';
import ManageLoyalty from './admin/ManageLoyalty';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import apiClient from '../api/axiosConfig';
import { getVisitorStats } from "../api/visitors";
import { Menu } from 'lucide-react';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname.replace('/admin', '');
    if (path.startsWith('/services')) return 'Quản Lý Dịch Vụ';
    if (path.startsWith('/appointments')) return 'Quản Lý Lịch Hẹn';
    if (path.startsWith('/gallery')) return 'Quản Lý Bộ Sưu Tập';
    if (path.startsWith('/slider')) return 'Quản Lý Slider';
    if (path.startsWith('/reviews')) return 'Quản Lý Đánh Giá';
    if (path.startsWith('/contacts')) return 'Quản Lý Liên Hệ';
    if (path.startsWith('/messages')) return 'Quản Lý Tin Nhắn Chatbox';
    if (path.startsWith('/posts')) return 'Quản Lý Bài Viết';
    if (path.startsWith('/promotions')) return 'Quản Lý Khuyến Mãi';
    if (path.startsWith('/before-after')) return 'Quản Lý Ảnh Trước/Sau';
    if (path.startsWith('/loyalty')) return 'Quản Lý Thành Viên Loyalty';
    return 'Bảng Điều Khiển';
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
      ? 'bg-brand-pink text-brand-pink-dark'
      : 'text-gray-600 hover:bg-brand-pink-light hover:text-brand-pink-dark'
    }`;

  return (
    <div className="flex min-h-[calc(100vh-130px)] bg-gray-50 relative overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-16 left-4 z-[15] p-2 rounded-md bg-white shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle Menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:static
        top-0 left-0
        h-[100dvh] md:h-full
        w-72 md:w-64
        bg-white border-r border-gray-200
        p-4
        transition-transform duration-300 ease-in-out
        z-[10]
        overflow-y-auto
        shadow-lg md:shadow-none
      `}>
        <nav className="space-y-2" onClick={() => setIsSidebarOpen(false)}>
          <NavLink to="/admin" end className={navLinkClass}><LayoutDashboard size={20} className="mr-3" /> Bảng Điều Khiển</NavLink>
          <NavLink to="/admin/services" className={navLinkClass}><Scissors size={20} className="mr-3" /> Dịch Vụ</NavLink>
          <NavLink to="/admin/appointments" className={navLinkClass}><Calendar size={20} className="mr-3" /> Lịch Hẹn</NavLink>
          <NavLink to="/admin/promotions" className={navLinkClass}><Tag size={20} className="mr-3" /> Khuyến Mãi</NavLink>
          <NavLink to="/admin/before-after" className={navLinkClass}><SplitSquareHorizontal size={20} className="mr-3" /> Ảnh Trước/Sau</NavLink>
          <NavLink to="/admin/loyalty" className={navLinkClass}><Crown size={20} className="mr-3" /> Thành Viên</NavLink>
          <NavLink to="/admin/gallery" className={navLinkClass}><ImageIcon size={20} className="mr-3" /> Bộ Sưu Tập</NavLink>
          <NavLink to="/admin/slider" className={navLinkClass}><SlidersHorizontal size={20} className="mr-3" /> Slider</NavLink>
          <NavLink to="/admin/reviews" className={navLinkClass}><MessageSquare size={20} className="mr-3" /> Đánh Giá</NavLink>
          <NavLink to="/admin/contacts" className={navLinkClass}><Mail size={20} className="mr-3" /> Liên hệ</NavLink>
          <NavLink to="/admin/messages" className={navLinkClass}><MessageCircle size={20} className="mr-3" /> Tin nhắn Chatbox</NavLink>
          <NavLink to="/admin/posts" className={navLinkClass}><Newspaper size={20} className="mr-3" /> Bài Viết</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-x-auto pt-16 md:pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
        </div>

        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="promotions" element={<ManagePromotions />} />
          <Route path="before-after" element={<ManageBeforeAfter />} />
          <Route path="loyalty" element={<ManageLoyalty />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="slider" element={<ManageSlider />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="messages" element={<MessageManagement />} />
          <Route path="posts" element={<ManagePosts />} />
        </Routes>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-[5]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    services: 0,
    appointments: 0,
    reviews: 0,
    contacts: 0,
    messages: 0,
    visitors: 0
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [appointmentsByMonth, setAppointmentsByMonth] = useState([]);
  const [visitorStats, setVisitorStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [servicesRes, appointmentsRes, reviewsRes, contactsRes, messagesRes, visitorsRes] = await Promise.all([
        apiClient.get('/services'),
        apiClient.get(`/appointments?start=${dateRange.startDate}&end=${dateRange.endDate}`),
        apiClient.get('/reviews'),
        apiClient.get('/contacts'),
        apiClient.get('/messages'),
        apiClient.get(`/visitors?start=${dateRange.startDate}&end=${dateRange.endDate}`)
      ]);

      setStats({
        services: servicesRes.data.length,
        appointments: appointmentsRes.data.length,
        reviews: reviewsRes.data.length,
        contacts: contactsRes.data.length,
        messages: messagesRes.data.length,
        visitors: visitorsRes.data.total || 0
      });

      // Xử lý dữ liệu lịch hẹn theo tháng
      processAppointmentsData(appointmentsRes.data);
      // Xử lý dữ liệu lượt truy cập
      const stats = await getVisitorStats(
        dateRange.startDate,
        dateRange.endDate
      );
      setVisitorStats(stats);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu thống kê:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const processAppointmentsData = (appointments) => {
    const monthlyData = new Array(12).fill(0);
    appointments.forEach(apt => {
      const month = new Date(apt.appointment_date).getMonth();
      monthlyData[month]++;
    });
    setAppointmentsByMonth(monthlyData);
  };

  const handleDateChange = (e) => {
    setDateRange(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const barChartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [{
      label: 'Số lượng lịch hẹn',
      data: appointmentsByMonth,
      backgroundColor: 'rgba(219, 39, 119, 0.5)',
      borderColor: 'rgb(219, 39, 119)',
      borderWidth: 1
    }]
  };

  const visitorChartData = {
    labels: visitorStats.map(stat => stat.date),
    datasets: [{
      label: 'Lượt truy cập',
      data: visitorStats.map(stat => stat.count),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }]
  };

  const pieChartData = {
    labels: ['Dịch vụ', 'Lịch hẹn', 'Đánh giá', 'Liên hệ', 'Tin nhắn'],
    datasets: [{
      data: [stats.services, stats.appointments, stats.reviews, stats.contacts, stats.messages],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartData = {
    labels: visitorStats.map((stat) => stat.visit_date),
    datasets: [
      {
        label: "Tổng lượt truy cập",
        data: visitorStats.map((stat) => stat.visit_count),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Khách truy cập duy nhất",
        data: visitorStats.map((stat) => stat.unique_visitors),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-xl font-semibold mb-4">Chào mừng đến với trang quản trị NanaNail!</h2>
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Từ ngày:</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Đến ngày:</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-pink-600">Dịch vụ</h4>
            <p className="text-2xl font-bold text-pink-700">{stats.services}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-600">Lịch hẹn</h4>
            <p className="text-2xl font-bold text-blue-700">{stats.appointments}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-600">Đánh giá</h4>
            <p className="text-2xl font-bold text-yellow-700">{stats.reviews}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-600">Liên hệ</h4>
            <p className="text-2xl font-bold text-green-700">{stats.contacts}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-600">Tin nhắn</h4>
            <p className="text-2xl font-bold text-purple-700">{stats.messages}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-teal-600">Lượt truy cập</h4>
            <p className="text-2xl font-bold text-teal-700"> {visitorStats.reduce((sum, stat) => sum + stat.visit_count, 0)}</p>
          </div>
          <div className="bg-white-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-teal-600">Khách truy cập duy nhất</h4>
            <p className="text-2xl font-bold text-teal-700">  {visitorStats.reduce((sum, stat) => sum + stat.unique_visitors, 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow col-span-2">
          <h3 className="text-lg font-semibold mb-4">Thống kê lịch hẹn theo tháng</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tổng quan dữ liệu</h3>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <Line data={chartData} />
      </div>
    </div>
  );
};


export default AdminDashboard;
