// frontend/src/pages/TeamsList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamAPI } from '../services/api';

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating'); // rating, name, goals

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (err) {
      console.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'rating') return b.teamRating - a.teamRating;
    if (sortBy === 'name') return a.country.localeCompare(b.country);
    if (sortBy === 'goals') {
      const aGoals = a.players.reduce((sum, p) => sum + p.goalsScored, 0);
      const bGoals = b.players.reduce((sum, p) => sum + p.goalsScored, 0);
      return bGoals - aGoals;
    }
    return 0;
  });

  if (loading) {
    return <div className="text-white text-center">Loading teams...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ⚽ Participating Teams
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setSortBy('rating')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              sortBy === 'rating' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📊 By Rating
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              sortBy === 'name' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🔤 By Name
          </button>
          <button
            onClick={() => setSortBy('goals')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              sortBy === 'goals' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ⚽ By Goals
          </button>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-400 text-lg">No teams registered yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedTeams.map((team, index) => {
            const totalGoals = team.players.reduce((sum, p) => sum + p.goalsScored, 0);
            return (
              <div
                key={team._id}
                className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-2xl hover:from-gray-750 hover:to-gray-650 transition-all transform hover:scale-102 shadow-xl border border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 gap-6">
                    <div className={`text-5xl font-bold w-16 text-center ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-orange-400' :
                      'text-gray-600'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {team.country}
                      </h3>
                      <p className="text-gray-400 text-lg">👤 Manager: {team.manager}</p>
                      <div className="flex items-center gap-6 mt-3">
                        <span className="text-sm text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full">
                          👥 {team.players.length} players
                        </span>
                        {team.isEliminated && (
                          <span className="text-red-400 text-sm font-bold bg-red-900/30 px-3 py-1 rounded-full border border-red-500/30">
                            ❌ Eliminated
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-8 text-center">
                    <div className="bg-blue-900/50 p-5 rounded-xl border border-blue-500/30">
                      <div className="text-4xl font-bold text-blue-400">
                        {team.teamRating.toFixed(1)}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">Rating</div>
                    </div>
                    <div className="bg-green-900/50 p-5 rounded-xl border border-green-500/30">
                      <div className="text-4xl font-bold text-green-400">
                        {totalGoals}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">Goals</div>
                    </div>
                  </div>
                </div>

                {/* Top scorer from team */}
                {totalGoals > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <h4 className="text-gray-400 text-sm mb-3 font-semibold">Top Scorers:</h4>
                    <div className="grid gap-2">
                      {team.players
                        .filter(p => p.goalsScored > 0)
                        .sort((a, b) => b.goalsScored - a.goalsScored)
                        .slice(0, 3)
                        .map((player, idx) => (
                          <div key={player._id} className="text-gray-300 flex items-center gap-3 bg-gray-900/30 p-3 rounded-lg">
                            <span className="text-2xl">⚽</span>
                            <span className="font-semibold">{player.name}</span>
                            <span className="text-green-400 font-bold ml-auto">
                              {player.goalsScored} {player.goalsScored === 1 ? 'goal' : 'goals'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}