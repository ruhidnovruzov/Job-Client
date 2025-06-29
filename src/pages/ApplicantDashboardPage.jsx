import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    Award,
    GraduationCap,
    Briefcase,
    Download,
    Edit3,
    Save,
    X,
    Plus,
    Trash2,
    Calendar,
    Building2,
    Target,
    Zap,
    FileText,
    Camera,
    Loader2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

const ApplicantDashboardPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedResumeFile, setSelectedResumeFile] = useState(null);
    const [selectedProfilePictureFile, setSelectedProfilePictureFile] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        category: '',
        yearsOfExperience: '',
        about: '',
        skills: [],
        education: [],
        experience: []
    });
    const [categories, setCategories] = useState([]);

    // Skill management
    const [newSkill, setNewSkill] = useState('');

    // Education management
    const [newEducation, setNewEducation] = useState({
        degree: '',
        major: '',
        fieldOfStudy: '',
        institution: '',
        startYear: '',
        endYear: ''
    });

    // Experience management
    const [newExperience, setNewExperience] = useState({
        jobTitle: '',
        companyName: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
    });

    useEffect(() => {
        if (!user.token || user.role !== 'applicant') {
            navigate('/');
            return;
        }
        fetchApplicantProfile();
        fetchCategories();
    }, [user, navigate]);

    const fetchApplicantProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const res = await axios.get('https://job-server-tcq9.onrender.com/api/applicants/me', config);
            setProfile(res.data.data);
            setEditFormData({
                firstName: res.data.data.firstName || '',
                lastName: res.data.data.lastName || '',
                phone: res.data.data.phone || '',
                category: res.data.data.category?._id || '',
                yearsOfExperience: res.data.data.yearsOfExperience || '',
                about: res.data.data.about || '',
                skills: res.data.data.skills || [],
                education: res.data.data.education || [],
                experience: res.data.data.experience || []
            });
        } catch (err) {
            console.error('Profil gətirilərkən xəta:', err.response?.data);
            setError(err.response?.data?.message || 'Profil yüklənərkən xəta baş verdi.');
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('https://job-server-tcq9.onrender.com/api/categories');
            setCategories(res.data.data);
        } catch (err) {
            console.error('Kateqoriyalar gətirilərkən xəta:', err);
        }
    };

    const handleResumeFileChange = (event) => {
        setSelectedResumeFile(event.target.files[0]);
    };

    const handleProfilePictureFileChange = (event) => {
        setSelectedProfilePictureFile(event.target.files[0]);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    // Skill management functions
    const addSkill = () => {
        if (newSkill.trim() && !editFormData.skills.includes(newSkill.trim())) {
            setEditFormData({
                ...editFormData,
                skills: [...editFormData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setEditFormData({
            ...editFormData,
            skills: editFormData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    // Education management functions
    const addEducation = () => {
        if (newEducation.degree && newEducation.institution) {
            setEditFormData({
                ...editFormData,
                education: [...editFormData.education, { ...newEducation }]
            });
            setNewEducation({
                degree: '',
                major: '',
                fieldOfStudy: '',
                institution: '',
                startYear: '',
                endYear: ''
            });
        }
    };

    const removeEducation = (index) => {
        setEditFormData({
            ...editFormData,
            education: editFormData.education.filter((_, i) => i !== index)
        });
    };

    // Experience management functions
    const addExperience = () => {
        if (newExperience.jobTitle && newExperience.companyName) {
            setEditFormData({
                ...editFormData,
                experience: [...editFormData.experience, { ...newExperience }]
            });
            setNewExperience({
                jobTitle: '',
                companyName: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                description: ''
            });
        }
    };

    const removeExperience = (index) => {
        setEditFormData({
            ...editFormData,
            experience: editFormData.experience.filter((_, i) => i !== index)
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const formData = new FormData();

            // Basic fields
            formData.append('firstName', editFormData.firstName);
            formData.append('lastName', editFormData.lastName);
            formData.append('phone', editFormData.phone);
            formData.append('category', editFormData.category);
            formData.append('yearsOfExperience', editFormData.yearsOfExperience);
            formData.append('about', editFormData.about);

            // Complex fields as JSON strings
            formData.append('skills', JSON.stringify(editFormData.skills));
            formData.append('education', JSON.stringify(editFormData.education));
            formData.append('experience', JSON.stringify(editFormData.experience));

            if (selectedResumeFile) {
                formData.append('resume', selectedResumeFile);
            }
            if (selectedProfilePictureFile) {
                formData.append('profilePicture', selectedProfilePictureFile);
            }

            const res = await axios.put('https://job-server-tcq9.onrender.com/api/applicants/profile', formData, config);
            setMessage(res.data.message);
            setProfile(res.data.data);
            setSelectedResumeFile(null);
            setSelectedProfilePictureFile(null);
            setIsEditMode(false);

            if (res.data.user) {
                login(res.data.user.token, res.data.user.role, res.data.user.displayName, res.data.user.profilePicture);
            }
        } catch (err) {
            console.error('Profil yenilənərkən xəta:', err.response?.data);
            setError(err.response?.data?.message || 'Profil yenilənə bilmədi.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="relative">
                            <Loader2 className="absolute -top-2 -right-2 w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil Yüklənir</h2>
                            <p className="text-gray-600">Məlumatlarınız hazırlanır...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (user.role !== 'applicant') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <AlertCircle className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Giriş İcazəsi Yoxdur</h2>
                            <p className="text-gray-600">Bu səhifəyə yalnız iş axtaranlar daxil ola bilər.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
    const profileImageUrl = profile?.profilePicture
        ? `https://job-server-tcq9.onrender.com${profile.profilePicture}`
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
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Profilim
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Profilinizi yeniləyin və karyera imkanlarınızı artırın
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <p className="text-green-700">{message}</p>
                        </div>
                    </div>
                )}

                <div className="max-w-6xl mx-auto">
                    {!isEditMode ? (
                        /* View Mode */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Sidebar */}
                            <div className="lg:col-span-1">
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
                                            <h2 className="text-2xl font-bold mb-2">
                                                {profile?.firstName} {profile?.lastName}
                                            </h2>
                                            <p className="text-blue-100 text-lg">
                                                {profile?.category?.name || 'Qeyd edilməyib'}
                                            </p>
                                            <div className="flex items-center justify-center space-x-2 mt-3">
                                                <Award className="w-4 h-4 text-blue-200" />
                                                <span className="text-blue-200 text-sm">
                                                    {profile?.yearsOfExperience || 0} il təcrübə
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
                                                    {profile?.userId?.email}
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
                                                    {profile?.phone || 'Qeyd edilməyib'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* CV Download */}
                                        {profile?.resume && (
                                            <div className="pt-4">
                                                <a
                                                    href={`https://job-server-tcq9.onrender.com${profile.resume}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    <span>CV-ni Yüklə</span>
                                                </a>
                                            </div>
                                        )}

                                        {/* Edit Button */}
                                        <div className="pt-4">
                                            <button
                                                onClick={() => setIsEditMode(true)}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                                <span>Profili Redaktə Et</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* About Section */}
                                {profile?.about && (
                                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                                            Haqqımda
                                        </h3>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {profile.about}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Skills Section */}
                                {profile?.skills && profile.skills.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-4"></div>
                                            Bacarıqlar
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {profile.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-medium border border-blue-200 flex items-center space-x-2"
                                                >
                                                    <Zap className="w-4 h-4" />
                                                    <span>{skill}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience Section */}
                                {profile?.experience && profile.experience.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4"></div>
                                            İş Təcrübəsi
                                        </h3>
                                        <div className="space-y-6">
                                            {profile.experience.map((exp, index) => (
                                                <div key={index} className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl border border-gray-200">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                                            <Briefcase className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xl font-bold text-gray-800 mb-1">
                                                                {exp.jobTitle}
                                                            </h4>
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
                                {profile?.education && profile.education.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
                                            Təhsil
                                        </h3>
                                        <div className="space-y-6">
                                            {profile.education.map((edu, index) => (
                                                <div key={index} className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl border border-gray-200">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                                            <GraduationCap className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xl font-bold text-gray-800 mb-1">
                                                                {edu.degree}
                                                            </h4>
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Building2 className="w-4 h-4 text-gray-500" />
                                                                <span className="text-gray-600 font-medium">{edu.institution}</span>
                                                            </div>
                                                            {edu.fieldOfStudy && (
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <Target className="w-4 h-4 text-gray-500" />
                                                                    <span className="text-gray-600">{edu.fieldOfStudy}</span>
                                                                </div>
                                                            )}
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
                    ) : (
                        /* Edit Mode */
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                                    Əsas Məlumatlar
                                </h3>

                                {/* Profile Picture Upload */}
                                <div className="flex flex-col items-center mb-8">
                                    <div className="relative mb-4">
                                        <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-gray-200 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={selectedProfilePictureFile ? URL.createObjectURL(selectedProfilePictureFile) : profileImageUrl}
                                                alt="Profil Şəkli"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <label htmlFor="profilePicture" className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                                            <Camera className="w-5 h-5 text-white" />
                                        </label>
                                    </div>
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        accept=".jpeg,.jpg,.png,.gif"
                                        onChange={handleProfilePictureFileChange}
                                        className="hidden"
                                    />
                                    <p className="text-sm text-gray-500 text-center">
                                        Profil şəklinizi yeniləmək üçün kamera ikonuna klikləyin
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editFormData.firstName}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editFormData.lastName}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editFormData.phone}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Təcrübə (il)</label>
                                        <input
                                            type="number"
                                            name="yearsOfExperience"
                                            value={editFormData.yearsOfExperience}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">İş Sahəsi</label>
                                        <select
                                            name="category"
                                            value={editFormData.category}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Haqqımda</label>
                                        <textarea
                                            name="about"
                                            value={editFormData.about}
                                            onChange={handleEditChange}
                                            rows="4"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Özünüz haqqında qısa məlumat..."
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CV Yüklə</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleResumeFileChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                        {selectedResumeFile && (
                                            <p className="text-sm text-gray-500 mt-2">Seçilən fayl: {selectedResumeFile.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-4"></div>
                                    Bacarıqlar
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Yeni bacarıq əlavə edin..."
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Əlavə Et</span>
                                        </button>
                                    </div>

                                    {editFormData.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {editFormData.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-2 group"
                                                >
                                                    <span>{skill}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="text-blue-600 hover:text-red-600 transition-colors duration-200"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Experience Section */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4"></div>
                                    İş Təcrübəsi
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Yeni Təcrübə Əlavə Et</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Vəzifə adı"
                                                value={newExperience.jobTitle}
                                                onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Şirkət adı"
                                                value={newExperience.companyName}
                                                onChange={(e) => setNewExperience({ ...newExperience, companyName: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="date"
                                                placeholder="Başlama tarixi"
                                                value={newExperience.startDate}
                                                onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="date"
                                                placeholder="Bitmə tarixi"
                                                value={newExperience.endDate}
                                                onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                                                disabled={newExperience.isCurrent}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                                            />
                                            <div className="md:col-span-2">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={newExperience.isCurrent}
                                                        onChange={(e) => setNewExperience({ ...newExperience, isCurrent: e.target.checked, endDate: e.target.checked ? '' : newExperience.endDate })}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Hazırda bu işdə çalışıram</span>
                                                </label>
                                            </div>
                                            <div className="md:col-span-2">
                                                <textarea
                                                    placeholder="İş təsviri (isteğe bağlı)"
                                                    value={newExperience.description}
                                                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                                    rows="3"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addExperience}
                                            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Təcrübə Əlavə Et</span>
                                        </button>
                                    </div>

                                    {editFormData.experience.length > 0 && (
                                        <div className="space-y-4">
                                            {editFormData.experience.map((exp, index) => (
                                                <div key={index} className="bg-purple-50 p-4 rounded-xl border border-purple-200 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-gray-800">{exp.jobTitle}</h5>
                                                        <p className="text-gray-600">{exp.companyName}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {exp.startDate} - {exp.isCurrent ? 'İndiki' : exp.endDate}
                                                        </p>
                                                        {exp.description && (
                                                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExperience(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-4"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Education Section */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
                                    Təhsil
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Yeni Təhsil Əlavə Et</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Dərəcə (Bakalavr, Magistr, və s.)"
                                                value={newEducation.degree}
                                                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Təhsil müəssisəsi"
                                                value={newEducation.institution}
                                                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="text"
                                                placeholder="İxtisas sahəsi"
                                                value={newEducation.fieldOfStudy}
                                                onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="text"
                                                placeholder="İxtisas (isteğe bağlı)"
                                                value={newEducation.major}
                                                onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Başlama ili"
                                                value={newEducation.startYear}
                                                onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Bitmə ili (isteğe bağlı)"
                                                value={newEducation.endYear}
                                                onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addEducation}
                                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Təhsil Əlavə Et</span>
                                        </button>
                                    </div>

                                    {editFormData.education.length > 0 && (
                                        <div className="space-y-4">
                                            {editFormData.education.map((edu, index) => (
                                                <div key={index} className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-gray-800">{edu.degree}</h5>
                                                        <p className="text-gray-600">{edu.institution}</p>
                                                        <p className="text-gray-600">{edu.fieldOfStudy}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {edu.startYear} - {edu.endYear || 'İndiki'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-4"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditMode(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2"
                                >
                                    <X className="w-5 h-5" />
                                    <span>Ləğv Et</span>
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>Profili Yadda Saxla</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicantDashboardPage;