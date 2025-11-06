import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';

export default function MyTeam() {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyTeam();
  }, []);

  const fetchMyTeam = async () => {
    try {
      const response = await teamAPI.getAll();
      const myTeam = response.data.find(t => 
        t.representative._id === user._id || t.country === user.country
      );
      setTeam(myTeam);
    } catch (err) {
      setError('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position) => {
    const icons = {
      GK: '🧤',
      DF: '🛡️',
      MD: '⚙️',
      AT: '⚡'
    };
    return icons[position] || '⚽';
  };

  const getRatingColor = (rating) => {
    if (rating >= 80) return 'text-green-400';
    if (rating >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading team...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-800 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            No Team Registered
          </h2>
          <p className="text-gray-400 mb-6">
            You haven't registered a team yet. Create your squad to participate in the tournament!
          </p>
          <Link
            to="/register-team"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
          >
            Register Your Team
          </Link>
        </div>
      </div>
    );
  }

  const playersByPosition = {
    GK: team.players.filter(p => p.position === 'GK'),
    DF: team.players.filter(p => p.position === 'DF'),
    MD: team.players.filter(p => p.position === 'MD'),
    AT: team.players.filter(p => p.position === 'AT'),
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Team Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-10 rounded-3xl mb-10 shadow-2xl border-2 border-purple-500/40">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-6 mb-4">
              <span className="text-7xl">🏴</span>
              <h1 className="text-6xl font-black text-white tracking-tight">
                {team.country}
              </h1>
            </div>
            <p className="text-2xl text-purple-200 ml-24">
              👤 Manager: <span className="font-bold text-white">{team.manager}</span>
            </p>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-xl p-8 rounded-2xl border-2 border-white/30 shadow-xl">
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              {team.teamRating.toFixed(1)}
            </div>
            <div className="text-purple-200 text-xl font-semibold mt-2">Team Rating</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all border border-blue-500/30">
          <div className="text-5xl font-bold text-white">{team.players.length}</div>
          <div className="text-gray-300 text-lg">Players</div>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-green-700 p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all border border-green-500/30">
          <div className="text-5xl font-bold text-white">
            {team.players.reduce((sum, p) => sum + p.goalsScored, 0)}
          </div>
          <div className="text-gray-300 text-lg">Goals Scored</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all border border-yellow-500/30">
          <div className="text-5xl font-bold text-white">
            {team.players.filter(p => p.isCaptain).length}
          </div>
          <div className="text-gray-300 text-lg">Captain</div>
        </div>
        <div className={`bg-gradient-to-br ${team.isEliminated ? 'from-red-900 to-red-700' : 'from-green-900 to-green-700'} p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all border ${team.isEliminated ? 'border-red-500/30' : 'border-green-500/30'}`}>
          <div className="text-5xl font-bold text-white">
            {team.isEliminated ? '❌' : '✅'}
          </div>
          <div className="text-gray-300 text-lg">{team.isEliminated ? 'Eliminated' : 'Active'}</div>
        </div>
      </div>

      {/* Squad by Position */}
      {Object.entries(playersByPosition).map(([position, players]) => (
        <div key={position} className="mb-8">
          <div className="flex items-center mb-6 bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border border-gray-600">
            <span className="text-5xl mr-4">{getPositionIcon(position)}</span>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {position === 'GK' && 'Goalkeepers'}
              {position === 'DF' && 'Defenders'}
              {position === 'MD' && 'Midfielders'}
              {position === 'AT' && 'Attackers'}
              <span className="text-gray-400 text-xl ml-3">({players.length})</span>
            </h2>
          </div>

          <div className="grid gap-4">
            {players.map((player, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-r from-gray-800 to-gray-700 p-5 rounded-xl flex items-center justify-between transform hover:scale-102 transition-all shadow-lg hover:shadow-2xl ${
                  player.isCaptain ? 'border-3 border-yellow-500 shadow-yellow-500/50' : 'border border-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-5">{getPositionIcon(player.position)}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-xl">
                        {player.name}
                      </span>
                      {player.isCaptain && (
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ CAPTAIN
                        </span>
                      )}
                    </div>
                    {player.goalsScored > 0 && (
                      <div className="text-green-400 font-bold text-sm mt-1">
                        ⚽ {player.goalsScored} {player.goalsScored === 1 ? 'goal' : 'goals'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className={`font-bold text-xl ${getRatingColor(player.ratings.GK)}`}>
                      {player.ratings.GK}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">GK</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className={`font-bold text-xl ${getRatingColor(player.ratings.DF)}`}>
                      {player.ratings.DF}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">DF</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className={`font-bold text-xl ${getRatingColor(player.ratings.MD)}`}>
                      {player.ratings.MD}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">MD</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className={`font-bold text-xl ${getRatingColor(player.ratings.AT)}`}>
                      {player.ratings.AT}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">AT</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}