import { useEffect, useState } from 'react';
import axios from 'axios';

const PastWinners = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/winners`)
      .then(res => setWinners(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-3 text-gray-800">🏆 Past Tournament Winners</h2>
      {winners.length > 0 ? (
        <ul className="space-y-2 text-gray-700 text-sm">
          {winners.map((w, i) => (
            <li key={i} className="border-b pb-1">
              <strong>{w.year}</strong> — {w.teamName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No past winners recorded yet.</p>
      )}
    </div>
  );
};

export default PastWinners;
