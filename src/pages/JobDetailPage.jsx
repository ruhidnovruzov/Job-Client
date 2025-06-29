import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Building2,
    MapPin,
    DollarSign,
    Clock,
    Award,
    Calendar,
    Globe,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowLeft,
    ExternalLink,
    Users,
    Briefcase,
    Tag
} from 'lucide-react';

const JobDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applyMessage, setApplyMessage] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError('');
                const config = {
                    headers: {
                        Authorization: user.token ? `Bearer ${user.token}` : undefined,
                    },
                };
                const res = await axios.get(`https://job-server-tcq9.onrender.com/api/jobs/${id}`, config);
                setJob(res.data.data);
            } catch (err) {
                console.error('İş elanı gətirilərkən xəta:', err.response?.data || err);
                setError(err.response?.data?.message || 'İş elanı yüklənə bilmədi.');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, user.token]);

    const handleApply = async () => {
        if (!user || !user.token) {
            setApplyMessage('Zəhmət olmasa müraciət etmək üçün daxil olun.');
            return;
        }
        if (user.role !== 'applicant') {
            setApplyMessage('Yalnız iş axtaranlar müraciət edə bilərlər.');
            return;
        }

        try {
            setIsApplying(true);
            setApplyMessage('');
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const res = await axios.post(`https://job-server-tcq9.onrender.com/api/jobs/${id}/apply`, {}, config);
            setApplyMessage(res.data.message);
        } catch (err) {
            console.error('Müraciət edilərkən xəta:', err.response?.data);
            setApplyMessage(err.response?.data?.message || 'Müraciət edilə bilmədi.');
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                        <p className="text-xl font-semibold text-gray-700">Məlumatlar yüklənir...</p>
                        <p className="text-sm text-gray-500 mt-2">Zəhmət olmasa gözləyin</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <AlertCircle className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center max-w-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Xəta Baş Verdi</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
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

    if (!job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                            <Briefcase className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">İş Elanı Tapılmadı</h2>
                            <p className="text-gray-600 mb-6">Axtardığınız iş elanı mövcud deyil və ya silinib.</p>
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

    const defaultCompanyLogo = 'https://via.placeholder.com/150';
    const companyLogoUrl = job.company?.logoUrl && job.company.logoUrl !== defaultCompanyLogo
        ? `https://job-server-tcq9.onrender.com${job.company.logoUrl}`
        : defaultCompanyLogo;

    const hasApplied = job.applicants?.some(applicant => applicant.user === user?.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Geri Qayıt</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Job Details */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Job Header */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-start space-x-6 mb-6">
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={companyLogoUrl}
                                                        alt={`${job.company?.companyName || 'Şirkət'} Logosu`}
                                                        className="w-16 h-16 object-contain"
                                                    />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
                                                    {job.title}
                                                </h1>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Building2 className="w-5 h-5 text-blue-200" />
                                                    <span className="text-xl text-blue-100 font-medium">
                                                        {job.company?.companyName || 'Naməlum Şirkət'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Tag className="w-4 h-4 text-blue-200" />
                                                    <span className="text-blue-200">
                                                        {job.category?.name || 'Naməlum Kateqoriya'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Info Tags */}
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm font-medium">{job.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm font-medium">{job.jobType}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                                <Award className="w-4 h-4" />
                                                <span className="text-sm font-medium">{job.experienceLevel}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Apply Message */}
                                {applyMessage && (
                                    <div className={`p-4 border-l-4 ${applyMessage.includes('uğurla')
                                        ? 'bg-green-50 border-green-400 text-green-700'
                                        : 'bg-red-50 border-red-400 text-red-700'
                                        }`}>
                                        <div className="flex items-center space-x-2">
                                            {applyMessage.includes('uğurla') ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5" />
                                            )}
                                            <span className="font-medium">{applyMessage}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Job Description */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                                    İşin Təsviri
                                </h2>
                                <div className="prose prose-lg max-w-none">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                        <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Company Information */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-4"></div>
                                    Şirkət Haqqında
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">Şirkət Ünvanı</h3>
                                            <p className="text-gray-600">{job.company?.address || 'Qeyd edilməyib'}</p>
                                        </div>
                                    </div>

                                    {job.company?.website && (
                                        <div className="flex items-start space-x-4">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Globe className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 mb-1">Vebsayt</h3>
                                                <a
                                                    href={job.company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-1 group"
                                                >
                                                    <span>{job.company.website}</span>
                                                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">Şirkət Haqqında</h3>
                                            <p className="text-gray-600">{job.company?.description || 'Qeyd edilməyib'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Job Details Card */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
                                    İş Detalları
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Maaş Aralığı</p>
                                            <p className="font-semibold text-gray-800">{job.salaryRange || 'Qeyd edilməyib'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">İş Növü</p>
                                            <p className="font-semibold text-gray-800">{job.jobType}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Award className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Təcrübə Səviyyəsi</p>
                                            <p className="font-semibold text-gray-800">{job.experienceLevel}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Son Müraciət Tarixi</p>
                                            <p className="font-semibold text-gray-800">
                                                {new Date(job.applicationDeadline).toLocaleDateString('az-AZ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <div className="mt-8">
                                    {user && user.role === 'applicant' && (
                                        <button
                                            onClick={handleApply}
                                            disabled={hasApplied || isApplying}
                                            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${hasApplied
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : isApplying
                                                    ? 'bg-blue-400 text-white cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                                }`}
                                        >
                                            {isApplying ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Müraciət Edilir...</span>
                                                </div>
                                            ) : hasApplied ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>Müraciət Edilib</span>
                                                </div>
                                            ) : (
                                                'Bu İşə Müraciət Et'
                                            )}
                                        </button>
                                    )}

                                    {(!user || !user.token) && (
                                        <div className="text-center">
                                            <p className="text-gray-600 mb-4">Müraciət etmək üçün daxil olun</p>
                                            <Link
                                                to="/auth"
                                                className="w-full inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                                            >
                                                Daxil Ol / Qeydiyyat
                                            </Link>
                                        </div>
                                    )}

                                    {user && user.role === 'company' && (
                                        <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                            <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                            <p className="text-yellow-700 font-medium">
                                                Siz şirkət olaraq bu işə müraciət edə bilməzsiniz.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;