import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MainPage } from './MainPage';
import { LogOut } from 'lucide-react';

export function ProtectedMainPage() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('userAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    navigate('/login');
  };

  return (
    <div className="relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Выйти</span>
      </button>
      
      <MainPage />
    </div>
  );
}