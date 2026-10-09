import { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';

const MessageManagement = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await apiClient.get('/messages');
                setMessages(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Failed to fetch messages", error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return <p>Loading messages...</p>;
    }

    return (
        <div className="space-y-4">
            {messages.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian gửi</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                             {(Array.isArray(messages) ? messages : []).map(message => (
                                <tr key={message.id}>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{formatDate(message.createdAt)}</td>
                                    <td className="py-4 px-6 text-sm text-gray-800">{message.content}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Không có tin nhắn nào từ chatbox.</p>
            )}
        </div>
    );
};

export default MessageManagement;
