import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import DefaultLayout from './layout/DefaultLayout';

// Components
import ProtectedRoute from './components/ProtectedRouter';
// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PostJobPage from './pages/Company/PostJob';
import JobDetailPage from './pages/JobDetailPage';
import ApplicantDashboardPage from './pages/ApplicantDashboardPage';
import ApplicantsPage from './pages/ApplicantsPage';
import ApplicantDetailPage from './pages/ApplicantDetailPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import CompanyDashboard from './pages/Company/CompanyDashboard';
import EditJob from './pages/Company/EditJob';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Hər kəs daxil ola bilər */}
          <Route 
            path="/" 
            element={
              <DefaultLayout>
                <HomePage />
              </DefaultLayout>
            } 
          />
          
          <Route 
            path="/auth" 
            element={
              <DefaultLayout>
                <AuthPage />
              </DefaultLayout>
            } 
          />

          {/* Job Detail - Public route (login olmadan da baxıla bilər) */}
          <Route 
            path="/jobs/:id" 
            element={
              <DefaultLayout>
                <JobDetailPage />
              </DefaultLayout>
            } 
          />

          {/* Reset Password - Public route */}
          <Route 
            path="/reset-password/:token" 
            element={
              <DefaultLayout>
                <AuthPage />
              </DefaultLayout>
            } 
          />

          {/* Protected Routes - Login tələb olunur */}
          <Route 
            path="/applicants" 
            element={
              <ProtectedRoute requireAuth={true}>
                <DefaultLayout>
                  <ApplicantsPage />
                </DefaultLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/applicants/:id" 
            element={
              <ProtectedRoute requireAuth={true}>
                <DefaultLayout>
                  <ApplicantDetailPage />
                </DefaultLayout>
              </ProtectedRoute>
            } 
          />

          {/* Applicant Only Routes - Yalnız iş axtaranlar */}
          <Route 
            path="/applicant-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <DefaultLayout>
                  <ApplicantDashboardPage />
                </DefaultLayout>
              </ProtectedRoute>
            } 
          />

          {/* Company Only Routes - Yalnız şirkətlər */}
          <Route 
            path="/post-job" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <DefaultLayout>
                  <PostJobPage />
                </DefaultLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/company-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <DefaultLayout>
                  <CompanyDashboard />
                </DefaultLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/edit-job/:id" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <DefaultLayout>
                  <EditJob />
                </DefaultLayout>
              </ProtectedRoute>
            } 
          />

          {/* Admin Only Routes - Yalnız adminlər */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DefaultLayout>
                  <AdminDashboardPage />
                </DefaultLayout>
              </ProtectedRoute>
            } 
          />

          {/* 404 Route - Tapılmayan səhifələr üçün */}
          <Route 
            path="*" 
            element={
              <DefaultLayout>
                <NotFoundPage />
              </DefaultLayout>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// // Company Dashboard Component (müvəqqəti)
// const CompanyDashboard = () => (
//   <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
//     <div className="container mx-auto px-4 py-16">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">Şirkət Paneli</h1>
//         <p className="text-gray-600 mb-8">Bu səhifə hazırlanmaqdadır...</p>
//         <button 
//           onClick={() => window.location.href = '/post-job'}
//           className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           İş Elanı Yerləşdir
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Edit Job Component (müvəqqəti)
// const EditJob = () => (
//   <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100">
//     <div className="container mx-auto px-4 py-16">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">İş Elanını Redaktə Et</h1>
//         <p className="text-gray-600 mb-8">Bu səhifə hazırlanmaqdadır...</p>
//         <button 
//           onClick={() => window.history.back()}
//           className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           Geri Qayıt
//         </button>
//       </div>
//     </div>
//   </div>
// );

// 404 Not Found Component
const NotFoundPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-white">404</span>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Səhifə Tapılmadı</h2>
          <p className="text-gray-600 mb-6">Axtardığınız səhifə mövcud deyil və ya silinib.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ana Səhifəyə Qayıt
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default App;