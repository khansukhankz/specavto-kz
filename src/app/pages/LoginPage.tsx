import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, User, FileText, TrendingUp, Package } from 'lucide-react';
import logo from 'figma:asset/b62df581f623c26f241fa405c2719c0936bebb57.png';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'manager' && password === 'specauto2024') {
      // Сохраняем токен в localStorage
      localStorage.setItem('userAuth', 'true');
      navigate('/main');
    } else {
      setError('Неверный логин или пароль');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-700 flex relative overflow-hidden">
      {/* Background Pattern for mobile */}
      <div className="absolute inset-0 opacity-10 lg:hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <img src={logo} alt="SPEC" className="h-20 mb-8 object-contain" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Система формирования КП
          </h1>
          <p className="text-orange-100 text-lg">
            Создавайте коммерческие предложения для клиентов быстро и профессионально
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Выбор спецтехники</h3>
              <p className="text-orange-100 text-sm">
                Широкий ассортимент техники с актуальными ценами
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Быстрое создание КП</h3>
              <p className="text-orange-100 text-sm">
                Автоматическое формирование документа в формате PDF
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Автоматический расчет</h3>
              <p className="text-orange-100 text-sm">
                Мгновенный подсчет стоимости с учетом НДС
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-orange-200 text-sm">
          © 2024 ТОО «Спец Авто Казахстан». Все права защищены.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src={logo} alt="SPEC" className="h-14 mx-auto mb-4 object-contain" />
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Вход в систему</h2>
              <p className="text-gray-600">Введите данные для доступа к платформе</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Логин
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                    placeholder="Введите ваш логин"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                    placeholder="Введите ваш пароль"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Войти в систему
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Требуется доступ в админ-панель?
              </p>
              <button
                onClick={() => navigate('/admin-login')}
                className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Перейти в админку →
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-xs text-white/80 lg:text-gray-600">
            <p>Нужна помощь? Свяжитесь с технической поддержкой</p>
            <p className="mt-1">📞 +7 702 274 6797 • ✉ specavtokazakhstan@gmail.com</p>
          </div>
          
          {/* Mobile Footer */}
          <div className="lg:hidden mt-8 text-center text-xs text-white/70">
            © 2024 ТОО «Спец Авто Казахстан». Все права защищены.
          </div>
        </div>
      </div>
    </div>
  );
}