import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Mail,
    Phone,
    Award,
    GraduationCap,
    Briefcase,
    Download,
    ArrowLeft,
    Calendar,
    MapPin,
    Star,
    FileText,
    AlertCircle,
    Loader2,
    Building2,
    Clock,
    Target,
    Zap
} from 'lucide-react';

const ApplicantDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplicantDetails = async () => {
            if (!user.token) {
                setError("Zəhmət olmasa daxil olun. Profilə baxmaq üçün giriş tələb olunur.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const res = await axios.get(`https://job-server-tcq9.onrender.com/api/applicants/${id}`, config);
                setApplicant(res.data);
            } catch (err) {
                console.error("Namizəd detalları gətirilərkən xəta:", err.response?.data || err);
                setError(err.response?.data?.message || 'Namizəd profili yüklənə bilmədi.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicantDetails();
    }, [id, user.token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <Loader2 className="absolute -top-2 -right-2 w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil Yüklənir</h2>
                            <p className="text-gray-600">Namizəd məlumatları hazırlanır...</p>
                        </div>
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
                                to="/auth"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Daxil Ol
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!applicant) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil Tapılmadı</h2>
                            <p className="text-gray-600 mb-6">Axtardığınız namizəd profili mövcud deyil və ya silinib.</p>
                            <Link
                                to="/applicants"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Namizədlərə Qayıt
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
    const profileImageUrl = applicant.profilePicture
        ? `https://job-server-tcq9.onrender.com${applicant.profilePicture}`
        : defaultProfilePicture;

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
                        to="/applicants"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Namizədlərə Qayıt</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Profile Sidebar */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Profile Card */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden sticky top-24">
                                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                                    <div className="relative z-10 text-center">
                                        <div className="relative inline-block mb-4">
                                            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 flex items-center justify-center overflow-hidden mx-auto">
                                                <img
                                                    src={profileImageUrl}
                                                    alt="Profil Şəkli"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <h1 className="text-2xl font-bold mb-2">
                                            {applicant.firstName} {applicant.lastName}
                                        </h1>
                                        <p className="text-blue-100 text-lg">
                                            {applicant.category?.name || 'Qeyd edilməyib'}
                                        </p>
                                        <div className="flex items-center justify-center space-x-2 mt-3">
                                            <Award className="w-4 h-4 text-blue-200" />
                                            <span className="text-blue-200 text-sm">
                                                {applicant.yearsOfExperience} il təcrübə
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {applicant.userId?.email || 'Mövcud deyil'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-500">Telefon</p>
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {applicant.phone || 'Qeyd edilməyib'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CV Download Button */}
                                    {applicant.resume && (
                                        <div className="pt-4">
                                            <a
                                                href={`https://job-server-tcq9.onrender.com${applicant.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                            >
                                                <Download className="w-5 h-5" />
                                                <span>CV-ni Yüklə</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* About Section */}
                            {applicant.about && (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                                        Haqqında
                                    </h2>
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {applicant.about}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Skills Section */}
                            {applicant.skills && applicant.skills.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-4"></div>
                                        Bacarıqlar
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {applicant.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="group bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-medium border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 hover:scale-105 cursor-default flex items-center space-x-2"
                                            >
                                                <Zap className="w-4 h-4" />
                                                <span>{skill}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience Section */}
                            {applicant.experience && applicant.experience.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4"></div>
                                        İş Təcrübəsi
                                    </h2>
                                    <div className="space-y-6">
                                        {applicant.experience.map((exp, index) => (
                                            <div key={index} className="group relative bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                                        <Briefcase className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                                                            {exp.jobTitle}
                                                        </h3>
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Building2 className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-600 font-medium">{exp.companyName}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(exp.startDate).toLocaleDateString('az-AZ')} - {exp.isCurrent ? 'İndiki' : new Date(exp.endDate).toLocaleDateString('az-AZ')}
                                                            </span>
                                                            {exp.isCurrent && (
                                                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                                                    Hazırda
                                                                </span>
                                                            )}
                                                        </div>
                                                        {exp.description && (
                                                            <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education Section */}
                            {applicant.education && applicant.education.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
                                        Təhsil
                                    </h2>
                                    <div className="space-y-6">
                                        {applicant.education.map((edu, index) => (
                                            <div key={index} className="group relative bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-300">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                                        <GraduationCap className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-200">
                                                            {edu.degree}
                                                        </h3>
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Building2 className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-600 font-medium">{edu.institution}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Target className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-600">{edu.fieldOfStudy}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm text-gray-500">
                                                                {edu.startYear} - {edu.endYear || 'İndiki'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantDetailPage;