import { useState, useEffect } from 'react';

export function useGameData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [game, events] = await Promise.all([
          fetch('/data/gameData.json').then(r => r.json()),
          fetch('/data/events.json').then(r => r.json())
        ]);
        setData({ ...game, ...events });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
