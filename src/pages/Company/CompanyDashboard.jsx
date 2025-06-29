import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CompanyProfile from '../../components/CompanyProfile';
import CompanyJobList from '../../components/CompanyJobList';

const CompanyDashboardPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // --- İş Elanları üçün Statelər ---
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState('');

  // --- Şirkət Profili üçün Statelər ---
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    companyName: '',
    industry: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    establishedYear: '',
  });

  useEffect(() => {
    if (!user.token || user.role !== 'company') {
      navigate('/');
      return;
    }
    fetchCompanyJobs();
    fetchCompanyProfile();
  }, [user, navigate]);

  // --- İş Elanları Funksiyaları ---
  const fetchCompanyJobs = async () => {
    try {
      setLoadingJobs(true);
      setJobsError('');
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get('https://job-server-tcq9.onrender.com/api/jobs/company/myjobs', config);
      setCompanyJobs(res.data.data);
    } catch (err) {
      console.error('Şirkət işləri gətirilərkən xəta:', err);
      setJobsError(err.response?.data?.message || 'İş elanları yüklənərkən xəta baş verdi.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Bu iş elanını silmək istədiyinizə əminsiniz?')) {
      return;
    }
    try {
      setJobsError('');
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`https://job-server-tcq9.onrender.com/api/jobs/${jobId}`, config);
      setCompanyJobs(companyJobs.filter(job => job._id !== jobId));
      if (selectedJobApplicants && selectedJobApplicants.jobId === jobId) {
        setSelectedJobApplicants(null);
      }
      alert('İş elanı uğurla silindi!');
    } catch (err) {
      console.error('İş elanı silinərkən xəta:', err);
      setJobsError(err.response?.data?.message || 'İş elanı silinə bilmədi.');
    }
  };

  const fetchApplicants = async (jobId, jobTitle) => {
    setApplicantsLoading(true);
    setApplicantsError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`https://job-server-tcq9.onrender.com/api/jobs/${jobId}/applicants`, config);
      setSelectedJobApplicants({
        jobId,
        jobTitle,
        applicants: res.data.data,
      });
    } catch (err) {
      console.error('Müraciət edənlər gətirilərkən xəta:', err);
      setApplicantsError(err.response?.data?.message || 'Müraciət edənlər gətirilə bilmədi.');
      setSelectedJobApplicants(null);
    } finally {
      setApplicantsLoading(false);
    }
  };

  // --- Şirkət Profili Funksiyaları ---
  const fetchCompanyProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError('');
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get('https://job-server-tcq9.onrender.com/api/companies/me', config);
      setProfile(res.data.data);
      setEditFormData({
        companyName: res.data.data.companyName || '',
        industry: res.data.data.industry || '',
        description: res.data.data.description || '',
        address: res.data.data.address || '',
        phone: res.data.data.phone || '',
        website: res.data.data.website || '',
        establishedYear: res.data.data.establishedYear || '',
      });
    } catch (err) {
      console.error('Profil gətirilərkən xəta:', err.response?.data);
      setProfileError(err.response?.data?.message || 'Profil yüklənərkən xəta baş verdi.');
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogoFileChange = (event) => {
    setSelectedLogoFile(event.target.files[0]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const formData = new FormData();
      for (const key in editFormData) {
        formData.append(key, editFormData[key]);
      }
      if (selectedLogoFile) {
        formData.append('logo', selectedLogoFile);
      }

      const res = await axios.put('https://job-server-tcq9.onrender.com/api/companies/profile', formData, config);
      setProfileMessage(res.data.message);
      setProfile(res.data.data);
      setSelectedLogoFile(null);
      setIsEditMode(false);

      if (res.data.user) {
        login(
          res.data.user.token,
          res.data.user.role,
          res.data.user.displayName,
          res.data.data.logoUrl
        );
      }

    } catch (err) {
      console.error('Profil yenilənərkən xəta:', err.response?.data);
      setProfileError(err.response?.data?.message || 'Profil yenilənə bilmədi.');
    }
  };

  if (loadingJobs || loadingProfile) {
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

  if (user.role !== 'company') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giriş Qadağandır</h2>
            <p className="text-lg text-gray-600">Bu səhifəyə giriş icazəniz yoxdur!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Şirkət Paneli</h1>
              <p className="text-lg text-gray-600">Şirkətinizi idarə edin və iş elanlarınızı izləyin</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Aktiv İş Elanları</p>
                <p className="text-2xl font-bold text-blue-900">{companyJobs.length}</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium text-green-700">Ümumi Müraciətlər</p>
                <p className="text-2xl font-bold text-green-900">
                  {companyJobs.reduce((total, job) => total + (job.applicants?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Şirkət Profili
                </h2>
              </div>
              <div className="p-6">
                <CompanyProfile
                  profile={profile}
                  profileError={profileError}
                  profileMessage={profileMessage}
                  isEditMode={isEditMode}
                  editFormData={editFormData}
                  selectedLogoFile={selectedLogoFile}
                  setIsEditMode={setIsEditMode}
                  handleEditChange={handleEditChange}
                  handleLogoFileChange={handleLogoFileChange}
                  handleUpdateProfile={handleUpdateProfile}
                />
              </div>
            </div>
          </div>

          {/* Job Listings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v6a2 2 0 002 2h4a2 2 0 002-2V8M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                  İş Elanları
                </h2>
              </div>
              <div className="">
                <CompanyJobList
                  companyJobs={companyJobs}
                  jobsError={jobsError}
                  selectedJobApplicants={selectedJobApplicants}
                  applicantsLoading={applicantsLoading}
                  applicantsError={applicantsError}
                  handleDeleteJob={handleDeleteJob}
                  fetchApplicants={fetchApplicants}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDashboardPage;