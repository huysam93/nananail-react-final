import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import apiClient from '../api/axiosConfig';
import { Calendar as CalendarIcon, Clock, RefreshCw, X, User, Phone, Sparkles, FileText } from 'lucide-react';

const AppointmentScheduler = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [selectedDayData, setSelectedDayData] = useState(null); // { dateStr, appointments: [] }

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/appointments');
            
            const formattedEvents = response.data.map(apt => {
                let rawDate = (apt.appointment_date || '').trim();
                if (rawDate.includes(' ')) {
                    rawDate = rawDate.replace(' ', 'T');
                }
                if (rawDate.includes('T')) {
                    const parts = rawDate.split('T');
                    const timePart = parts[1] || '09:00';
                    const cleanTime = timePart.length === 5 ? `${timePart}:00` : timePart;
                    rawDate = `${parts[0]}T${cleanTime}`;
                } else if (rawDate.length === 10) {
                    rawDate = `${rawDate}T09:00:00`;
                }

                let backgroundColor = '#FCE7F3';
                let textColor = '#9D174D';
                let dotColor = '#DB2777';
                let borderColor = '#EC4899';
                let statusText = 'Chờ xác nhận';

                if (apt.status === 'pending') {
                    backgroundColor = '#FEF3C7'; // Light Amber
                    textColor = '#92400E';       // Dark Amber Text
                    dotColor = '#D97706';        // Vibrant Amber Dot
                    borderColor = '#F59E0B';
                    statusText = 'Chờ xác nhận';
                } else if (apt.status === 'confirmed') {
                    backgroundColor = '#D1FAE5'; // Light Emerald
                    textColor = '#065F46';       // Dark Emerald Text
                    dotColor = '#059669';        // Vibrant Emerald Dot
                    borderColor = '#10B981';
                    statusText = 'Đã xác nhận';
                } else if (apt.status === 'done') {
                    backgroundColor = '#FCE7F3'; // Light Pink
                    textColor = '#9D174D';       // Dark Pink Text
                    dotColor = '#DB2777';        // Vibrant Pink Dot
                    borderColor = '#EC4899';
                    statusText = 'Hoàn thành';
                } else if (apt.status === 'cancelled') {
                    backgroundColor = '#F3F4F6'; // Light Gray
                    textColor = '#374151';       // Dark Gray Text
                    dotColor = '#6B7280';        // Vibrant Gray Dot
                    borderColor = '#9CA3AF';
                    statusText = 'Đã hủy';
                }

                const customerName = apt.customer_name || 'Khách Đặt Hẹn';
                const serviceName = apt.services_list || apt.service_name || 'Dịch Vụ Nail';
                const timeSlot = apt.time_slot || (rawDate.includes('T') ? rawDate.split('T')[1].slice(0, 5) : '09:00');

                return {
                    id: String(apt.id),
                    title: customerName,
                    start: rawDate,
                    allDay: false,
                    backgroundColor,
                    borderColor,
                    textColor,
                    extendedProps: {
                        customer_name: customerName,
                        service_name: serviceName,
                        time_slot: timeSlot,
                        status: apt.status || 'pending',
                        statusText,
                        phone: apt.customer_phone || 'Chưa cung cấp',
                        notes: apt.notes || '',
                        backgroundColor,
                        textColor,
                        dotColor,
                        borderColor
                    }
                };
            });

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Failed to fetch appointments for scheduler:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Open Day Details Popup
    const handleDateClick = (dateStr) => {
        // Find all events on this date
        const matched = events.filter(e => e.start.startsWith(dateStr));
        setSelectedDayData({
            dateStr,
            appointments: matched
        });
    };

    const handleEventClick = (clickInfo) => {
        const dateStr = clickInfo.event.startStr.slice(0, 10);
        handleDateClick(dateStr);
    };

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    return (
        <div className="bg-white p-3 sm:p-6 rounded-3xl shadow-glass border border-brand-pink-light/60 space-y-4 relative">
            {/* Header Toolbar & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                    <CalendarIcon size={18} className="text-brand-pink-dark" />
                    <span className="font-serif font-bold text-gray-800 text-sm sm:text-base">Lịch Đặt Hẹn NanaNail</span>
                    <button
                        onClick={fetchAppointments}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-pink-dark transition-colors"
                        title="Tải lại lịch"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Status Legend */}
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-medium">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Chờ xác nhận
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Đã xác nhận
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-pink-50 text-pink-800 border border-pink-200">
                        <span className="w-2 h-2 rounded-full bg-pink-500"></span> Hoàn thành
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 text-gray-400 text-sm bg-gray-50/50 rounded-2xl">
                    <RefreshCw size={18} className="animate-spin mr-2 text-brand-pink-dark" />
                    Đang đồng bộ lịch hẹn...
                </div>
            ) : (
                <div className="fullcalendar-custom-wrapper overflow-hidden">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView={isMobile ? "dayGridMonth" : "dayGridMonth"}
                        headerToolbar={isMobile ? {
                            left: 'prev,next',
                            center: 'title',
                            right: 'dayGridMonth,listWeek'
                        } : {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        views={{
                            dayGridMonth: {
                                titleFormat: isMobile ? { year: 'numeric', month: 'numeric' } : { year: 'numeric', month: 'long' }
                            },
                            timeGridWeek: {
                                titleFormat: { year: 'numeric', month: 'short' }
                            },
                            timeGridDay: {
                                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
                            },
                            listWeek: {
                                titleFormat: isMobile ? { month: 'numeric', day: 'numeric' } : { year: 'numeric', month: 'short', day: 'numeric' }
                            }
                        }}
                        events={events}
                        height="auto"
                        contentHeight="auto"
                        aspectRatio={isMobile ? 1.1 : 1.5}
                        expandRows={true}
                        locale="vi"
                        buttonText={{
                            today: 'Hôm nay',
                            month: 'Tháng',
                            week: 'Tuần',
                            day: 'Ngày',
                            list: 'Danh sách'
                        }}
                        slotMinTime="07:00:00"
                        slotMaxTime="21:00:00"
                        allDaySlot={false}
                        stickyHeaderDates={true}
                        handleWindowResize={true}
                        dayMaxEvents={isMobile ? 2 : 4}
                        moreLinkClick={(info) => {
                            const d = info.date;
                            const year = d.getFullYear();
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            const dateStr = `${year}-${month}-${day}`;
                            handleDateClick(dateStr);
                            return 'none';
                        }}
                        moreLinkContent={(args) => `+${args.num} lịch`}
                        dateClick={(info) => handleDateClick(info.dateStr)}
                        eventClick={(clickInfo) => {
                            clickInfo.jsEvent.preventDefault();
                            clickInfo.jsEvent.stopPropagation();
                            const dateObj = clickInfo.event.start;
                            if (dateObj) {
                                const year = dateObj.getFullYear();
                                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                                const day = String(dateObj.getDate()).padStart(2, '0');
                                const dateStr = `${year}-${month}-${day}`;
                                handleDateClick(dateStr);
                            }
                        }}
                        eventContent={(eventInfo) => {
                            const time = eventInfo.event.extendedProps.time_slot || '09:00';
                            const name = eventInfo.event.extendedProps.customer_name || 'Khách';
                            const service = eventInfo.event.extendedProps.service_name || '';
                            const bg = eventInfo.event.extendedProps.backgroundColor || '#FCE7F3';
                            const textCol = eventInfo.event.extendedProps.textColor || '#9D174D';
                            const dotCol = eventInfo.event.extendedProps.dotColor || '#DB2777';
                            const borderCol = eventInfo.event.extendedProps.borderColor || '#EC4899';

                            return (
                                <div
                                    className="flex items-center gap-1 text-[10.5px] font-semibold py-0.5 px-1.5 rounded-md overflow-hidden w-full cursor-pointer border transition-transform active:scale-[0.98]"
                                    style={{
                                        backgroundColor: bg,
                                        color: textCol,
                                        borderColor: `${borderCol}60`
                                    }}
                                    title={`${time} - ${name} (${service})`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotCol }}></span>
                                    <span className="font-bold flex-shrink-0 text-[10px] tracking-tight">{time}</span>
                                    <span className="truncate flex-1 font-semibold text-[10.5px] leading-tight">{name}</span>
                                </div>
                            );
                        }}
                    />
                </div>
            )}

            {/* Popup Detail Modal */}
            {selectedDayData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-brand-pink-dark to-rose-500 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarIcon size={18} />
                                <h3 className="font-serif font-bold text-base">
                                    Lịch hẹn ngày {formatDateDisplay(selectedDayData.dateStr)}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedDayData(null)}
                                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 overflow-y-auto space-y-3 flex-1">
                            {selectedDayData.appointments.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 space-y-2">
                                    <Sparkles size={32} className="mx-auto text-pink-300" />
                                    <p className="text-sm font-medium">Chưa có lịch hẹn nào trong ngày này</p>
                                </div>
                            ) : (
                                selectedDayData.appointments.map((apt, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2 shadow-sm"
                                    >
                                        {/* Row 1: Time & Status */}
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-brand-pink-dark bg-white px-2.5 py-1 rounded-lg border border-pink-200">
                                                <Clock size={13} /> {apt.extendedProps.time_slot}
                                            </span>
                                            <span
                                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white`}
                                                style={{ backgroundColor: apt.backgroundColor }}
                                            >
                                                {apt.extendedProps.statusText}
                                            </span>
                                        </div>

                                        {/* Row 2: Customer Info */}
                                        <div className="space-y-1 text-xs text-gray-700 pt-1">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="font-bold text-gray-800">{apt.extendedProps.customer_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                                                <span>{apt.extendedProps.phone}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Sparkles size={14} className="text-brand-pink-dark flex-shrink-0 mt-0.5" />
                                                <span className="font-medium text-brand-pink-dark">{apt.extendedProps.service_name}</span>
                                            </div>
                                            {apt.extendedProps.notes && (
                                                <div className="flex items-start gap-2 text-gray-500 pt-1 border-t border-pink-100/60 mt-1">
                                                    <FileText size={13} className="flex-shrink-0 mt-0.5" />
                                                    <span className="italic">{apt.extendedProps.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedDayData(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentScheduler;