import { useState, useEffect } from 'react';

export function useGameData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Use import.meta.env.BASE_URL for correct path in production (GitHub Pages)
        const baseUrl = import.meta.env.BASE_URL;
        const [game, events] = await Promise.all([
          fetch(`${baseUrl}data/gameData.json`).then(r => {
            if (!r.ok) throw new Error(`Failed to load gameData.json: ${r.status}`);
            return r.json();
          }),
          fetch(`${baseUrl}data/events.json`).then(r => {
            if (!r.ok) throw new Error(`Failed to load events.json: ${r.status}`);
            return r.json();
          })
        ]);
        setData({ ...game, ...events });
      } catch (err) {
        console.error('Error loading game data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
