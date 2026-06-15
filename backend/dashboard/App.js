const {useState, useEffect} = React;
const StatusCard = ({label, value, state}) => {
  const dotColor =
    state === 'ok'
      ? 'bg-green-500'
      : state === 'ko'
      ? 'bg-red-500'
      : 'bg-orange-500';
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: 'bg-[#16191f] border border-[#262b33] rounded-xl p-4',
    },
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'text-gray-400 text-xs uppercase tracking-wider',
      },
      label,
    ),
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'text-lg font-semibold mt-2 flex items-center',
      },
      state &&
        /*#__PURE__*/ React.createElement('span', {
          className: 'w-2.5 h-2.5 rounded-full mr-2 ' + dotColor,
        }),
      value,
    ),
  );
};
const StatsView = ({stats}) => {
  const chartRefs = {
    sources: React.useRef(null),
    visibility: React.useRef(null),
    top: React.useRef(null),
    searches: React.useRef(null),
  };
  useEffect(() => {
    if (!stats) {
      return;
    }
    const charts = [];

    // Sources Chart
    const sourceCtx = chartRefs.sources.current.getContext('2d');
    charts.push(
      new Chart(sourceCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(stats.trackSources),
          datasets: [
            {
              data: Object.values(stats.trackSources),
              backgroundColor: [
                '#F97316',
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#6366f1',
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#9ca3af',
              },
            },
          },
        },
      }),
    );

    // Visibility Chart
    const visCtx = chartRefs.visibility.current.getContext('2d');
    charts.push(
      new Chart(visCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(stats.playlistVisibility),
          datasets: [
            {
              data: Object.values(stats.playlistVisibility),
              backgroundColor: ['#10b981', '#ef4444'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#9ca3af',
              },
            },
          },
        },
      }),
    );

    // Top Tracks
    const topCtx = chartRefs.top.current.getContext('2d');
    charts.push(
      new Chart(topCtx, {
        type: 'bar',
        data: {
          labels: stats.topTracks.map(t => t.title.substring(0, 15) + '...'),
          datasets: [
            {
              label: 'Écoutes',
              data: stats.topTracks.map(t => t.count),
              backgroundColor: '#F97316',
              borderRadius: 8,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              grid: {
                color: '#262b33',
              },
              ticks: {
                color: '#9ca3af',
              },
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#9ca3af',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      }),
    );

    // Top Searches
    if (stats.topSearches && chartRefs.searches.current) {
      const searchCtx = chartRefs.searches.current.getContext('2d');
      charts.push(
        new Chart(searchCtx, {
          type: 'bar',
          data: {
            labels: stats.topSearches.map(s => s.query),
            datasets: [
              {
                label: 'Recherches',
                data: stats.topSearches.map(s => s.count),
                backgroundColor: '#10b981',
                borderRadius: 8,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            scales: {
              x: {
                grid: {
                  color: '#262b33',
                },
                ticks: {
                  color: '#9ca3af',
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#9ca3af',
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        }),
      );
    }
    return () => {
      charts.forEach(c => c.destroy());
    };
  }, [stats]);
  if (!stats) {
    return /*#__PURE__*/ React.createElement(
      'div',
      {
        className:
          'text-center py-20 text-gray-500 animate__animated animate__fadeIn',
      },
      'Chargement des statistiques...',
    );
  }
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: 'animate__animated animate__fadeIn',
    },
    /*#__PURE__*/ React.createElement(
      'h2',
      {
        className: 'text-2xl font-bold mb-8',
      },
      'Tableau de Bord Analytique',
    ),
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-10',
      },
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover',
        },
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-gray-400 text-sm uppercase font-semibold',
          },
          'Total Utilisateurs',
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-4xl font-bold mt-2 primary-orange',
          },
          stats.counts.profiles,
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-xs text-gray-500 mt-1',
          },
          'Utilisateurs inscrits',
        ),
      ),
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover',
        },
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-gray-400 text-sm uppercase font-semibold',
          },
          'Biblioth\xE8que',
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-4xl font-bold mt-2 text-blue-500',
          },
          stats.counts.tracks,
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-xs text-gray-500 mt-1',
          },
          'Titres import\xE9s',
        ),
      ),
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover',
        },
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-gray-400 text-sm uppercase font-semibold',
          },
          'Playlists',
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-4xl font-bold mt-2 text-green-500',
          },
          stats.counts.playlists,
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'text-xs text-gray-500 mt-1',
          },
          'Playlists cr\xE9\xE9es',
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-10',
      },
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg',
        },
        /*#__PURE__*/ React.createElement(
          'h3',
          {
            className: 'text-lg font-semibold mb-6',
          },
          'Sources des Titres',
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'chart-container',
          },
          /*#__PURE__*/ React.createElement('canvas', {
            ref: chartRefs.sources,
          }),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg',
        },
        /*#__PURE__*/ React.createElement(
          'h3',
          {
            className: 'text-lg font-semibold mb-6',
          },
          'Visibilit\xE9 des Playlists',
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'chart-container',
          },
          /*#__PURE__*/ React.createElement('canvas', {
            ref: chartRefs.visibility,
          }),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-10',
      },
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg',
        },
        /*#__PURE__*/ React.createElement(
          'h3',
          {
            className: 'text-lg font-semibold mb-6',
          },
          'Top 5 - Titres \xE9cout\xE9s',
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'chart-container',
            style: {
              height: '250px',
            },
          },
          /*#__PURE__*/ React.createElement('canvas', {
            ref: chartRefs.top,
          }),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg',
        },
        /*#__PURE__*/ React.createElement(
          'h3',
          {
            className: 'text-lg font-semibold mb-6',
          },
          'Top 5 - Recherches populaires',
        ),
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'chart-container',
            style: {
              height: '250px',
            },
          },
          /*#__PURE__*/ React.createElement('canvas', {
            ref: chartRefs.searches,
          }),
        ),
      ),
    ),
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
  const [adminKey, setAdminKey] = useState(
    localStorage.getItem('afrosound_admin_key') || '',
  );
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    loadStatus();
    if (adminKey) {
      checkAuth();
    }
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
        'x-admin-key': adminKey,
      },
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
    } catch (e) {
      console.error(e);
    }
  };
  const pingSupabase = async () => {
    setPingResult({
      type: 'Supabase',
      message: 'En cours...',
    });
    try {
      const res = await adminFetch('/api/admin/ping/supabase');
      const data = await res.json();
      setPingResult({
        type: 'Supabase',
        ...data,
      });
    } catch (e) {
      setPingResult({
        type: 'Supabase',
        success: false,
        error: e.message,
      });
    }
  };
  const pingAudio = async url => {
    if (!url) {
      return alert('Entrez une URL');
    }
    setPingResult({
      type: 'Audio',
      message: 'En cours...',
    });
    try {
      const res = await adminFetch(
        '/api/admin/ping/audio?url=' + encodeURIComponent(url),
      );
      const data = await res.json();
      setPingResult({
        type: 'Audio',
        ...data,
      });
    } catch (e) {
      setPingResult({
        type: 'Audio',
        success: false,
        error: e.message,
      });
    }
  };
  const doSearch = async () => {
    try {
      const res = await fetch(
        '/api/audius/search?query=' + encodeURIComponent(searchQuery),
      );
      const data = await res.json();
      setSearchResults(data || []);
      setView('search');
    } catch (e) {
      alert(e.message);
    }
  };
  const addToLibrary = async track => {
    try {
      const res = await adminFetch('/api/admin/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: track.id,
          title: track.title,
          artist: track.artist,
          cover_url: track.cover,
          audio_url: track.audioUrl,
          source: track.source,
          duration: track.duration,
        }),
      });
      const d = await res.json();
      if (d.success) {
        alert('Ajouté !');
      } else {
        alert('Erreur: ' + d.error);
      }
    } catch (e) {
      alert(e.message);
    }
  };
  const loadLibrary = async () => {
    try {
      const res = await fetch('/api/songs');
      const data = await res.json();
      setLibrary(data || []);
      setView('library');
    } catch (e) {
      alert(e.message);
    }
  };
  const loadProfiles = async () => {
    try {
      const res = await adminFetch('/api/admin/profiles');
      const data = await res.json();
      setProfiles(data.data || []);
      setView('profiles');
    } catch (e) {
      alert(e.message);
    }
  };
  const loadPlaylists = async () => {
    try {
      const res = await adminFetch('/api/admin/playlists');
      const data = await res.json();
      setPlaylists(data.data || []);
      setView('playlists');
    } catch (e) {
      alert(e.message);
    }
  };
  const loadStats = async () => {
    try {
      setView('stats');
      const res = await adminFetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (e) {
      alert(e.message);
    }
  };
  const deleteTrack = async id => {
    if (!confirm('Supprimer ce titre ?')) {
      return;
    }
    try {
      await adminFetch('/api/admin/tracks/' + id, {
        method: 'DELETE',
      });
      loadLibrary();
    } catch (e) {
      alert(e.message);
    }
  };
  const deletePlaylist = async id => {
    if (!confirm('Supprimer cette playlist ?')) {
      return;
    }
    try {
      await adminFetch('/api/admin/playlists/' + id, {
        method: 'DELETE',
      });
      loadPlaylists();
    } catch (e) {
      alert(e.message);
    }
  };
  if (!isAuth) {
    return /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'min-h-screen flex items-center justify-center p-6',
      },
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className:
            'bg-[#16191f] border border-[#262b33] p-8 rounded-2xl w-full max-w-md shadow-2xl',
        },
        /*#__PURE__*/ React.createElement(
          'h1',
          {
            className: 'text-2xl font-bold mb-2',
          },
          'Acc\xE8s Admin',
        ),
        /*#__PURE__*/ React.createElement(
          'p',
          {
            className: 'text-gray-400 text-sm mb-6',
          },
          "Veuillez entrer votre cl\xE9 d'administration pour continuer.",
        ),
        /*#__PURE__*/ React.createElement('input', {
          type: 'password',
          value: adminKey,
          onChange: e => setAdminKey(e.target.value),
          className:
            'w-full bg-[#0b1020] border border-[#262b33] rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-primary-orange',
          placeholder: 'Cl\xE9 secr\xE8te',
        }),
        /*#__PURE__*/ React.createElement(
          'button',
          {
            onClick: checkAuth,
            className:
              'w-full bg-primary-orange text-black font-bold py-3 rounded-xl hover:opacity-90 transition',
          },
          'Se connecter',
        ),
      ),
    );
  }
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: 'min-h-screen flex flex-col',
    },
    /*#__PURE__*/ React.createElement(
      'header',
      {
        className:
          'border-b border-[#262b33] px-6 py-4 flex items-center justify-between',
      },
      /*#__PURE__*/ React.createElement(
        'div',
        null,
        /*#__PURE__*/ React.createElement(
          'h1',
          {
            className: 'text-xl font-bold tracking-tight',
          },
          'AFRO ',
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'primary-orange',
            },
            'SOUND',
          ),
          ' - Admin',
        ),
        /*#__PURE__*/ React.createElement(
          'p',
          {
            className: 'text-gray-500 text-xs mt-1',
          },
          'Panel de gestion & monitoring',
        ),
      ),
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className: 'flex gap-2',
        },
        /*#__PURE__*/ React.createElement(
          'button',
          {
            onClick: () => {
              localStorage.removeItem('afrosound_admin_key');
              setIsAuth(false);
            },
            className: 'text-gray-500 text-xs hover:text-white mr-4',
          },
          'D\xE9connexion',
        ),
        /*#__PURE__*/ React.createElement(
          'button',
          {
            onClick: loadStatus,
            className:
              'bg-[#222831] border border-[#262b33] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2c333d]',
          },
          'Rafra\xEEchir',
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      'nav',
      {
        className:
          'bg-[#16191f] border-b border-[#262b33] px-6 py-2 flex gap-4',
      },
      /*#__PURE__*/ React.createElement(
        'button',
        {
          onClick: () => setView('status'),
          className:
            'nav-link px-3 py-1 rounded-md text-sm ' +
            (view === 'status'
              ? 'bg-primary-orange text-black'
              : 'text-gray-400'),
        },
        'Dashboard',
      ),
      /*#__PURE__*/ React.createElement(
        'button',
        {
          onClick: loadStats,
          className:
            'nav-link px-3 py-1 rounded-md text-sm ' +
            (view === 'stats'
              ? 'bg-primary-orange text-black'
              : 'text-gray-400'),
        },
        'Statistiques',
      ),
      /*#__PURE__*/ React.createElement(
        'button',
        {
          onClick: loadLibrary,
          className:
            'nav-link px-3 py-1 rounded-md text-sm ' +
            (view === 'library'
              ? 'bg-primary-orange text-black'
              : 'text-gray-400'),
        },
        'Biblioth\xE8que',
      ),
      /*#__PURE__*/ React.createElement(
        'button',
        {
          onClick: loadProfiles,
          className:
            'nav-link px-3 py-1 rounded-md text-sm ' +
            (view === 'profiles'
              ? 'bg-primary-orange text-black'
              : 'text-gray-400'),
        },
        'Utilisateurs',
      ),
      /*#__PURE__*/ React.createElement(
        'button',
        {
          onClick: loadPlaylists,
          className:
            'nav-link px-3 py-1 rounded-md text-sm ' +
            (view === 'playlists'
              ? 'bg-primary-orange text-black'
              : 'text-gray-400'),
        },
        'Playlists',
      ),
    ),
    /*#__PURE__*/ React.createElement(
      'main',
      {
        className: 'flex-1 p-6 max-w-6xl mx-auto w-full',
      },
      view === 'stats' &&
        /*#__PURE__*/ React.createElement(StatsView, {
          stats: stats,
        }),
      view === 'status' &&
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'animate__animated animate__fadeIn',
          },
          /*#__PURE__*/ React.createElement(
            'h2',
            {
              className:
                'text-gray-500 text-xs uppercase font-bold tracking-widest mb-4',
            },
            '\xC9tat du syst\xE8me',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-8',
            },
            /*#__PURE__*/ React.createElement(StatusCard, {
              label: 'Backend',
              value: status ? 'En ligne' : 'Chargement...',
              state: status ? 'ok' : 'warn',
            }),
            /*#__PURE__*/ React.createElement(StatusCard, {
              label: 'Supabase',
              value: status?.env?.supabase ? 'Configuré' : 'Absent',
              state: status?.env?.supabase ? 'ok' : 'ko',
            }),
            /*#__PURE__*/ React.createElement(StatusCard, {
              label: 'Audius',
              value: status?.audiusReachable ? 'Joignable' : 'Indisponible',
              state: status?.audiusReachable ? 'ok' : 'ko',
            }),
            /*#__PURE__*/ React.createElement(StatusCard, {
              label: 'Node Version',
              value: status?.node || '---',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            'h2',
            {
              className:
                'text-gray-500 text-xs uppercase font-bold tracking-widest mb-4',
            },
            'Diagnostics',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className:
                'bg-[#16191f] border border-[#262b33] rounded-xl p-6 mb-8',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'flex flex-wrap gap-4 items-end',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'flex-1 min-w-[200px]',
                },
                /*#__PURE__*/ React.createElement(
                  'label',
                  {
                    className: 'block text-xs text-gray-500 mb-2',
                  },
                  'Ping Supabase',
                ),
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    onClick: pingSupabase,
                    className:
                      'w-full bg-primary-orange text-black font-bold py-2 rounded-lg',
                  },
                  'Tester la DB',
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'flex-[2] min-w-[300px]',
                },
                /*#__PURE__*/ React.createElement(
                  'label',
                  {
                    className: 'block text-xs text-gray-500 mb-2',
                  },
                  'Ping Audio',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'flex gap-2',
                  },
                  /*#__PURE__*/ React.createElement('input', {
                    id: 'audio-url-input',
                    type: 'text',
                    className:
                      'flex-1 bg-[#0b1020] border border-[#262b33] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-orange',
                    placeholder: 'URL du son...',
                  }),
                  /*#__PURE__*/ React.createElement(
                    'button',
                    {
                      onClick: () =>
                        pingAudio(
                          document.getElementById('audio-url-input').value,
                        ),
                      className:
                        'bg-white text-black font-bold px-4 py-2 rounded-lg',
                    },
                    'Tester',
                  ),
                ),
              ),
            ),
            pingResult &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className:
                    'mt-4 p-4 bg-[#0b1020] border border-[#262b33] rounded-lg',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'text-xs font-bold text-gray-400 mb-2',
                  },
                  pingResult.type,
                  ' Result:',
                ),
                /*#__PURE__*/ React.createElement(
                  'pre',
                  {
                    className: 'text-xs overflow-auto',
                  },
                  JSON.stringify(pingResult, null, 2),
                ),
              ),
          ),
          /*#__PURE__*/ React.createElement(
            'h2',
            {
              className:
                'text-gray-500 text-xs uppercase font-bold tracking-widest mb-4',
            },
            'Importer des morceaux',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'bg-[#16191f] border border-[#262b33] rounded-xl p-6',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'flex gap-2',
              },
              /*#__PURE__*/ React.createElement('input', {
                value: searchQuery,
                onChange: e => setSearchQuery(e.target.value),
                type: 'text',
                className:
                  'flex-1 bg-[#0b1020] border border-[#262b33] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-orange',
                placeholder: 'Artiste, titre...',
              }),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  onClick: doSearch,
                  className:
                    'bg-primary-orange text-black font-bold px-6 py-2 rounded-lg',
                },
                'Rechercher',
              ),
            ),
          ),
        ),
      view === 'search' &&
        /*#__PURE__*/ React.createElement(
          'div',
          null,
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'flex items-center justify-between mb-6',
            },
            /*#__PURE__*/ React.createElement(
              'h2',
              {
                className: 'text-xl font-bold',
              },
              'R\xE9sultats Audius',
            ),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                onClick: () => setView('status'),
                className: 'text-sm text-gray-400 hover:text-white',
              },
              'Retour',
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
            },
            searchResults.map(t =>
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  key: t.id,
                  className:
                    'bg-[#16191f] border border-[#262b33] p-4 rounded-xl flex gap-4',
                },
                /*#__PURE__*/ React.createElement('img', {
                  src: t.cover,
                  className: 'w-16 h-16 rounded-lg object-cover bg-gray-800',
                  alt: '',
                }),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'flex-1 min-w-0',
                  },
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'font-semibold truncate',
                    },
                    t.title,
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'text-sm text-gray-400 truncate',
                    },
                    t.artist,
                  ),
                  /*#__PURE__*/ React.createElement(
                    'button',
                    {
                      onClick: () => addToLibrary(t),
                      className:
                        'mt-2 bg-primary-orange/20 text-primary-orange text-xs font-bold px-3 py-1 rounded-md border border-primary-orange/50 hover:bg-primary-orange/30',
                    },
                    '\u2795 Ajouter',
                  ),
                ),
              ),
            ),
          ),
        ),
      view === 'library' &&
        /*#__PURE__*/ React.createElement(
          'div',
          null,
          /*#__PURE__*/ React.createElement(
            'h2',
            {
              className: 'text-xl font-bold mb-6',
            },
            'Biblioth\xE8que Publique (',
            library.length,
            ')',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'overflow-x-auto',
            },
            /*#__PURE__*/ React.createElement(
              'table',
              {
                className: 'w-full',
              },
              /*#__PURE__*/ React.createElement(
                'thead',
                null,
                /*#__PURE__*/ React.createElement(
                  'tr',
                  {
                    className: 'text-left border-b border-[#262b33]',
                  },
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Titre',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Artiste',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Source',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Actions',
                  ),
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'tbody',
                null,
                library.map(t =>
                  /*#__PURE__*/ React.createElement(
                    'tr',
                    {
                      key: t.id,
                      className: 'border-b border-[#262b33] hover:bg-[#16191f]',
                    },
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4 font-medium',
                      },
                      t.title,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4 text-gray-400',
                      },
                      t.artist,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4',
                      },
                      /*#__PURE__*/ React.createElement(
                        'span',
                        {
                          className:
                            'bg-gray-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gray-400',
                        },
                        t.source,
                      ),
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4',
                      },
                      /*#__PURE__*/ React.createElement(
                        'button',
                        {
                          onClick: () => deleteTrack(t.id),
                          className: 'text-red-500 hover:text-red-400 text-sm',
                        },
                        'Supprimer',
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      view === 'profiles' &&
        /*#__PURE__*/ React.createElement(
          'div',
          null,
          /*#__PURE__*/ React.createElement(
            'h2',
            {
              className: 'text-xl font-bold mb-6',
            },
            'Utilisateurs (',
            profiles.length,
            ')',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'overflow-x-auto',
            },
            /*#__PURE__*/ React.createElement(
              'table',
              {
                className: 'w-full',
              },
              /*#__PURE__*/ React.createElement(
                'thead',
                null,
                /*#__PURE__*/ React.createElement(
                  'tr',
                  {
                    className: 'text-left border-b border-[#262b33]',
                  },
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'ID',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Username',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Inscrit le',
                  ),
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'tbody',
                null,
                profiles.map(p =>
                  /*#__PURE__*/ React.createElement(
                    'tr',
                    {
                      key: p.id,
                      className: 'border-b border-[#262b33] hover:bg-[#16191f]',
                    },
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4 text-xs font-mono text-gray-500',
                      },
                      p.id,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4 font-medium',
                      },
                      p.username || '---',
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4 text-gray-400',
                      },
                      new Date(p.created_at).toLocaleDateString(),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      view === 'playlists' &&
        /*#__PURE__*/ React.createElement(
          'div',
          null,
          /*#__PURE__*/ React.createElement(
            'h2',
            {
              className: 'text-xl font-bold mb-6',
            },
            'Playlists (',
            playlists.length,
            ')',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'overflow-x-auto',
            },
            /*#__PURE__*/ React.createElement(
              'table',
              {
                className: 'w-full',
              },
              /*#__PURE__*/ React.createElement(
                'thead',
                null,
                /*#__PURE__*/ React.createElement(
                  'tr',
                  {
                    className: 'text-left border-b border-[#262b33]',
                  },
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Nom',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Propri\xE9taire',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Visibilit\xE9',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'th',
                    {
                      className: 'pb-3 text-xs text-gray-500 uppercase',
                    },
                    'Actions',
                  ),
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'tbody',
                null,
                playlists.map(p =>
                  /*#__PURE__*/ React.createElement(
                    'tr',
                    {
                      key: p.id,
                      className: 'border-b border-[#262b33] hover:bg-[#16191f]',
                    },
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4 font-medium',
                      },
                      p.name,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4 text-gray-400',
                      },
                      p.profiles?.username || p.user_id,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4',
                      },
                      p.is_public
                        ? /*#__PURE__*/ React.createElement(
                            'span',
                            {
                              className: 'text-green-500 text-xs',
                            },
                            'Publique',
                          )
                        : /*#__PURE__*/ React.createElement(
                            'span',
                            {
                              className: 'text-gray-500 text-xs',
                            },
                            'Priv\xE9e',
                          ),
                    ),
                    /*#__PURE__*/ React.createElement(
                      'td',
                      {
                        className: 'py-4',
                      },
                      /*#__PURE__*/ React.createElement(
                        'button',
                        {
                          onClick: () => deletePlaylist(p.id),
                          className: 'text-red-500 hover:text-red-400 text-sm',
                        },
                        'Supprimer',
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
    ),
    /*#__PURE__*/ React.createElement(
      'footer',
      {
        className:
          'p-6 text-center text-gray-600 text-xs border-t border-[#262b33]',
      },
      'AFRO SOUND \xA9 2026 - Panel servi par le backend Vercel',
    ),
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/ React.createElement(App, null));
