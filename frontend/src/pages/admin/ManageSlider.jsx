import { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { Trash2, PlusCircle, UploadCloud } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const ManageSlider = () => {
    const [images, setImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ image_base64: null });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await apiClient.get('/slider');
            setImages(res.data);
        } catch (error) {
            console.error("Failed to fetch slider images", error);
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ image_base64: null });
        setPreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                setFormData({ image_base64: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image_base64) {
            alert('Vui lòng chọn một hình ảnh.');
            return;
        }
        try {
            await apiClient.post('/slider', formData);
            fetchImages();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to add slider image", error);
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi slider?')) {
            try {
                await apiClient.delete(`/slider/${id}`);
                fetchImages();
            } catch (error) {
                console.error("Failed to delete slider image", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={handleOpenModal} className="bg-brand-pink-dark text-white px-4 py-2 rounded-lg flex items-center hover:bg-brand-pink-medium">
                    <PlusCircle size={20} className="mr-2" /> Thêm Ảnh Slider
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map(image => (
                    <div key={image.id} className="relative group aspect-square">
                        <img src={getImageUrl(image.image_base64)} alt="Slider image" className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <button onClick={() => handleDelete(image.id)} className="text-white p-2 bg-red-600 rounded-full hover:bg-red-700">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Thêm Ảnh Mới cho Slider</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                           <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ảnh</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="mx-auto h-24 w-auto"/>
                                        ) : (
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                                        )}
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload-slider" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-pink-dark hover:text-brand-pink-medium focus-within:outline-none">
                                                <span>Tải ảnh lên</span>
                                                <input id="file-upload-slider" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} required />
                                            </label>
                                            <p className="pl-1">hoặc kéo và thả</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-brand-pink-dark text-white rounded">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSlider;