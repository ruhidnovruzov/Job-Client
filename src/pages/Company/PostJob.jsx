import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Award, 
  Calendar, 
  FileText, 
  Tag, 
  AlertCircle, 
  Loader2, 
  CheckCircle,
  ArrowLeft,
  Briefcase,
  Users,
  Target
} from 'lucide-react';

const PostJobPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        salaryRange: 'Müzakirə yolu ilə',
        jobType: 'Tam İş Günü',
        experienceLevel: 'Təcrübəsiz',
        applicationDeadline: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.token || user.role !== 'company') {
            navigate('/');
            return;
        }
        fetchCategories();
    }, [user, navigate]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://192.168.100.52:5000/api/categories');
            setCategories(res.data.data);
            if (res.data.data.length > 0) {
                setFormData((prev) => ({ ...prev, category: res.data.data[0]._id }));
            }
        } catch (err) {
            console.error('Kateqoriyalar gətirilərkən xəta:', err);
            setError('Kateqoriyalar yüklənərkən xəta baş verdi.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const deadlineDate = new Date(formData.applicationDeadline);
        if (isNaN(deadlineDate.getTime())) {
            setError('Zəhmət olmasa etibarlı müraciət son tarixi daxil edin.');
            return;
        }

        try {
            setSubmitting(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(
                'http://192.168.100.52:5000/api/jobs',
                { ...formData, applicationDeadline: deadlineDate.toISOString() },
                config
            );
            setMessage('İş elanı uğurla yerləşdirildi!');
            setFormData({
                title: '',
                description: '',
                category: categories.length > 0 ? categories[0]._id : '',
                location: '',
                salaryRange: 'Müzakirə yolu ilə',
                jobType: 'Tam İş Günü',
                experienceLevel: 'Təcrübəsiz',
                applicationDeadline: '',
            });
            
            // Success message göstərdikdən sonra yönləndir
            setTimeout(() => {
                navigate('/company-dashboard');
            }, 2000);
        } catch (err) {
            console.error('İş elanı yerləşdirilərkən xəta:', err.response?.data);
            setError(err.response?.data?.message || 'İş elanı yerləşdirilə bilmədi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                <Plus className="w-10 h-10 text-white" />
                            </div>
                            <Loader2 className="absolute -top-2 -right-2 w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Kateqoriyalar Yüklənir</h2>
                            <p className="text-gray-600">Məlumatlar hazırlanır...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (user.role !== 'company') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <AlertCircle className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center max-w-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Giriş İcazəsi Yoxdur</h2>
                            <p className="text-gray-600 mb-6">Bu səhifəyə yalnız şirkətlər daxil ola bilər.</p>
                            <Link 
                                to="/"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Ana Səhifəyə Qayıt
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-transparent"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/20 rounded-full blur-lg"></div>
                    <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-300/15 rounded-full blur-2xl"></div>
                </div>

                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="text-center text-white space-y-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                <Plus className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent leading-tight">
                            Yeni İş Elanı
                        </h1>
                        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                            Mükəmməl namizədləri tapmaq üçün ətraflı iş elanı yaradın
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-green-200">
                            <Target className="w-5 h-5" />
                            <span className="text-lg">Doğru namizədi cəlb edin</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 relative -mt-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link 
                        to="/company-dashboard"
                        className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Şirkət Panelinə Qayıt</span>
                    </Link>
                </div>

                {/* Main Form */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <Briefcase className="w-6 h-6 mr-3 text-green-600" />
                                İş Elanı Məlumatları
                            </h2>
                            <p className="text-gray-600 mt-2">Bütün sahələri diqqətlə doldurun ki, uyğun namizədlər sizə müraciət etsin</p>
                        </div>

                        <div className="p-8">
                            {/* Success/Error Messages */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            {message && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <p className="text-green-700 font-medium">{message}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Job Title */}
                                <div className="space-y-2">
                                    <label htmlFor="title" className="flex items-center text-gray-700 text-sm font-bold">
                                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                        İş Elanının Adı
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Məsələn: Frontend Developer, Satış Meneceri..."
                                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label htmlFor="description" className="flex items-center text-gray-700 text-sm font-bold">
                                        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                                        İş Təsviri
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="İşin ətraflı təsvirini yazın: vəzifələr, tələblər, şirkət haqqında məlumat..."
                                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md resize-none"
                                        required
                                    ></textarea>
                                </div>

                                {/* Two Column Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category */}
                                    <div className="space-y-2">
                                        <label htmlFor="category" className="flex items-center text-gray-700 text-sm font-bold">
                                            <Tag className="w-4 h-4 mr-2 text-purple-600" />
                                            Kateqoriya
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                id="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                                                required
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label htmlFor="location" className="flex items-center text-gray-700 text-sm font-bold">
                                            <MapPin className="w-4 h-4 mr-2 text-red-600" />
                                            İş Yeri
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Məsələn: Bakı, Gəncə, Uzaqdan iş..."
                                            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Three Column Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Salary Range */}
                                    <div className="space-y-2">
                                        <label htmlFor="salaryRange" className="flex items-center text-gray-700 text-sm font-bold">
                                            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                                            Əmək Haqqı
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="salaryRange"
                                                id="salaryRange"
                                                value={formData.salaryRange}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                                            >
                                                <option value="Müzakirə yolu ilə">Müzakirə yolu ilə</option>
                                                <option value="1-500 AZN">1-500 AZN</option>
                                                <option value="501-1000 AZN">501-1000 AZN</option>
                                                <option value="1001-2000 AZN">1001-2000 AZN</option>
                                                <option value="2001-3000 AZN">2001-3000 AZN</option>
                                                <option value="3000+ AZN">3000+ AZN</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Type */}
                                    <div className="space-y-2">
                                        <label htmlFor="jobType" className="flex items-center text-gray-700 text-sm font-bold">
                                            <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                            İş Tipi
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="jobType"
                                                id="jobType"
                                                value={formData.jobType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                                            >
                                                <option value="Tam İş Günü">Tam İş Günü</option>
                                                <option value="Yarım İş Günü">Yarım İş Günü</option>
                                                <option value="Freelance">Freelance</option>
                                                <option value="Müvəqqəti">Müvəqqəti</option>
                                                <option value="Praktika">Praktika</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experience Level */}
                                    <div className="space-y-2">
                                        <label htmlFor="experienceLevel" className="flex items-center text-gray-700 text-sm font-bold">
                                            <Award className="w-4 h-4 mr-2 text-orange-600" />
                                            Təcrübə Səviyyəsi
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="experienceLevel"
                                                id="experienceLevel"
                                                value={formData.experienceLevel}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                                            >
                                                <option value="Təcrübəsiz">Təcrübəsiz</option>
                                                <option value="Junior">Junior</option>
                                                <option value="Mid-Level">Mid-Level</option>
                                                <option value="Senior">Senior</option>
                                                <option value="Lead">Lead</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Application Deadline */}
                                <div className="space-y-2">
                                    <label htmlFor="applicationDeadline" className="flex items-center text-gray-700 text-sm font-bold">
                                        <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                                        Müraciət Son Tarixi
                                    </label>
                                    <input
                                        type="date"
                                        name="applicationDeadline"
                                        id="applicationDeadline"
                                        value={formData.applicationDeadline}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                                            submitting
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                                        }`}
                                    >
                                        {submitting ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Elan Yerləşdirilir...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Plus className="w-5 h-5" />
                                                <span>İş Elanını Yerləşdir</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
                            Uğurlu İş Elanı Üçün Məsləhətlər
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Target className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Aydın və Cəlbedici Başlıq</h4>
                                        <p className="text-gray-600 text-sm">İş elanının adını konkret və aydın yazın ki, namizədlər asanlıqla anlasın.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Ətraflı Təsvir</h4>
                                        <p className="text-gray-600 text-sm">İşin vəzifələrini, tələbləri və şirkət haqqında məlumatı ətraflı yazın.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Şəffaf Maaş Məlumatı</h4>
                                        <p className="text-gray-600 text-sm">Mümkünsə maaş aralığını qeyd edin ki, uyğun namizədlər müraciət etsin.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Şirkət Mədəniyyəti</h4>
                                        <p className="text-gray-600 text-sm">Şirkətinizin dəyərləri və iş mühiti haqqında məlumat əlavə edin.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJobPage;