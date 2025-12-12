import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import CourseList from './pages/CourseList';
import CourseForm from './pages/CourseForm';

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Route - Login */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />

            {/* Protected Routes - Cần đăng nhập */}
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute>
                  <CourseList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/create" 
              element={
                <ProtectedRoute>
                  <CourseForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/edit/:id" 
              element={
                <ProtectedRoute>
                  <CourseForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/add" 
              element={
                <ProtectedRoute>
                  <CourseForm />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App
