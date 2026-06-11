module.exports = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AFRO SOUND - Admin Panel</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0b1020; color: #e9edf2; overflow-x: hidden; }
        .primary-orange { color: #F97316; }
        .bg-primary-orange { background-color: #F97316; }
        .border-primary-orange { border-color: #F97316; }
        .card-hover:hover { transform: translateY(-5px); transition: all 0.3s ease; border-color: #F97316; }
        .nav-link { transition: all 0.2s ease; }
        .nav-link:hover { color: #F97316; }
        .chart-container { position: relative; height: 300px; width: 100%; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        const StatusCard = ({ label, value, state }) => {
            const dotColor = state === 'ok' ? 'bg-green-500' : state === 'ko' ? 'bg-red-500' : 'bg-orange-500';
            return (
                <div className="bg-[#16191f] border border-[#262b33] rounded-xl p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-wider">{label}</div>
                    <div className="text-lg font-semibold mt-2 flex items-center">
                        {state && <span className={"w-2.5 h-2.5 rounded-full mr-2 " + dotColor}></span>}
                        {value}
                    </div>
                </div>
            );
        };

        const StatsView = ({ stats }) => {
            const chartRefs = {
                sources: React.useRef(null),
                visibility: React.useRef(null),
                top: React.useRef(null)
            };

            useEffect(() => {
                if (!stats) return;
                const charts = [];

                // Sources Chart
                const sourceCtx = chartRefs.sources.current.getContext('2d');
                charts.push(new Chart(sourceCtx, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(stats.trackSources),
                        datasets: [{
                            data: Object.values(stats.trackSources),
                            backgroundColor: ['#F97316', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
                            borderWidth: 0
                        }]
                    },
                    options: { plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } } }
                });

                // Visibility Chart
                const visCtx = chartRefs.visibility.current.getContext('2d');
                charts.push(new Chart(visCtx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(stats.playlistVisibility),
                        datasets: [{
                            data: Object.values(stats.playlistVisibility),
                            backgroundColor: ['#10b981', '#ef4444'],
                            borderWidth: 0
                        }]
                    },
                    options: { plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } } }
                });

                // Top Tracks
                const topCtx = chartRefs.top.current.getContext('2d');
                charts.push(new Chart(topCtx, {
                    type: 'bar',
                    data: {
                        labels: stats.topTracks.map(t => t.title.substring(0, 15) + '...'),
                        datasets: [{
                            label: 'Écoutes',
                            data: stats.topTracks.map(t => t.count),
                            backgroundColor: '#F97316',
                            borderRadius: 8
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            x: { grid: { color: '#262b33' }, ticks: { color: '#9ca3af' } },
                            y: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                        },
                        plugins: { legend: { display: false } }
                    }
                }));

                return () => {
                    charts.forEach(c => c.destroy());
                };
            }, [stats]);

            if (!stats) return <div className="text-center py-20 text-gray-500 animate__animated animate__fadeIn">Chargement des statistiques...</div>;

            return (
                <div className="animate__animated animate__fadeIn">
                    <h2 className="text-2xl font-bold mb-8">Tableau de Bord Analytique</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover">
                            <div className="text-gray-400 text-sm uppercase font-semibold">Total Utilisateurs</div>
                            <div className="text-4xl font-bold mt-2 primary-orange">{stats.counts.profiles}</div>
                            <div className="text-xs text-gray-500 mt-1">Utilisateurs inscrits</div>
                        </div>
                        <div className="bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover">
                            <div className="text-gray-400 text-sm uppercase font-semibold">Bibliothèque</div>
                            <div className="text-4xl font-bold mt-2 text-blue-500">{stats.counts.tracks}</div>
                            <div className="text-xs text-gray-500 mt-1">Titres importés</div>
                        </div>
                        <div className="bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover">
                            <div className="text-gray-400 text-sm uppercase font-semibold">Playlists</div>
                            <div className="text-4xl font-bold mt-2 text-green-500">{stats.counts.playlists}</div>
                            <div className="text-xs text-gray-500 mt-1">Playlists créées</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold mb-6">Sources des Titres</h3>
                            <div className="chart-container">
                                <canvas ref={chartRefs.sources}></canvas>
                            </div>
                        </div>
                        <div className="bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold mb-6">Visibilité des Playlists</h3>
                            <div className="chart-container">
                                <canvas ref={chartRefs.visibility}></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg mb-10">
                        <h3 className="text-lg font-semibold mb-6">Top 5 - Titres les plus écoutés</h3>
                        <div className="chart-container" style={{ height: '250px' }}>
                            <canvas ref={chartRefs.top}></canvas>
                        </div>
                    </div>
                </div>
            );
        };

        const App = () => {
            const [status, setStatus] = useState(null);
            const [pingResult, setPingResult] = useState(null);
            const [searchQuery, setSearchQuery] = useState('burna boy');
            const [searchResults, setSearchResults] = useState([]);
            const [library, setLibrary] = useState([]);
            const [profiles, setProfiles] = useState([]);
            const [playlists, setPlaylists] = useState([]);
            const [stats, setStats] = useState(null);
            const [view, setView] = useState('status');
            const [adminKey, setAdminKey] = useState(localStorage.getItem('afrosound_admin_key') || '');
            const [isAuth, setIsAuth] = useState(false);

            useEffect(() => {
                loadStatus();
                if (adminKey) checkAuth();
            }, []);

            const checkAuth = () => {
                setIsAuth(true);
                localStorage.setItem('afrosound_admin_key', adminKey);
            };

            const adminFetch = async (url, options = {}) => {
                const sep = url.includes('?') ? '&' : '?';
                const finalUrl = url + sep + 'key=' + adminKey;
                const res = await fetch(finalUrl, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'x-admin-key': adminKey
                    }
                });
                if (res.status === 401) {
                    setIsAuth(false);
                    throw new Error('Unauthorized');
                }
                return res;
            };

            const loadStatus = async () => {
                try {
                    const res = await fetch('/api/status');
                    const data = await res.json();
                    setStatus(data);
                } catch (e) { console.error(e); }
            };

            const pingSupabase = async () => {
                setPingResult({ type: 'Supabase', message: 'En cours...' });
                try {
                    const res = await adminFetch('/api/admin/ping/supabase');
                    const data = await res.json();
                    setPingResult({ type: 'Supabase', ...data });
                } catch (e) { setPingResult({ type: 'Supabase', success: false, error: e.message }); }
            };

            const pingAudio = async (url) => {
                if (!url) return alert('Entrez une URL');
                setPingResult({ type: 'Audio', message: 'En cours...' });
                try {
                    const res = await adminFetch('/api/admin/ping/audio?url=' + encodeURIComponent(url));
                    const data = await res.json();
                    setPingResult({ type: 'Audio', ...data });
                } catch (e) { setPingResult({ type: 'Audio', success: false, error: e.message }); }
            };

            const doSearch = async () => {
                try {
                    const res = await fetch('/api/audius/search?query=' + encodeURIComponent(searchQuery));
                    const data = await res.json();
                    setSearchResults(data || []);
                    setView('search');
                } catch (e) { alert(e.message); }
            };

            const addToLibrary = async (track) => {
                try {
                    const res = await adminFetch('/api/admin/tracks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            cover_url: track.cover,
                            audio_url: track.audioUrl,
                            source: track.source,
                            duration: track.duration
                        })
                    });
                    const d = await res.json();
                    if (d.success) alert('Ajouté !');
                    else alert('Erreur: ' + d.error);
                } catch (e) { alert(e.message); }
            };

            const loadLibrary = async () => {
                try {
                    const res = await fetch('/api/songs');
                    const data = await res.json();
                    setLibrary(data || []);
                    setView('library');
                } catch (e) { alert(e.message); }
            };

            const loadProfiles = async () => {
                try {
                    const res = await adminFetch('/api/admin/profiles');
                    const data = await res.json();
                    setProfiles(data.data || []);
                    setView('profiles');
                } catch (e) { alert(e.message); }
            };

            const loadPlaylists = async () => {
                try {
                    const res = await adminFetch('/api/admin/playlists');
                    const data = await res.json();
                    setPlaylists(data.data || []);
                    setView('playlists');
                } catch (e) { alert(e.message); }
            };

            const loadStats = async () => {
                try {
                    setView('stats');
                    const res = await adminFetch('/api/admin/stats');
                    const data = await res.json();
                    if (data.success) setStats(data.data);
                } catch (e) { alert(e.message); }
            };

            const deleteTrack = async (id) => {
                if (!confirm('Supprimer ce titre ?')) return;
                try {
                    await adminFetch('/api/admin/tracks/' + id, { method: 'DELETE' });
                    loadLibrary();
                } catch (e) { alert(e.message); }
            };

            const deletePlaylist = async (id) => {
                if (!confirm('Supprimer cette playlist ?')) return;
                try {
                    await adminFetch('/api/admin/playlists/' + id, { method: 'DELETE' });
                    loadPlaylists();
                } catch (e) { alert(e.message); }
            };

            if (!isAuth) {
                return (
                    <div className="min-h-screen flex items-center justify-center p-6">
                        <div className="bg-[#16191f] border border-[#262b33] p-8 rounded-2xl w-full max-w-md shadow-2xl">
                            <h1 className="text-2xl font-bold mb-2">Accès Admin</h1>
                            <p className="text-gray-400 text-sm mb-6">Veuillez entrer votre clé d'administration pour continuer.</p>
                            <input
                                type="password"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                className="w-full bg-[#0b1020] border border-[#262b33] rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-primary-orange"
                                placeholder="Clé secrète"
                            />
                            <button
                                onClick={checkAuth}
                                className="w-full bg-primary-orange text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
                            >
                                Se connecter
                            </button>
                        </div>
                    </div>
                );
            }

            return (
                <div className="min-h-screen flex flex-col">
                    <header className="border-b border-[#262b33] px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">AFRO <span className="primary-orange">SOUND</span> - Admin</h1>
                            <p className="text-gray-500 text-xs mt-1">Panel de gestion & monitoring</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { localStorage.removeItem('afrosound_admin_key'); setIsAuth(false); }} className="text-gray-500 text-xs hover:text-white mr-4">Déconnexion</button>
                            <button onClick={loadStatus} className="bg-[#222831] border border-[#262b33] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2c333d]">
                                Rafraîchir
                            </button>
                        </div>
                    </header>

                    <nav className="bg-[#16191f] border-b border-[#262b33] px-6 py-2 flex gap-4">
                        <button onClick={() => setView('status')} className={"nav-link px-3 py-1 rounded-md text-sm " + (view === 'status' ? 'bg-primary-orange text-black' : 'text-gray-400')}>Dashboard</button>
                        <button onClick={loadStats} className={"nav-link px-3 py-1 rounded-md text-sm " + (view === 'stats' ? 'bg-primary-orange text-black' : 'text-gray-400')}>Statistiques</button>
                        <button onClick={loadLibrary} className={"nav-link px-3 py-1 rounded-md text-sm " + (view === 'library' ? 'bg-primary-orange text-black' : 'text-gray-400')}>Bibliothèque</button>
                        <button onClick={loadProfiles} className={"nav-link px-3 py-1 rounded-md text-sm " + (view === 'profiles' ? 'bg-primary-orange text-black' : 'text-gray-400')}>Utilisateurs</button>
                        <button onClick={loadPlaylists} className={"nav-link px-3 py-1 rounded-md text-sm " + (view === 'playlists' ? 'bg-primary-orange text-black' : 'text-gray-400')}>Playlists</button>
                    </nav>

                    <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
                        {view === 'stats' && <StatsView stats={stats} />}

                        {view === 'status' && (
                            <div className="animate__animated animate__fadeIn">
                                <h2 className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-4">État du système</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                    <StatusCard label="Backend" value={status ? "En ligne" : "Chargement..."} state={status ? "ok" : "warn"} />
                                    <StatusCard label="Supabase" value={status?.env?.supabase ? "Configuré" : "Absent"} state={status?.env?.supabase ? "ok" : "ko"} />
                                    <StatusCard label="Audius" value={status?.audiusReachable ? "Joignable" : "Indisponible"} state={status?.audiusReachable ? "ok" : "ko"} />
                                    <StatusCard label="Node Version" value={status?.node || "---"} />
                                </div>

                                <h2 className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-4">Diagnostics</h2>
                                <div className="bg-[#16191f] border border-[#262b33] rounded-xl p-6 mb-8">
                                    <div className="flex flex-wrap gap-4 items-end">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-xs text-gray-500 mb-2">Ping Supabase</label>
                                            <button onClick={pingSupabase} className="w-full bg-primary-orange text-black font-bold py-2 rounded-lg">Tester la DB</button>
                                        </div>
                                        <div className="flex-[2] min-w-[300px]">
                                            <label className="block text-xs text-gray-500 mb-2">Ping Audio</label>
                                            <div className="flex gap-2">
                                                <input id="audio-url-input" type="text" className="flex-1 bg-[#0b1020] border border-[#262b33] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-orange" placeholder="URL du son..." />
                                                <button onClick={() => pingAudio(document.getElementById('audio-url-input').value)} className="bg-white text-black font-bold px-4 py-2 rounded-lg">Tester</button>
                                            </div>
                                        </div>
                                    </div>
                                    {pingResult && (
                                        <div className="mt-4 p-4 bg-[#0b1020] border border-[#262b33] rounded-lg">
                                            <div className="text-xs font-bold text-gray-400 mb-2">{pingResult.type} Result:</div>
                                            <pre className="text-xs overflow-auto">{JSON.stringify(pingResult, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-4">Importer des morceaux</h2>
                                <div className="bg-[#16191f] border border-[#262b33] rounded-xl p-6">
                                    <div className="flex gap-2">
                                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" className="flex-1 bg-[#0b1020] border border-[#262b33] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-orange" placeholder="Artiste, titre..." />
                                        <button onClick={doSearch} className="bg-primary-orange text-black font-bold px-6 py-2 rounded-lg">Rechercher</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'search' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Résultats Audius</h2>
                                    <button onClick={() => setView('status')} className="text-sm text-gray-400 hover:text-white">Retour</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {searchResults.map(t => (
                                        <div key={t.id} className="bg-[#16191f] border border-[#262b33] p-4 rounded-xl flex gap-4">
                                            <img src={t.cover} className="w-16 h-16 rounded-lg object-cover bg-gray-800" alt="" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate">{t.title}</div>
                                                <div className="text-sm text-gray-400 truncate">{t.artist}</div>
                                                <button onClick={() => addToLibrary(t)} className="mt-2 bg-primary-orange/20 text-primary-orange text-xs font-bold px-3 py-1 rounded-md border border-primary-orange/50 hover:bg-primary-orange/30">➕ Ajouter</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === 'library' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Bibliothèque Publique ({library.length})</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left border-b border-[#262b33]">
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Titre</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Artiste</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Source</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {library.map(t => (
                                                <tr key={t.id} className="border-b border-[#262b33] hover:bg-[#16191f]">
                                                    <td className="py-4 font-medium">{t.title}</td>
                                                    <td className="py-4 text-gray-400">{t.artist}</td>
                                                    <td className="py-4"><span className="bg-gray-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gray-400">{t.source}</span></td>
                                                    <td className="py-4">
                                                        <button onClick={() => deleteTrack(t.id)} className="text-red-500 hover:text-red-400 text-sm">Supprimer</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {view === 'profiles' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Utilisateurs ({profiles.length})</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left border-b border-[#262b33]">
                                                <th className="pb-3 text-xs text-gray-500 uppercase">ID</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Username</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Inscrit le</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profiles.map(p => (
                                                <tr key={p.id} className="border-b border-[#262b33] hover:bg-[#16191f]">
                                                    <td className="py-4 text-xs font-mono text-gray-500">{p.id}</td>
                                                    <td className="py-4 font-medium">{p.username || '---'}</td>
                                                    <td className="py-4 text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {view === 'playlists' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Playlists ({playlists.length})</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left border-b border-[#262b33]">
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Nom</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Propriétaire</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Visibilité</th>
                                                <th className="pb-3 text-xs text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {playlists.map(p => (
                                                <tr key={p.id} className="border-b border-[#262b33] hover:bg-[#16191f]">
                                                    <td className="py-4 font-medium">{p.name}</td>
                                                    <td className="py-4 text-gray-400">{p.profiles?.username || p.user_id}</td>
                                                    <td className="py-4">{p.is_public ? <span className="text-green-500 text-xs">Publique</span> : <span className="text-gray-500 text-xs">Privée</span>}</td>
                                                    <td className="py-4">
                                                        <button onClick={() => deletePlaylist(p.id)} className="text-red-500 hover:text-red-400 text-sm">Supprimer</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </main>

                    <footer className="p-6 text-center text-gray-600 text-xs border-t border-[#262b33]">
                        AFRO SOUND &copy; 2026 - Panel servi par le backend Vercel
                    </footer>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;
