import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'representative',
    country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const africanCountries = [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
    'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros',
    'Congo', 'DR Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea',
    'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau',
    'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
    'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
    'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles',
    'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania',
    'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-black p-6">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-lg border-2 border-purple-500/40">
        <div className="text-center mb-10">
          <div className="text-8xl mb-6 animate-bounce">⚽</div>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 mb-3 tracking-tight">
            Create Account
          </h2>
          <p className="text-purple-200 text-lg">Join the tournament</p>
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
              minLength="6"
              className="w-full px-6 py-4 bg-gray-900/60 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500 border-2 border-gray-700 hover:border-purple-500/50 transition-all text-lg"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-3 font-semibold text-lg">Role</label>
            <select
              className="w-full px-6 py-4 bg-gray-900/60 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500 border-2 border-gray-700 hover:border-purple-500/50 transition-all text-lg"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="representative">Team Representative</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {formData.role === 'representative' && (
            <div>
              <label className="block text-purple-200 mb-3 font-semibold text-lg">Country</label>
              <select
                required
                className="w-full px-6 py-4 bg-gray-900/60 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-500 border-2 border-gray-700 hover:border-purple-500/50 transition-all text-lg"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              >
                <option value="">Select Country</option>
                {africanCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 text-white font-black py-4 px-6 rounded-xl disabled:opacity-50 shadow-2xl transform hover:scale-105 transition-all text-xl"
          >
            {loading ? 'Creating Account...' : 'Create Account 🚀'}
          </button>
        </form>

        <p className="text-purple-200 text-center mt-8 text-lg">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}