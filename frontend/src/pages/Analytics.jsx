import { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = ({ teamId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/teams/${teamId}/analytics`)
      .then(res => setStats(res.data))
      .catch(() => setStats(null));
  }, [teamId]);

  if (!stats) return <p>Loading team analytics...</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-3 text-gray-800">📊 Team Performance Analytics</h2>
      <ul className="space-y-1 text-gray-700 text-sm">
        <li><strong>Matches Played:</strong> {stats.totalPlayed}</li>
        <li><strong>Wins:</strong> {stats.wins}</li>
        <li><strong>Losses:</strong> {stats.losses}</li>
        <li><strong>Goals Scored:</strong> {stats.goalsScored}</li>
      </ul>
    </div>
  );
};

export default Analytics;
