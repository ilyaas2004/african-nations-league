// frontend/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
   <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-center py-12">

      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 animate-pulse">
        Welcome to African Nations League
      </h1>
      <p className="text-2xl text-gray-400 mb-12">
        Experience the excitement of African football tournament ⚽
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <Link
          to="/bracket"
          className="group bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
          <h3 className="text-2xl font-bold text-white mb-3">Tournament Bracket</h3>
          <p className="text-gray-300">View the road to the final</p>
        </Link>

        <Link
          to="/teams"
          className="group bg-gradient-to-br from-green-900 to-green-700 hover:from-green-800 hover:to-green-600 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-500/30"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚽</div>
          <h3 className="text-2xl font-bold text-white mb-3">Teams</h3>
          <p className="text-gray-300">Explore participating teams</p>
        </Link>

        <Link
          to="/scorers"
          className="group bg-gradient-to-br from-yellow-900 to-orange-700 hover:from-yellow-800 hover:to-orange-600 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-yellow-500/30"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🥇</div>
          <h3 className="text-2xl font-bold text-white mb-3">Top Scorers</h3>
          <p className="text-gray-300">Leading goal scorers</p>
        </Link>
      </div>

      {user && user.role === 'representative' && (
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-purple-900 border-2 border-blue-500 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to participate? ⚽
          </h3>
          <Link
            to="/my-team"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Register Your Team 🚀
          </Link>
        </div>
      )}

      {user && user.role === 'admin' && (
        <div className="mt-16 bg-gradient-to-r from-purple-900 to-pink-900 border-2 border-purple-500 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Admin Controls 👑
          </h3>
          <Link
            to="/admin"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Go to Admin Panel ⚡
          </Link>
        </div>
      )}
    </div>
  );
}