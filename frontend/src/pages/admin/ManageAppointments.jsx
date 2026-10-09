import { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/axiosConfig';
import { CheckCircle, Clock, XCircle, Trash2, Phone, Filter, Calendar as CalendarIcon, List, Download, Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all'); // all | pending | confirmed | cancelled | done
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const clean = dateString.replace(' ', 'T');
    if (clean.includes('T')) {
      const [datePart, timePart] = clean.split('T');
      if (datePart && timePart) {
        const [y, m, d] = datePart.split('-');
        return `${d}/${m}/${y} ${timePart.slice(0, 5)}`;
      }
    }
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const updateStatus = async (id, status) => {
    try {
      await apiClient.put(`/appointments/${id}`, { status });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      try {
        await apiClient.delete(`/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error("Failed to delete appointment:", error);
      }
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (!filtered.length) return alert('Không có dữ liệu để xuất!');
    const headers = ['ID,Tên Khách Hàng,Số Điện Thoại,Dịch Vụ,Ngày Hẹn,Ghi Chú,Trạng Thái\n'];
    const rows = filtered.map(app =>
      `"${app.id}","${app.customer_name || ''}","${app.customer_phone || ''}","${app.services_list || app.service_name || ''}","${formatDate(app.appointment_date)}","${(app.notes || '').replace(/"/g, '""')}","${app.status || ''}"`
    );
    const blob = new Blob(['\uFEFF' + headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lich_hen_nananail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"><Clock size={11} />Chờ xác nhận</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800"><CheckCircle size={11} />Đã xác nhận</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800"><XCircle size={11} />Đã hủy</span>;
      case 'done':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-pink-light text-brand-pink-dark"><CheckCircle size={11} />Hoàn thành</span>;
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
    }
  };

  // Filter & Search
  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const matchFilter = filter === 'all' ? true : a.status === filter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        (a.customer_name && a.customer_name.toLowerCase().includes(q)) ||
        (a.customer_phone && a.customer_phone.includes(q)) ||
        (a.services_list && a.services_list.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [appointments, filter, searchQuery]);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    done: appointments.filter(a => a.status === 'done').length,
  };

  // Calendar Helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun

  const calendarDays = useMemo(() => {
    const days = [];
    // Adjust first day of week: Monday=0, Sunday=6
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayAppts = filtered.filter(a => {
        if (!a.appointment_date) return false;
        const clean = a.appointment_date.replace(' ', 'T');
        return clean.startsWith(dateStr) || clean.slice(0, 10) === dateStr;
      });
      days.push({ day: d, dateStr, appointments: dayAppts });
    }
    return days;
  }, [year, month, daysInMonth, firstDayOfWeek, filtered]);

  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));

  return (
    <div className="space-y-5">
      {/* Top Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-white text-brand-pink-dark shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List size={15} />
            Danh Sách
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'calendar' ? 'bg-white text-brand-pink-dark shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarIcon size={15} />
            Xem Lịch Hẹn
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, SĐT, dịch vụ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-medium bg-gray-50/50"
          />
        </div>

        {/* CSV Export & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-semibold hover:bg-green-100 transition-colors"
          >
            <Download size={14} />
            Xuất Báo Cáo (CSV)
          </button>
          <button
            onClick={fetchAppointments}
            className="px-3 py-1.5 text-xs font-semibold text-brand-pink-dark border border-brand-pink-medium rounded-xl hover:bg-brand-pink-light transition-colors"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Tất cả', color: 'bg-gray-100 text-gray-700' },
          { key: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
          { key: 'confirmed', label: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
          { key: 'done', label: 'Hoàn thành', color: 'bg-brand-pink-light text-brand-pink-dark' },
          { key: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === tab.key ? tab.color + ' ring-2 ring-offset-1 ring-brand-pink-medium' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label} ({counts[tab.key] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">Đang tải lịch hẹn...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">Không tìm thấy lịch hẹn phù hợp.</div>
      ) : viewMode === 'list' ? (
        /* TABLE LIST VIEW */
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-pink-light/50 border-b border-brand-pink-light">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide whitespace-nowrap">Khách Hàng</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide whitespace-nowrap">Dịch Vụ</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide whitespace-nowrap">Thời Gian Hẹn</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide whitespace-nowrap hidden lg:table-cell">Ghi Chú</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide whitespace-nowrap">Trạng Thái</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-brand-pink-dark uppercase tracking-wide whitespace-nowrap">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app, i) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-brand-pink-light/20 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-800">{app.customer_name}</p>
                    {app.customer_phone && (
                      <a href={`tel:${app.customer_phone}`} className="text-xs text-brand-pink-dark flex items-center gap-1 mt-0.5 hover:underline">
                        <Phone size={10} />{app.customer_phone}
                      </a>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-gray-700 max-w-[200px] truncate" title={app.services_list || app.service_name}>
                      {app.services_list || app.service_name || '—'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap font-medium">
                    {formatDate(app.appointment_date)}
                  </td>
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    {app.notes ? (
                      <span className="text-xs text-gray-500 max-w-[160px] block truncate" title={app.notes}>
                        {app.notes}
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {app.status !== 'confirmed' && app.status !== 'done' && (
                        <button
                          onClick={() => updateStatus(app.id, 'confirmed')}
                          className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap font-medium"
                        >
                          Xác nhận
                        </button>
                      )}
                      {app.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(app.id, 'done')}
                          className="text-xs bg-brand-pink-dark text-white px-2.5 py-1 rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap font-medium"
                        >
                          Hoàn thành
                        </button>
                      )}
                      {app.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(app.id, 'cancelled')}
                          className="text-xs bg-orange-400 text-white px-2.5 py-1 rounded-lg hover:bg-orange-500 transition-colors"
                        >
                          Hủy
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CALENDAR VIEW */
        <div className="bg-white rounded-2xl shadow-glass p-5 border border-gray-200 space-y-4">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-lg text-gray-800">
              Tháng {month + 1}, {year}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="text-xs text-brand-pink-dark font-medium px-2.5 py-1 bg-brand-pink-light rounded-lg hover:bg-brand-pink transition-colors"
              >
                Hôm nay
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(d => (
              <div key={d} className="py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                {d}
              </div>
            ))}

            {calendarDays.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} className="h-28 bg-gray-50/50 rounded-xl" />;
              }

              const isToday =
                new Date().getDate() === item.day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={item.dateStr}
                  className={`h-28 p-1.5 rounded-xl border flex flex-col justify-between overflow-hidden transition-all ${
                    isToday
                      ? 'border-brand-pink-dark bg-brand-pink-light/30 shadow-xs'
                      : 'border-gray-100 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                      isToday ? 'bg-brand-pink-dark text-white' : 'text-gray-700'
                    }`}>
                      {item.day}
                    </span>
                    {item.appointments.length > 0 && (
                      <span className="text-[10px] bg-brand-pink-light text-brand-pink-dark font-bold px-1.5 py-0.2 rounded-full">
                        {item.appointments.length} hẹn
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1 mt-1 scrollbar-hide">
                    {item.appointments.map(app => (
                      <div
                        key={app.id}
                        className={`text-[10px] p-1 rounded-md text-left truncate font-medium flex items-center justify-between cursor-pointer hover:opacity-90 ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-900 border border-yellow-200' :
                          app.status === 'confirmed' ? 'bg-green-100 text-green-900 border border-green-200' :
                          app.status === 'done' ? 'bg-pink-100 text-pink-900 border border-pink-200' :
                          'bg-gray-100 text-gray-500 line-through'
                        }`}
                        title={`${app.customer_name} - ${app.services_list || app.service_name || 'Nail'} (${app.status})`}
                      >
                        <span className="truncate flex-1">{app.customer_name}</span>
                        <span className="font-bold text-[9px] ml-1 shrink-0">
                          {new Date(app.appointment_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
