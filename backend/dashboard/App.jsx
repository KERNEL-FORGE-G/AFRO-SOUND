
        const { useState, useEffect } = React;

        const StatusCard = ({ label, value, state }) => {
            const dotColor = state === 'ok' ? 'text-green-400 bg-green-400' : state === 'ko' ? 'text-red-500 bg-red-500' : 'text-orange-400 bg-orange-400';
            return (
                <div className="glass glass-hover p-4 rise">
                    <div className="text-muted text-xs uppercase tracking-widest font-display">{label}</div>
                    <div className="text-lg font-semibold mt-3 flex items-center text-cream">
                        {state && <span className={"dot w-2.5 h-2.5 rounded-full mr-2 " + dotColor}></span>}
                        {value}
                    </div>
                </div>
            );
        };

        const Equalizer = () => (
            <span className="eq" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </span>
        );

        const Emblem = () => (
            <span className="emblem" aria-hidden="true">
                <span className="ring"></span>
                <span className="ring slow"></span>
                <span className="core"></span>
            </span>
        );

        const Particles = () => (
            <div className="fx-particles" aria-hidden="true">
                {Array.from({ length: 14 }).map((_, i) => (
                    <i key={i} style={{
                        left: (i * 7 + 3) + '%',
                        animationDuration: (9 + (i % 5) * 2.5) + 's',
                        animationDelay: (i * 0.9) + 's',
                        background: i % 3 === 0 ? '#f5a524' : '#7cff4f',
                        boxShadow: '0 0 8px ' + (i % 3 === 0 ? '#f5a524' : '#7cff4f')
                    }}></i>
                ))}
            </div>
        );

        const StatsView = ({ stats }) => {
            const chartRefs = {
                sources: React.useRef(null),
                visibility: React.useRef(null),
                top: React.useRef(null),
                searches: React.useRef(null)
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
                            backgroundColor: ['#7cff4f', '#f5a524', '#34d058', '#f97316', '#f3e9ce'],
                            borderColor: '#0c150f',
                            borderWidth: 3
                        }]
                    },
                    options: { plugins: { legend: { position: 'bottom', labels: { color: '#8aa090' } } } }
                }));

                // Visibility Chart
                const visCtx = chartRefs.visibility.current.getContext('2d');
                charts.push(new Chart(visCtx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(stats.playlistVisibility),
                        datasets: [{
                            data: Object.values(stats.playlistVisibility),
                            backgroundColor: ['#34d058', '#f5a524'],
                            borderColor: '#0c150f',
                            borderWidth: 3
                        }]
                    },
                    options: { cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: '#8aa090' } } } }
                }));

                // Top Tracks
                const topCtx = chartRefs.top.current.getContext('2d');
                charts.push(new Chart(topCtx, {
                    type: 'bar',
                    data: {
                        labels: stats.topTracks.map(t => t.title.substring(0, 15) + '...'),
                        datasets: [{
                            label: 'Écoutes',
                            data: stats.topTracks.map(t => t.count),
                            backgroundColor: '#f5a524',
                            hoverBackgroundColor: '#f97316',
                            borderRadius: 8
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            x: { grid: { color: 'rgba(52,208,88,0.12)' }, ticks: { color: '#8aa090' } },
                            y: { grid: { display: false }, ticks: { color: '#8aa090' } }
                        },
                        plugins: { legend: { display: false } }
                    }
                }));

                // Top Searches
                if (stats.topSearches && chartRefs.searches.current) {
                    const searchCtx = chartRefs.searches.current.getContext('2d');
                    charts.push(new Chart(searchCtx, {
                        type: 'bar',
                        data: {
                            labels: stats.topSearches.map(s => s.query),
                            datasets: [{
                                label: 'Recherches',
                                data: stats.topSearches.map(s => s.count),
                                backgroundColor: '#34d058',
                                hoverBackgroundColor: '#7cff4f',
                                borderRadius: 8
                            }]
                        },
                        options: {
                            indexAxis: 'y',
                            scales: {
                                x: { grid: { color: 'rgba(52,208,88,0.12)' }, ticks: { color: '#8aa090' } },
                                y: { grid: { display: false }, ticks: { color: '#8aa090' } }
                            },
                            plugins: { legend: { display: false } }
                        }
                    }));
                }

                return () => {
                    charts.forEach(c => c.destroy());
                };
            }, [stats]);

            if (!stats) return <div className="text-center py-20 text-muted animate__animated animate__fadeIn">Chargement des statistiques...</div>;

            return (
                <div className="animate__animated animate__fadeIn">
                    <div className="flex items-center gap-3 mb-8">
                        <Equalizer />
                        <h2 className="text-2xl font-bold font-display neon-green">Tableau de Bord Analytique</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="glass glass-hover p-6 rise">
                            <div className="text-muted text-sm uppercase font-semibold tracking-wide">Total Utilisateurs</div>
                            <div className="text-4xl font-bold mt-2 stat-num neon-green">{stats.counts.profiles}</div>
                            <div className="text-xs text-muted mt-1">Utilisateurs inscrits</div>
                        </div>
                        <div className="glass glass-hover p-6 rise" style={{ animationDelay: '0.08s' }}>
                            <div className="text-muted text-sm uppercase font-semibold tracking-wide">Bibliothèque</div>
                            <div className="text-4xl font-bold mt-2 stat-num neon-gold">{stats.counts.tracks}</div>
                            <div className="text-xs text-muted mt-1">Titres importés</div>
                        </div>
                        <div className="glass glass-hover p-6 rise" style={{ animationDelay: '0.16s' }}>
                            <div className="text-muted text-sm uppercase font-semibold tracking-wide">Playlists</div>
                            <div className="text-4xl font-bold mt-2 stat-num neon-green">{stats.counts.playlists}</div>
                            <div className="text-xs text-muted mt-1">Playlists créées</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="glass p-6">
                            <h3 className="text-lg font-semibold mb-6 text-cream">Sources des Titres</h3>
                            <div className="chart-container">
                                <canvas ref={chartRefs.sources}></canvas>
                            </div>
                        </div>
                        <div className="glass p-6">
                            <h3 className="text-lg font-semibold mb-6 text-cream">Visibilité des Playlists</h3>
                            <div className="chart-container">
                                <canvas ref={chartRefs.visibility}></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="glass p-6">
                            <h3 className="text-lg font-semibold mb-6 text-cream">Top 5 - Titres écoutés</h3>
                            <div className="chart-container" style={{ height: '250px' }}>
                                <canvas ref={chartRefs.top}></canvas>
                            </div>
                        </div>
                        <div className="glass p-6">
                            <h3 className="text-lg font-semibold mb-6 text-cream">Top 5 - Recherches populaires</h3>
                            <div className="chart-container" style={{ height: '250px' }}>
                                <canvas ref={chartRefs.searches}></canvas>
                            </div>
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
                    <React.Fragment>
                        <div className="fx-bg"></div>
                        <div className="fx-grid"></div>
                        <div className="fx-scan"></div>
                        <Particles />
                        <div className="min-h-screen flex items-center justify-center p-6">
                            <div className="glass p-8 w-full max-w-md rise">
                                <div className="flex items-center gap-4 mb-5">
                                    <Emblem />
                                    <div>
                                        <h1 className="text-2xl font-bold font-display title-flicker">AFRO <span className="neon-green">SOUND</span></h1>
                                        <p className="text-muted text-xs uppercase tracking-[0.25em]">Accès Admin</p>
                                    </div>
                                </div>
                                <p className="text-muted text-sm mb-6">Veuillez entrer votre clé d'administration pour continuer.</p>
                                <input
                                    type="password"
                                    value={adminKey}
                                    onChange={(e) => setAdminKey(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && checkAuth()}
                                    className="inp w-full rounded-xl px-4 py-3 mb-4"
                                    placeholder="Clé secrète"
                                />
                                <button
                                    onClick={checkAuth}
                                    className="btn-primary w-full py-3 rounded-xl"
                                >
                                    Se connecter
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }

            const navItems = [
                { key: 'status', label: 'Dashboard', action: () => setView('status') },
                { key: 'stats', label: 'Statistiques', action: loadStats },
                { key: 'library', label: 'Bibliothèque', action: loadLibrary },
                { key: 'profiles', label: 'Utilisateurs', action: loadProfiles },
                { key: 'playlists', label: 'Playlists', action: loadPlaylists },
            ];

            return (
                <React.Fragment>
                    <div className="fx-bg"></div>
                    <div className="fx-grid"></div>
                    <div className="fx-scan"></div>
                    <Particles />
                    <div className="min-h-screen flex flex-col">
                        <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(6,10,7,0.55)', backdropFilter: 'blur(10px)' }}>
                            <div className="flex items-center gap-4">
                                <Emblem />
                                <div>
                                    <h1 className="text-xl font-bold font-display tracking-tight title-flicker">AFRO <span className="neon-green">SOUND</span> <span className="text-muted text-sm font-sans">/ Admin</span></h1>
                                    <p className="text-muted text-xs mt-1 tracking-wide">Panel de gestion & monitoring</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Equalizer />
                                <button onClick={() => { localStorage.removeItem('afrosound_admin_key'); setIsAuth(false); }} className="text-muted text-xs hover:text-cream mr-1">Déconnexion</button>
                                <button onClick={loadStatus} className="btn-ghost px-4 py-2 rounded-lg text-sm font-semibold">
                                    Rafraîchir
                                </button>
                            </div>
                        </header>

                        <nav className="px-6 py-3 flex gap-3 flex-wrap" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(10,20,16,0.5)' }}>
                            {navItems.map(item => (
                                <button key={item.key} onClick={item.action} className={"nav-link px-4 py-1.5 rounded-lg text-sm font-medium " + (view === item.key ? 'nav-active' : 'text-muted')}>{item.label}</button>
                            ))}
                        </nav>

                    <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
                        {view === 'stats' && <StatsView stats={stats} />}

                        {view === 'status' && (
                            <div className="animate__animated animate__fadeIn">
                                <h2 className="neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display">État du système</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                    <StatusCard label="Backend" value={status ? "En ligne" : "Chargement..."} state={status ? "ok" : "warn"} />
                                    <StatusCard label="Supabase" value={status?.env?.supabase ? "Configuré" : "Absent"} state={status?.env?.supabase ? "ok" : "ko"} />
                                    <StatusCard label="Audius" value={status?.audiusReachable ? "Joignable" : "Indisponible"} state={status?.audiusReachable ? "ok" : "ko"} />
                                    <StatusCard label="Node Version" value={status?.node || "---"} />
                                </div>

                                <div className="divider-glow mb-8"></div>

                                <h2 className="neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display">Diagnostics</h2>
                                <div className="glass p-6 mb-8">
                                    <div className="flex flex-wrap gap-4 items-end">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-xs text-muted mb-2">Ping Supabase</label>
                                            <button onClick={pingSupabase} className="btn-primary w-full py-2 rounded-lg">Tester la DB</button>
                                        </div>
                                        <div className="flex-[2] min-w-[300px]">
                                            <label className="block text-xs text-muted mb-2">Ping Audio</label>
                                            <div className="flex gap-2">
                                                <input id="audio-url-input" type="text" className="inp flex-1 rounded-lg px-3 py-2 text-sm" placeholder="URL du son..." />
                                                <button onClick={() => pingAudio(document.getElementById('audio-url-input').value)} className="btn-gold px-4 py-2 rounded-lg">Tester</button>
                                            </div>
                                        </div>
                                    </div>
                                    {pingResult && (
                                        <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(4,10,7,0.7)', border: '1px solid var(--border)' }}>
                                            <div className="text-xs font-bold neon-gold mb-2">{pingResult.type} Result:</div>
                                            <pre className="text-xs overflow-auto text-cream">{JSON.stringify(pingResult, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>

                                <h2 className="neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display">Importer des morceaux</h2>
                                <div className="glass p-6">
                                    <div className="flex gap-2">
                                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" className="inp flex-1 rounded-lg px-3 py-2 text-sm" placeholder="Artiste, titre..." />
                                        <button onClick={doSearch} className="btn-primary px-6 py-2 rounded-lg">Rechercher</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'search' && (
                            <div className="animate__animated animate__fadeIn">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold font-display neon-green">Résultats Audius</h2>
                                    <button onClick={() => setView('status')} className="btn-ghost px-3 py-1.5 rounded-lg text-sm">Retour</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {searchResults.map(t => (
                                        <div key={t.id} className="glass glass-hover p-4 flex gap-4 rise">
                                            <img src={t.cover} className="w-16 h-16 rounded-lg object-cover" style={{ background: 'var(--bg-2)' }} alt="" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate text-cream">{t.title}</div>
                                                <div className="text-sm text-muted truncate">{t.artist}</div>
                                                <button onClick={() => addToLibrary(t)} className="mt-2 text-xs font-bold px-3 py-1 rounded-md neon-green" style={{ background: 'rgba(124,255,79,0.12)', border: '1px solid var(--green)' }}>+ Ajouter</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === 'library' && (
                            <div className="animate__animated animate__fadeIn">
                                <h2 className="text-xl font-bold mb-6 font-display neon-green">Bibliothèque Publique ({library.length})</h2>
                                <div className="glass p-2 overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left" style={{ borderBottom: '1px solid var(--border)' }}>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Titre</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Artiste</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Source</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {library.map(t => (
                                                <tr key={t.id} className="tr-row" style={{ borderBottom: '1px solid rgba(52,208,88,0.08)' }}>
                                                    <td className="p-3 font-medium text-cream">{t.title}</td>
                                                    <td className="p-3 text-muted">{t.artist}</td>
                                                    <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold neon-gold" style={{ background: 'rgba(245,165,36,0.12)' }}>{t.source}</span></td>
                                                    <td className="p-3">
                                                        <button onClick={() => deleteTrack(t.id)} className="text-red-400 hover:text-red-300 text-sm">Supprimer</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {view === 'profiles' && (
                            <div className="animate__animated animate__fadeIn">
                                <h2 className="text-xl font-bold mb-6 font-display neon-green">Utilisateurs ({profiles.length})</h2>
                                <div className="glass p-2 overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left" style={{ borderBottom: '1px solid var(--border)' }}>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">ID</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Username</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Inscrit le</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profiles.map(p => (
                                                <tr key={p.id} className="tr-row" style={{ borderBottom: '1px solid rgba(52,208,88,0.08)' }}>
                                                    <td className="p-3 text-xs font-mono text-muted">{p.id}</td>
                                                    <td className="p-3 font-medium text-cream">{p.username || '---'}</td>
                                                    <td className="p-3 text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {view === 'playlists' && (
                            <div className="animate__animated animate__fadeIn">
                                <h2 className="text-xl font-bold mb-6 font-display neon-green">Playlists ({playlists.length})</h2>
                                <div className="glass p-2 overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left" style={{ borderBottom: '1px solid var(--border)' }}>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Nom</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Propriétaire</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Visibilité</th>
                                                <th className="p-3 text-xs text-muted uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {playlists.map(p => (
                                                <tr key={p.id} className="tr-row" style={{ borderBottom: '1px solid rgba(52,208,88,0.08)' }}>
                                                    <td className="p-3 font-medium text-cream">{p.name}</td>
                                                    <td className="p-3 text-muted">{p.profiles?.username || p.user_id}</td>
                                                    <td className="p-3">{p.is_public ? <span className="neon-green text-xs font-semibold">Publique</span> : <span className="text-muted text-xs">Privée</span>}</td>
                                                    <td className="p-3">
                                                        <button onClick={() => deletePlaylist(p.id)} className="text-red-400 hover:text-red-300 text-sm">Supprimer</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        </main>

                        <footer className="p-6 text-center text-muted text-xs" style={{ borderTop: '1px solid var(--border)' }}>
                            <span className="neon-green font-display">AFRO SOUND</span> &copy; 2026 — Panel servi par le backend Vercel
                        </footer>
                    </div>
                </React.Fragment>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
