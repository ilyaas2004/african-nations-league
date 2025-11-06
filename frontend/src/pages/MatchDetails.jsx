import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const response = await matchAPI.getById(id);
      setMatch(response.data);
    } catch (err) {
      console.error('Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading match...</div>;
  }

  if (!match) {
    return <div className="text-white text-center">Match not found</div>;
  }

  const sortedGoals = [...match.goals].sort((a, b) => a.minute - b.minute);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/bracket" className="text-blue-400 hover:underline mb-4 inline-block">
        ← Back to Bracket
      </Link>

      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
        {/* Match Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6">
          <div className="text-center mb-4">
            <span className="text-gray-300 uppercase text-sm font-bold">
              {match.round.replace('-', ' ')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {match.team1.country}
              </div>
              <div className="text-gray-300 text-sm">
                Rating: {match.team1.teamRating.toFixed(1)}
              </div>
            </div>

            {match.status === 'completed' && (
              <div className="px-8">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-white">
                    {match.team1Score}
                  </span>
                  <span className="text-3xl text-gray-400">-</span>
                  <span className="text-5xl font-bold text-white">
                    {match.team2Score}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {match.team2.country}
              </div>
              <div className="text-gray-300 text-sm">
                Rating: {match.team2.teamRating.toFixed(1)}
              </div>
            </div>
          </div>

          {match.status === 'completed' && match.winner && (
            <div className="mt-6 text-center">
              <div className="inline-block bg-yellow-500 text-black font-bold px-6 py-2 rounded">
                Winner: {match.winner.country}
              </div>
            </div>
          )}
        </div>

        {/* Match Status */}
        <div className="bg-gray-900 p-4 text-center">
          {match.status === 'pending' ? (
            <span className="text-yellow-400">Match Pending</span>
          ) : (
            <span className="text-green-400">
              {match.wasSimulated ? 'Match Simulated' : 'Match Played'}
            </span>
          )}
        </div>
      </div>

      {/* Goals Timeline */}
      {match.status === 'completed' && sortedGoals.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">⚽ Goals</h2>
          <div className="space-y-3">
            {sortedGoals.map((goal, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-700 rounded">
                <div className="text-2xl font-bold text-green-400 w-16">
                  {goal.minute}'
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold">{goal.player}</div>
                  <div className="text-gray-400 text-sm">{goal.team}</div>
                </div>
                <div className="text-2xl">⚽</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commentary */}
      {match.commentary && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">📝 Match Commentary</h2>
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {match.commentary}
          </div>
        </div>
      )}

      {match.status === 'pending' && (
        <div className="bg-blue-900/30 border border-blue-500 p-6 rounded-lg text-center">
          <p className="text-gray-300">
            This match hasn't been played yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}