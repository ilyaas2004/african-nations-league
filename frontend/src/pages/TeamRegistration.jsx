// frontend/src/pages/TeamRegistration.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';

export default function TeamRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingTeam, setExistingTeam] = useState(null);
  
  const [formData, setFormData] = useState({
    country: user?.country || '',
    manager: '',
  });

  useEffect(() => {
    checkExistingTeam();
  }, []);

  const checkExistingTeam = async () => {
    try {
      const response = await teamAPI.getAll();
      const myTeam = response.data.find(team => 
        team.representative._id === user._id || team.country === user.country
      );
      if (myTeam) {
        setExistingTeam(myTeam);
      }
    } catch (err) {
      console.error('Error checking team:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await teamAPI.create({
        country: formData.country,
        manager: formData.manager,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-team');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  if (existingTeam) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-900/30 border border-green-500 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Team Already Registered! ✅
          </h2>
          <p className="text-gray-300 mb-6">
            You have already registered a team for {existingTeam.country}
          </p>
          <button
            onClick={() => navigate('/my-team')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
          >
            View My Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Register Your Team
      </h1>

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-6">
          Team created successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="mb-6 bg-blue-900/30 border border-blue-500 p-4 rounded">
          <h3 className="text-white font-bold mb-2">📋 What happens next:</h3>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>System will auto-generate 23 players for your squad</li>
            <li>Players will be assigned positions: 3 GK, 8 DF, 7 MD, 5 AT</li>
            <li>Each player gets ratings based on their natural position</li>
            <li>A captain will be randomly assigned</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-semibold">
              Country
            </label>
            <input
              type="text"
              disabled
              className="w-full px-4 py-3 bg-gray-700 text-gray-400 rounded cursor-not-allowed"
              value={formData.country}
            />
            <p className="text-gray-500 text-sm mt-1">
              Your country was set during registration
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-semibold">
              Manager Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., John Smith"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
            />
          </div>

          <div className="bg-gray-900 p-4 rounded mb-6">
            <h4 className="text-white font-bold mb-3">Squad Composition:</h4>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🧤</span>
                <div>
                  <div className="font-semibold">Goalkeepers</div>
                  <div className="text-sm text-gray-400">3 players</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🛡️</span>
                <div>
                  <div className="font-semibold">Defenders</div>
                  <div className="text-sm text-gray-400">8 players</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚙️</span>
                <div>
                  <div className="font-semibold">Midfielders</div>
                  <div className="text-sm text-gray-400">7 players</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                <div>
                  <div className="font-semibold">Attackers</div>
                  <div className="text-sm text-gray-400">5 players</div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50 transition"
          >
            {loading ? 'Creating Team...' : 'Create Team & Generate Squad'}
          </button>
        </form>
      </div>
    </div>
  );
}