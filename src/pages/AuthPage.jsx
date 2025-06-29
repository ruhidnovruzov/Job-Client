import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Mail,
    Lock,
    Building2,
    Phone,
    Calendar,
    Globe,
    MapPin,
    Briefcase,
    Award,
    FileText,
    Users,
    AlertCircle,
    CheckCircle,
    Loader2,
    Eye,
    EyeOff,
    ArrowRight,
    UserPlus,
    LogIn,
    Tag,
    Clock,
    ArrowLeft,
    KeyRound
} from 'lucide-react';

const AuthPage = () => {
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot-password'
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'applicant',
        // Applicant fields
        firstName: '',
        lastName: '',
        phone: '',
        category: '',
        yearsOfExperience: '',
        about: '',
        // Company fields
        companyName: '',
        industry: '',
        description: '',
        address: '',
        website: '',
        companyPhone: '',
        establishedYear: '',
    });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const isRegister = authMode === 'register';
    const isForgotPassword = authMode === 'forgot-password';

    useEffect(() => {
        if (isRegister && formData.role === 'applicant') {
            fetchCategories();
        }
    }, [isRegister, formData.role]);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await axios.get('https://job-server-tcq9.onrender.com/api/categories');
            setCategories(res.data.data);
            if (res.data.data.length > 0) {
                setFormData((prev) => ({ ...prev, category: res.data.data[0]._id }));
            } else {
                setFormData((prev) => ({ ...prev, category: '' }));
            }
        } catch (err) {
            console.error('Kateqoriyalar gətirilərkən xəta:', err);
            setError('Kateqoriyalar yüklənərkən xəta baş verdi.');
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setSubmitting(true);

        try {
            const res = await axios.post('https://job-server-tcq9.onrender.com/api/auth/forgot-password', {
                email: forgotPasswordEmail
            });

            setMessage(res.data.message);
            setForgotPasswordEmail('');
        } catch (err) {
            console.error('Şifrə sıfırlama xətası:', err.response?.data);
            setError(err.response?.data?.message || 'Bir xəta baş verdi.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setSubmitting(true);

        try {
            if (isRegister) {
                if (formData.role === 'applicant' && !formData.category) {
                    setError('İş sahəsi mütləqdir.');
                    return;
                }

                const res = await axios.post('https://job-server-tcq9.onrender.com/api/auth/register', formData);
                setMessage(res.data.message + " İndi daxil ola bilərsiniz.");
                setAuthMode('login');
            } else {
                const res = await axios.post('https://job-server-tcq9.onrender.com/api/auth/login', {
                    email: formData.email,
                    password: formData.password,
                });
                login(res.data.token, res.data.role, res.data.displayName);
                navigate('/');
            }
        } catch (err) {
            console.error('Auth Xətası:', err.response?.data);
            setError(err.response?.data?.message || 'Bir xəta baş verdi.');
        } finally {
            setSubmitting(false);
        }
    };

    const switchAuthMode = (mode) => {
        setAuthMode(mode);
        setError('');
        setMessage('');
        setForgotPasswordEmail('');
    };

    const getHeaderInfo = () => {
        switch (authMode) {
            case 'register':
                return {
                    icon: <UserPlus className="w-8 h-8 text-white" />,
                    title: 'Qeydiyyat',
                    subtitle: 'Karyeranızı inkişaf etdirmək üçün bizə qoşulun'
                };
            case 'forgot-password':
                return {
                    icon: <KeyRound className="w-8 h-8 text-white" />,
                    title: 'Şifrəni Unutdum',
                    subtitle: 'Email ünvanınızı daxil edin və şifrə sıfırlama linki alın'
                };
            default:
                return {
                    icon: <LogIn className="w-8 h-8 text-white" />,
                    title: 'Daxil Ol',
                    subtitle: 'Hesabınıza daxil olun və iş imkanlarını kəşf edin'
                };
        }
    };

    const headerInfo = getHeaderInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-transparent"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
                    <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300/15 rounded-full blur-2xl"></div>
                </div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="text-center text-white space-y-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                {headerInfo.icon}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
                            {headerInfo.title}
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            {headerInfo.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 relative -mt-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                        {authMode === 'register' && (
                                            <>
                                                <UserPlus className="w-6 h-6 mr-3 text-blue-600" />
                                                Hesab Yaradın
                                            </>
                                        )}
                                        {authMode === 'login' && (
                                            <>
                                                <LogIn className="w-6 h-6 mr-3 text-indigo-600" />
                                                Hesabınıza Daxil Olun
                                            </>
                                        )}
                                        {authMode === 'forgot-password' && (
                                            <>
                                                <KeyRound className="w-6 h-6 mr-3 text-orange-600" />
                                                Şifrəni Sıfırla
                                            </>
                                        )}
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        {authMode === 'register' && 'Bütün sahələri diqqətlə doldurun'}
                                        {authMode === 'login' && 'Email və parolunuzu daxil edin'}
                                        {authMode === 'forgot-password' && 'Email ünvanınızı daxil edin'}
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span>Təhlükəsiz giriş</span>
                                </div>
                            </div>
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

                            {/* Forgot Password Form */}
                            {isForgotPassword && (
                                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="forgotEmail" className="flex items-center text-gray-700 text-sm font-bold">
                                            <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                            Email Ünvanı
                                        </label>
                                        <input
                                            type="email"
                                            id="forgotEmail"
                                            value={forgotPasswordEmail}
                                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Bu email ünvanına şifrə sıfırlama linki göndəriləcək.
                                        </p>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${submitting
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
                                                }`}
                                        >
                                            {submitting ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Göndərilir...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <KeyRound className="w-5 h-5" />
                                                    <span>Sıfırlama Linki Göndər</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Login/Register Form */}
                            {!isForgotPassword && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="flex items-center text-gray-700 text-sm font-bold">
                                            <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                            Email Ünvanı
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@email.com"
                                            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="flex items-center text-gray-700 text-sm font-bold">
                                            <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                                            Parol
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                id="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Güclü parol daxil edin"
                                                className="w-full px-4 py-4 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {!isRegister && (
                                            <div className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => switchAuthMode('forgot-password')}
                                                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    Şifrəni unutmusunuz?
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Registration Fields */}
                                    {isRegister && (
                                        <>
                                            {/* Role Selection */}
                                            <div className="space-y-2">
                                                <label htmlFor="role" className="flex items-center text-gray-700 text-sm font-bold">
                                                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                                                    Hesab Növü
                                                </label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, role: 'applicant' })}
                                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${formData.role === 'applicant'
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <User className="w-6 h-6 mx-auto mb-2" />
                                                        <span className="font-medium">İş Axtaran</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, role: 'company' })}
                                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${formData.role === 'company'
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <Building2 className="w-6 h-6 mx-auto mb-2" />
                                                        <span className="font-medium">Şirkət</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Applicant Fields */}
                                            {formData.role === 'applicant' && (
                                                <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
                                                        Şəxsi Məlumatlar
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label htmlFor="firstName" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <User className="w-4 h-4 mr-2 text-blue-600" />
                                                                Ad
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="firstName"
                                                                id="firstName"
                                                                value={formData.firstName}
                                                                onChange={handleChange}
                                                                placeholder="Adınız"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor="lastName" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <User className="w-4 h-4 mr-2 text-blue-600" />
                                                                Soyad
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="lastName"
                                                                id="lastName"
                                                                value={formData.lastName}
                                                                onChange={handleChange}
                                                                placeholder="Soyadınız"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label htmlFor="phone" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <Phone className="w-4 h-4 mr-2 text-green-600" />
                                                                Telefon
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                id="phone"
                                                                value={formData.phone}
                                                                onChange={handleChange}
                                                                placeholder="+994 XX XXX XX XX"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor="yearsOfExperience" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <Clock className="w-4 h-4 mr-2 text-orange-600" />
                                                                Təcrübə (il)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="yearsOfExperience"
                                                                id="yearsOfExperience"
                                                                value={formData.yearsOfExperience}
                                                                onChange={handleChange}
                                                                placeholder="0"
                                                                min="0"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label htmlFor="category" className="flex items-center text-gray-700 text-sm font-bold">
                                                            <Tag className="w-4 h-4 mr-2 text-purple-600" />
                                                            İş Sahəsi
                                                        </label>
                                                        {loadingCategories ? (
                                                            <div className="flex items-center space-x-2 text-gray-500">
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                <span>Kateqoriyalar yüklənir...</span>
                                                            </div>
                                                        ) : categories.length > 0 ? (
                                                            <div className="relative">
                                                                <select
                                                                    name="category"
                                                                    id="category"
                                                                    value={formData.category}
                                                                    onChange={handleChange}
                                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 appearance-none cursor-pointer"
                                                                    required
                                                                >
                                                                    {categories.map((cat) => (
                                                                        <option key={cat._id} value={cat._id}>
                                                                            {cat.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                                <p className="text-red-600 text-sm">Heç bir kateqoriya tapılmadı. Admin tərəfindən kateqoriya əlavə edilməlidir.</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label htmlFor="about" className="flex items-center text-gray-700 text-sm font-bold">
                                                            <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                                                            Özünüz Haqqında
                                                        </label>
                                                        <textarea
                                                            name="about"
                                                            id="about"
                                                            value={formData.about}
                                                            onChange={handleChange}
                                                            rows="3"
                                                            placeholder="Özünüz, bacarıqlarınız və məqsədləriniz haqqında qısa məlumat..."
                                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Company Fields */}
                                            {formData.role === 'company' && (
                                                <div className="space-y-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                        <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
                                                        Şirkət Məlumatları
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label htmlFor="companyName" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                                                                Şirkət Adı
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="companyName"
                                                                id="companyName"
                                                                value={formData.companyName}
                                                                onChange={handleChange}
                                                                placeholder="Şirkətinizin adı"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor="industry" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                                                                Sənaye Sahəsi
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="industry"
                                                                id="industry"
                                                                value={formData.industry}
                                                                onChange={handleChange}
                                                                placeholder="Məsələn: IT, Maliyyə, Təhsil"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label htmlFor="companyPhone" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <Phone className="w-4 h-4 mr-2 text-green-600" />
                                                                Şirkət Telefonu
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                name="companyPhone"
                                                                id="companyPhone"
                                                                value={formData.companyPhone}
                                                                onChange={handleChange}
                                                                placeholder="+994 XX XXX XX XX"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor="establishedYear" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                                                                Təsis İli
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="establishedYear"
                                                                id="establishedYear"
                                                                value={formData.establishedYear}
                                                                onChange={handleChange}
                                                                placeholder="2020"
                                                                min="1900"
                                                                max={new Date().getFullYear()}
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label htmlFor="website" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <Globe className="w-4 h-4 mr-2 text-blue-600" />
                                                                Vebsayt
                                                            </label>
                                                            <input
                                                                type="url"
                                                                name="website"
                                                                id="website"
                                                                value={formData.website}
                                                                onChange={handleChange}
                                                                placeholder="https://example.com"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor="address" className="flex items-center text-gray-700 text-sm font-bold">
                                                                <MapPin className="w-4 h-4 mr-2 text-red-600" />
                                                                Ünvan
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                id="address"
                                                                value={formData.address}
                                                                onChange={handleChange}
                                                                placeholder="Şirkət ünvanı"
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label htmlFor="description" className="flex items-center text-gray-700 text-sm font-bold">
                                                            <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                                                            Şirkət Haqqında
                                                        </label>
                                                        <textarea
                                                            name="description"
                                                            id="description"
                                                            value={formData.description}
                                                            onChange={handleChange}
                                                            rows="3"
                                                            placeholder="Şirkətinizin fəaliyyəti, dəyərləri və məqsədləri haqqında məlumat..."
                                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${submitting
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : isRegister
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                                                }`}
                                        >
                                            {submitting ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>{isRegister ? 'Qeydiyyat edilir...' : 'Daxil olunur...'}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    {isRegister ? (
                                                        <>
                                                            <UserPlus className="w-5 h-5" />
                                                            <span>Qeydiyyatdan Keç</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LogIn className="w-5 h-5" />
                                                            <span>Daxil Ol</span>
                                                        </>
                                                    )}
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Navigation Links */}
                            <div className="mt-8 text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">və ya</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {isForgotPassword ? (
                                        <button
                                            type="button"
                                            onClick={() => switchAuthMode('login')}
                                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group flex items-center justify-center mx-auto"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                                            Giriş səhifəsinə qayıt
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => switchAuthMode(isRegister ? 'login' : 'register')}
                                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
                                            >
                                                {isRegister
                                                    ? 'Hesabınız var? Daxil olun'
                                                    : 'Hesabınız yoxdur? Qeydiyyatdan keçin'
                                                }
                                                <ArrowRight className="w-4 h-4 inline-block ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Back to Home */}
                            <div className="mt-6 text-center">
                                <Link
                                    to="/"
                                    className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
                                >
                                    ← Ana səhifəyə qayıt
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;