import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Tag, 
  BarChart3, 
  TrendingUp, 
  UserCheck, 
  Calendar,
  Activity,
  Shield,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import UserManagement from '../../components/UserManagement';
import JobManagement from '../../components/JobManagement';
import CategoryManagement from '../../components/CategoryManagement';
import CompanyManagement from '../../components/CompanyManagement';
import DashboardStats from '../../components/DashboardStats';
const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.token || user.role !== 'admin') {
      navigate('/');
      return;
    }
    setLoading(false);
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel Yüklənir</h2>
              <p className="text-gray-600">İdarəetmə paneli hazırlanır...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Giriş İcazəsi Yoxdur</h2>
              <p className="text-gray-600 mb-6">Bu səhifəyə yalnız adminlər daxil ola bilər.</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Ana Səhifəyə Qayıt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
    { id: 'users', label: 'İstifadəçilər', icon: Users, color: 'from-green-500 to-emerald-600' },
    { id: 'companies', label: 'Şirkətlər', icon: Building2, color: 'from-purple-500 to-violet-600' },
    { id: 'jobs', label: 'İş Elanları', icon: Briefcase, color: 'from-orange-500 to-red-600' },
    { id: 'categories', label: 'Kateqoriyalar', icon: Tag, color: 'from-pink-500 to-rose-600' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'users':
        return <UserManagement />;
      case 'companies':
        return <CompanyManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'categories':
        return <CategoryManagement />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-sm text-gray-500">İdarəetmə Sistemi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Sistem Aktiv</span>
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"></div>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
                  Menyu
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      {(() => {
                        const activeItem = menuItems.find(item => item.id === activeTab);
                        const Icon = activeItem?.icon || BarChart3;
                        return (
                          <>
                            <Icon className="w-6 h-6 mr-3 text-indigo-600" />
                            {activeItem?.label || 'Dashboard'}
                          </>
                        );
                      })()}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {activeTab === 'dashboard' && 'Sistem statistikaları və ümumi məlumatlar'}
                      {activeTab === 'users' && 'İstifadəçi hesablarını idarə edin'}
                      {activeTab === 'companies' && 'Şirkət profillərini idarə edin'}
                      {activeTab === 'jobs' && 'İş elanlarını idarə edin'}
                      {activeTab === 'categories' && 'İş kateqoriyalarını idarə edin'}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('az-AZ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;