import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-2xl border-b-2 border-purple-500/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 hover:from-yellow-200 hover:to-red-400 transition-all tracking-tight">
              🏆 African Nations League
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              to="/bracket"
              className="text-gray-200 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-base font-semibold transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              🏆 Tournament
            </Link>
            <Link
              to="/teams"
              className="text-gray-200 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-base font-semibold transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              ⚽ Teams
            </Link>
            <Link
              to="/scorers"
              className="text-gray-200 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-base font-semibold transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              🥇 Scorers
            </Link>
            <Link to="/past-winners" className="text-gray-200 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-base font-semibold transition-all transform hover:scale-105 backdrop-blur-sm">
            Past Winners</Link>


            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-xl text-base font-bold shadow-xl transform hover:scale-105 transition-all"
                  >
                    👑 Admin
                  </Link>
                )}
                {user.role === 'representative' && (
                  <Link
                    to="/my-team"
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-base font-bold shadow-xl transform hover:scale-105 transition-all"
                  >
                    ⚽ My Team
                  </Link>
                )}
                <div className="flex items-center gap-2 text-gray-200 px-4 py-2 bg-white/5 rounded-xl backdrop-blur-sm">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-medium">{user.email.split('@')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-base font-bold shadow-xl transform hover:scale-105 transition-all"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
