// frontend/src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { teamAPI, matchAPI } from '../services/api';

export default function AdminPanel() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, matchesRes] = await Promise.all([
        teamAPI.getAll(),
        matchAPI.getAll()
      ]);
      setTeams(teamsRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBracket = async () => {
    if (teams.length < 8) {
      setMessage({ type: 'error', text: `Need 8 teams. Currently have ${teams.length} teams.` });
      return;
    }

    setActionLoading(true);
    try {
      await matchAPI.generateBracket();
      setMessage({ type: 'success', text: 'Tournament bracket generated!' });
      await fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to generate bracket' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateMatch = async (matchId) => {
    setActionLoading(true);
    try {
      await matchAPI.simulate(matchId);
      setMessage({ type: 'success', text: 'Match simulated!' });
      await fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to simulate match' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetTournament = async () => {
    if (!confirm('Are you sure? This will delete all matches and reset team data.')) {
      return;
    }

    setActionLoading(true);
    try {
      await matchAPI.reset();
      setMessage({ type: 'success', text: 'Tournament reset!' });
      await fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset tournament' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  const activeTeams = teams.filter(t => !t.isEliminated);
  const quarterFinals = matches.filter(m => m.round === 'quarter-final');
  const semiFinals = matches.filter(m => m.round === 'semi-final');
  const finals = matches.filter(m => m.round === 'final');

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Admin Panel</h1>

      {message.text && (
        <div className={`${message.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-green-500/10 border-green-500 text-green-500'} border px-4 py-3 rounded mb-6`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white">{teams.length}</div>
          <div className="text-gray-400">Total Teams</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-400">{activeTeams.length}</div>
          <div className="text-gray-400">Active Teams</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-400">{matches.length}</div>
          <div className="text-gray-400">Total Matches</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-yellow-400">
            {matches.filter(m => m.status === 'completed').length}
          </div>
          <div className="text-gray-400">Completed</div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Tournament Controls</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleGenerateBracket}
            disabled={actionLoading || teams.length !== 8 || matches.length > 0}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Bracket
          </button>
          <button
            onClick={handleResetTournament}
            disabled={actionLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
          >
            Reset Tournament
          </button>
        </div>
        {teams.length !== 8 && (
          <p className="text-yellow-400 text-sm mt-2">
            Need exactly 8 teams to generate bracket. Currently have {teams.length} teams.
          </p>
        )}
      </div>

      {/* Registered Teams */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Registered Teams ({teams.length})</h2>
        <div className="grid gap-3">
          {teams.map((team) => (
            <div key={team._id} className="bg-gray-700 p-4 rounded flex items-center justify-between">
              <div>
                <div className="text-white font-bold">{team.country}</div>
                <div className="text-gray-400 text-sm">Manager: {team.manager}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{team.teamRating.toFixed(1)}</div>
                <div className="text-gray-400 text-sm">Rating</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matches */}
      {matches.length > 0 && (
        <div className="space-y-6">
          {quarterFinals.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Quarter Finals</h2>
              <MatchList matches={quarterFinals} onSimulate={handleSimulateMatch} loading={actionLoading} />
            </div>
          )}

          {semiFinals.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Semi Finals</h2>
              <MatchList matches={semiFinals} onSimulate={handleSimulateMatch} loading={actionLoading} />
            </div>
          )}

          {finals.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Final</h2>
              <MatchList matches={finals} onSimulate={handleSimulateMatch} loading={actionLoading} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MatchList({ matches, onSimulate, loading }) {
  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div key={match._id} className="bg-gray-700 p-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">{match.team1.country}</span>
                {match.status === 'completed' && (
                  <span className="text-2xl font-bold text-white">{match.team1Score}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{match.team2.country}</span>
                {match.status === 'completed' && (
                  <span className="text-2xl font-bold text-white">{match.team2Score}</span>
                )}
              </div>
            </div>
            
            <div className="ml-6">
              {match.status === 'pending' ? (
                <button
                  onClick={() => onSimulate(match._id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  Simulate
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-green-400 font-bold">✓ Completed</div>
                  <div className="text-gray-400 text-sm">
                    {match.wasSimulated ? 'Simulated' : 'Played'}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {match.status === 'completed' && match.winner && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <span className="text-yellow-400 font-bold">
                Winner: {match.winner.country}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}