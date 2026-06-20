import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSearch } from 'react-icons/fi';
import api from '../utils/api';
import { VideoCard, LoadingSpinner, EmptyState } from '../components/ui/Cards';

const QUICK_TAGS = ['Muay Thai', 'BJJ', 'Karate Kata', 'Judo Throws', 'Boxing Combos', 'Wing Chun', 'Krav Maga', 'Taekwondo Kicks'];

export default function VideoPage() {
  const [query, setQuery] = useState('martial arts techniques');
  const [searchInput, setSearchInput] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchVideos = useCallback(async (q, pageToken = null) => {
    setLoading(true);
    try {
      const params = { q, maxResults: 12 };
      if (pageToken) params.pageToken = pageToken;
      const { data } = await api.get('/videos/search', { params });
      setVideos(prev => pageToken ? [...prev, ...data.videos] : data.videos);
      setNextPageToken(data.nextPageToken || null);
    } catch { setVideos([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchVideos(query); }, [query, fetchVideos]);

  const handleSearch = () => { if (searchInput.trim()) setQuery(searchInput.trim()); };

  return (
    <>
      <Helmet><title>Video Center — MartialHub</title></Helmet>
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-display tracking-widest mb-2" style={{ color: 'var(--accent)' }}>VIDEO CENTER</p>
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Watch & Learn</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Curated martial arts tutorials and fights from YouTube</p>
        </div>

        <div className="max-w-2xl mx-auto mb-6 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a martial art or technique..."
            className="input-custom pl-12"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {QUICK_TAGS.map(tag => (
            <button key={tag} onClick={() => setQuery(tag)} className="tag px-4 py-2 text-sm">{tag}</button>
          ))}
        </div>

        {loading && videos.length === 0 ? <LoadingSpinner /> : videos.length === 0 ? <EmptyState message="No videos found." /> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
            {nextPageToken && (
              <div className="text-center mt-10">
                <button onClick={() => fetchVideos(query, nextPageToken)} disabled={loading} className="btn-ghost">
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
