// frontend/src/pages/Bracket.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchAPI } from '../services/api';

export default function Bracket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await matchAPI.getAll();
      setMatches(response.data);
    } catch (err) {
      console.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading bracket...</div>;
  }

  const quarterFinals = matches.filter(m => m.round === 'quarter-final');
  const semiFinals = matches.filter(m => m.round === 'semi-final');
  const finals = matches.filter(m => m.round === 'final');

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Tournament Bracket
        </h1>
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-400 text-lg mb-4">
            Tournament bracket not generated yet
          </p>
          <p className="text-gray-500">
            Waiting for 8 teams to register and admin to generate the bracket
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-12 text-center animate-pulse">
        🏆 Road to the Final
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Quarter Finals */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6 text-center">
            Quarter Finals
          </h2>
          <div className="space-y-8">
            {quarterFinals.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </div>

        {/* Semi Finals */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 text-center">
            Semi Finals
          </h2>
          <div className="space-y-16 mt-16">
            {semiFinals.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="lg:col-span-1"></div>

        {/* Final */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6 text-center">
            🏆 Final
          </h2>
          <div className="mt-32">
            {finals.map((match) => (
              <div key={match._id}>
                <MatchCard match={match} />
                {match.status === 'completed' && match.winner && (
                  <div className="mt-8 bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-500 p-8 rounded-2xl text-center shadow-2xl border-4 border-yellow-400 animate-pulse">
                    <div className="text-6xl mb-4">🏆</div>
                    <div className="text-3xl font-bold text-white mb-2">
                      CHAMPION
                    </div>
                    <div className="text-5xl font-bold text-white mt-3">
                      {match.winner.country}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match }) {
  return (
    <Link
      to={`/match/${match._id}`}
      className="block bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden hover:from-gray-750 hover:to-gray-650 transition-all transform hover:scale-105 shadow-xl border border-gray-600"
    >
      <div className="p-6">
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${
          match.winner && match.winner._id === match.team1._id
            ? 'bg-gradient-to-r from-green-900 to-green-700 border-2 border-green-500 shadow-lg shadow-green-500/50'
            : 'bg-gray-700/50'
        }`}>
          <span className="text-white font-bold text-lg">{match.team1.country}</span>
          {match.status === 'completed' && (
            <span className="text-3xl font-bold text-white">
              {match.team1Score}
            </span>
          )}
        </div>

        <div className="text-center py-3">
          <span className="text-gray-400 text-sm font-bold">VS</span>
        </div>

        {/* Team 2 */}
        <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${
          match.winner && match.winner._id === match.team2._id
            ? 'bg-gradient-to-r from-green-900 to-green-700 border-2 border-green-500 shadow-lg shadow-green-500/50'
            : 'bg-gray-700/50'
        }`}>
          <span className="text-white font-bold text-lg">{match.team2.country}</span>
          {match.status === 'completed' && (
            <span className="text-3xl font-bold text-white">
              {match.team2Score}
            </span>
          )}
        </div>
      </div>

      {/* Match Status */}
      <div className="bg-gradient-to-r from-gray-900 to-black px-4 py-3 text-center border-t border-gray-700">
        {match.status === 'pending' ? (
          <span className="text-yellow-400 text-sm font-bold">⏳ Pending</span>
        ) : (
          <span className="text-green-400 text-sm font-bold">
            {match.wasSimulated ? '✓ Simulated' : '✓ Played'}
          </span>
        )}
      </div>
    </Link>
  );
}