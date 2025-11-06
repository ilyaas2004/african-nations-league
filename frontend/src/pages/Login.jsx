import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-black p-6">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-lg border-2 border-purple-500/40">
        <div className="text-center mb-10">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-3 tracking-tight">
            African Nations League
          </h2>
          <p className="text-purple-200 text-lg">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 mb-3 font-semibold text-lg">Email</label>
            <input
              type="email"
              required
              className="w-full px-6 py-4 bg-gray-900/60 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500 border-2 border-gray-700 hover:border-purple-500/50 transition-all text-lg"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-3 font-semibold text-lg">Password</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 bg-gray-900/60 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500 border-2 border-gray-700 hover:border-purple-500/50 transition-all text-lg"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-black py-4 px-6 rounded-xl disabled:opacity-50 shadow-2xl transform hover:scale-105 transition-all text-xl"
          >
            {loading ? 'Signing in...' : 'Sign In ⚡'}
          </button>
        </form>

        <p className="text-purple-200 text-center mt-8 text-lg">
          Don't have an account?{' '}
          <Link to="/register" className="text-yellow-400 hover:text-yellow-300 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
