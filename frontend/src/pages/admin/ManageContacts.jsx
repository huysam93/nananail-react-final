import { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { Trash2 } from 'lucide-react';

const ManageContacts = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await apiClient.get('/contacts');
            setContacts(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
            setContacts([]);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
            try {
                await apiClient.delete(`/contacts/${id}`);
                fetchContacts();
            } catch (error) {
                console.error("Failed to delete contact", error);
            }
        }
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="space-y-4">
            {Array.isArray(contacts) && contacts.length > 0 ? (
                contacts.map(contact => (
                    <div key={contact.id} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-bold text-lg">{contact.name}</div>
                                <a href={`mailto:${contact.email}`} className="text-sm text-blue-600">{contact.email}</a>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(contact.created_at)}</p>
                            </div>
                            <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <p className="mt-4 text-gray-700">{contact.message}</p>
                    </div>
                ))
            ) : (
                <p>Không có tin nhắn nào.</p>
            )}
        </div>
    );
};

export default ManageContacts;