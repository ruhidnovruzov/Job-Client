import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Loader2,
    Shield,
    ArrowLeft,
    Key
} from 'lucide-react';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);

    useEffect(() => {
        // Token mövcudluğunu yoxlayırıq
        if (!token) {
            setError('Şifrə sıfırlama tokeni tapılmadı.');
            setTokenValid(false);
        } else {
            setTokenValid(true);
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation
        if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
            const password = name === 'password' ? value : formData.password;
            const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;

            if (confirmPassword && password !== confirmPassword) {
                setError('Şifrələr uyğun gəlmir.');
            } else {
                setError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (formData.password.length < 6) {
            setError('Şifrə ən azı 6 simvol olmalıdır.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Şifrələr uyğun gəlmir.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `https://job-server-tcq9.onrender.com/api/auth/reset-password/${token}`,
                { password: formData.password }
            );

            if (response.data.success) {
                setSuccess(true);
                // 3 saniyə sonra login səhifəsinə yönləndir
                setTimeout(() => {
                    navigate('/auth');
                }, 3000);
            }
        } catch (err) {
            console.error('Şifrə sıfırlama xətası:', err);
            setError(
                err.response?.data?.message ||
                'Şifrə sıfırlanarkən xəta baş verdi. Token vaxtı keçmiş ola bilər.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: '', color: '' };

        let strength = 0;
        let text = '';
        let color = '';

        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        switch (strength) {
            case 0:
            case 1:
                text = 'Çox zəif';
                color = 'bg-red-500';
                break;
            case 2:
                text = 'Zəif';
                color = 'bg-orange-500';
                break;
            case 3:
                text = 'Orta';
                color = 'bg-yellow-500';
                break;
            case 4:
                text = 'Güclü';
                color = 'bg-blue-500';
                break;
            case 5:
                text = 'Çox güclü';
                color = 'bg-green-500';
                break;
            default:
                text = '';
                color = '';
        }

        return { strength, text, color };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    if (tokenValid === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6 text-center">
                        <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white">Xəta</h1>
                    </div>
                    <div className="p-8 text-center">
                        <p className="text-gray-600 mb-6">
                            {error || 'Şifrə sıfırlama tokeni tapılmadı və ya yanlışdır.'}
                        </p>
                        <Link
                            to="/auth"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Giriş səhifəsinə qayıt
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-center">
                        <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white">Uğurlu!</h1>
                    </div>
                    <div className="p-8 text-center">
                        <p className="text-gray-600 mb-6">
                            Şifrəniz uğurla yeniləndi. İndi yeni şifrənizlə daxil ola bilərsiniz.
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>3 saniyə sonra giriş səhifəsinə yönləndiriləcəksiniz...</span>
                        </div>
                        <Link
                            to="/auth"
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 mt-4"
                        >
                            İndi daxil ol
                        </Link>
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
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-transparent"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
                    <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-300/15 rounded-full blur-2xl"></div>
                </div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="text-center text-white space-y-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                <Key className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
                            Şifrəni Sıfırla
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Yeni güclü şifrə təyin edin və hesabınızı təhlükəsiz saxlayın
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 relative -mt-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Yeni Şifrə Təyin Et
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    Güclü və yadda qalan şifrə seçin
                                </p>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="flex items-center text-gray-700 text-sm font-bold">
                                        <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                                        Yeni Şifrə
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Yeni şifrənizi daxil edin"
                                            className="w-full px-4 py-4 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
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

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Şifrə gücü:</span>
                                                <span className={`font-medium ${passwordStrength.strength <= 2 ? 'text-red-600' :
                                                    passwordStrength.strength <= 3 ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    }`}>
                                                    {passwordStrength.text}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="flex items-center text-gray-700 text-sm font-bold">
                                        <Lock className="w-4 h-4 mr-2 text-purple-600" />
                                        Şifrəni Təkrarla
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Şifrəni təkrar daxil edin"
                                            className="w-full px-4 py-4 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {formData.confirmPassword && (
                                        <div className="flex items-center space-x-2 text-xs">
                                            {formData.password === formData.confirmPassword ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-green-600">Şifrələr uyğundur</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                    <span className="text-red-600">Şifrələr uyğun gəlmir</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h4 className="text-sm font-bold text-blue-800 mb-2">Şifrə tələbləri:</h4>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span>Ən azı 6 simvol</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span>Böyük hərf (tövsiyə olunur)</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span>Rəqəm (tövsiyə olunur)</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span>Xüsusi simvol (tövsiyə olunur)</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || formData.password !== formData.confirmPassword || formData.password.length < 6}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${loading || formData.password !== formData.confirmPassword || formData.password.length < 6
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                                            }`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Şifrə yenilənir...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Shield className="w-5 h-5" />
                                                <span>Şifrəni Yenilə</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Back to Login */}
                            <div className="mt-8 text-center">
                                <Link
                                    to="/auth"
                                    className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200 flex items-center justify-center space-x-1"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Giriş səhifəsinə qayıt</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;