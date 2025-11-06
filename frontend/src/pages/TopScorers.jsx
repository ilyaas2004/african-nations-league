import { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';

export default function TopScorers() {
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScorers();
  }, []);

  const fetchScorers = async () => {
    try {
      const response = await teamAPI.getTopScorers();
      setScorers(response.data);
    } catch (err) {
      console.error('Failed to load scorers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading scorers...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-12 text-center">
        ⚽ Top Scorers
      </h1>

      {scorers.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-12 rounded-2xl text-center border border-gray-600">
          <p className="text-gray-400 text-xl">No goals scored yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scorers.map((scorer, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl flex items-center justify-between shadow-2xl transform hover:scale-102 transition-all ${
                index === 0 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 border-4 border-yellow-300' :
                index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-300 border-4 border-gray-200' :
                index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-400 border-4 border-orange-300' :
                'bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600'
              }`}
            >
              <div className="flex items-center gap-8">
                <div className="text-6xl font-bold text-white w-20 text-center">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {scorer.name}
                  </div>
                  <div className={`text-lg ${index < 3 ? 'text-white/90' : 'text-gray-400'}`}>
                    🏴 {scorer.country}
                  </div>
                </div>
              </div>
              <div className="text-right bg-white/10 backdrop-blur-lg p-6 rounded-xl">
                <div className="text-6xl font-bold text-white">
                  {scorer.goals}
                </div>
                <div className={`text-lg ${index < 3 ? 'text-white/90' : 'text-gray-400'}`}>
                  {scorer.goals === 1 ? 'goal' : 'goals'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}