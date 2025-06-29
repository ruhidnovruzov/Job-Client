// src/pages/EditJobPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Tarix seçici üçün
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker stilləri

const EditJobPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // URL-dən iş elanının ID-sini alırıq

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        salaryRange: '',
        jobType: 'Tam İş Günü',
        experienceLevel: 'Təcrübəsiz',
        applicationDeadline: new Date(), // Başlanğıc olaraq cari tarix
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // İstifadəçinin şirkət rolunda olub-olmadığını yoxlayır
    useEffect(() => {
        if (!user.token || user.role !== 'company') {
            navigate('/auth'); // Şirkət deyilsə login səhifəsinə yönləndir
        }
    }, [user, navigate]);

    // Kateqoriyaları və iş elanının məlumatlarını yüklə
    useEffect(() => {
        const fetchJobData = async () => {
            try {
                setLoading(true);
                setError('');

                // Kateqoriyaları yüklə
                const categoriesRes = await axios.get('http://192.168.100.52:5000/api/categories');
                setCategories(categoriesRes.data.data);

                // İş elanının mövcud məlumatlarını yüklə
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const jobRes = await axios.get(`http://192.168.100.52:5000/api/jobs/${id}`, config);
                const jobData = jobRes.data.data;

                setFormData({
                    title: jobData.title || '',
                    description: jobData.description || '',
                    category: jobData.category?._id || '', // Kateqoriya ID-sini istifadə edin
                    location: jobData.location || '',
                    salaryRange: jobData.salaryRange || '',
                    jobType: jobData.jobType || 'Tam İş Günü',
                    experienceLevel: jobData.experienceLevel || 'Təcrübəsiz',
                    applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : new Date(),
                });

            } catch (err) {
                console.error('İş elanı və ya kateqoriyalar gətirilərkən xəta:', err.response?.data || err);
                setError(err.response?.data?.message || 'Məlumatlar yüklənərkən xəta baş verdi.');
            } finally {
                setLoading(false);
            }
        };

        if (user.token && user.role === 'company') {
            fetchJobData();
        }
    }, [id, user]); // id və user dəyişdikdə yenidən işə düşsün

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, applicationDeadline: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // Backend-ə göndərmədən əvvəl tarixi ISO formatına çeviririk
            const dataToSend = {
                ...formData,
                applicationDeadline: formData.applicationDeadline.toISOString(),
            };

            const res = await axios.put(`http://192.168.100.52:5000/api/jobs/${id}`, dataToSend, config);
            setMessage('İş elanı uğurla yeniləndi!');
            // Update the form data with the response data (if needed, to reflect server changes)
            setFormData({
                ...res.data.data,
                applicationDeadline: new Date(res.data.data.applicationDeadline),
                category: res.data.data.category?._id // Ensure category ID is set correctly after update
            });
            navigate('/company-dashboard'); // Uğurlu yeniləmədən sonra şirkət panelinə yönləndir
        } catch (err) {
            console.error('İş elanı yenilənərkən xəta:', err.response?.data);
            setError(err.response?.data?.message || 'İş elanı yenilənə bilmədi.');
        }
    };

    if (loading) {
        return <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-gray-50 text-blue-600">Məlumatlar yüklənir...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">İş Elanını Redaktə Et</h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {message && <p className="text-green-500 text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                        İşin Adı
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        İşin Təsviri
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                        Kateqoriya
                    </label>
                    <select
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Kateqoriya seçin</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                        Yerləşmə
                    </label>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="salaryRange" className="block text-gray-700 text-sm font-bold mb-2">
                        Maaş Aralığı
                    </label>
                    <input
                        type="text"
                        name="salaryRange"
                        id="salaryRange"
                        value={formData.salaryRange}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Məsələn: 800 - 1200 AZN"
                    />
                </div>
                <div>
                    <label htmlFor="jobType" className="block text-gray-700 text-sm font-bold mb-2">
                        İş Növü
                    </label>
                    <select
                        name="jobType"
                        id="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="Tam İş Günü">Tam İş Günü</option>
                        <option value="Yarı İş Günü">Yarı İş Günü</option>
                        <option value="Uzaqdan">Uzaqdan</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Müvəqqəti">Müvəqqəti</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="experienceLevel" className="block text-gray-700 text-sm font-bold mb-2">
                        Təcrübə Səviyyəsi
                    </label>
                    <select
                        name="experienceLevel"
                        id="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="Təcrübəsiz">Təcrübəsiz</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                        <option value="Müdir">Müdir</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="applicationDeadline" className="block text-gray-700 text-sm font-bold mb-2">
                        Müraciət Son Tarixi
                    </label>
                    <DatePicker
                        selected={formData.applicationDeadline}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        minDate={new Date()} // Keçmiş tarixləri seçməyi əngəllə
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full"
                >
                    İş Elanını Yenilə
                </button>
            </form>
        </div>
    );
};

export default EditJobPage;