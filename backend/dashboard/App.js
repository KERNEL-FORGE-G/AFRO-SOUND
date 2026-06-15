const {
  useState,
  useEffect
} = React;
const StatusCard = ({
  label,
  value,
  state
}) => {
  const dotColor = state === 'ok' ? 'text-green-400 bg-green-400' : state === 'ko' ? 'text-red-500 bg-red-500' : 'text-orange-400 bg-orange-400';
  return /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-4 rise"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-xs uppercase tracking-widest font-display"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold mt-3 flex items-center text-cream"
  }, state && /*#__PURE__*/React.createElement("span", {
    className: "dot w-2.5 h-2.5 rounded-full mr-2 " + dotColor
  }), value));
};
const Equalizer = () => /*#__PURE__*/React.createElement("span", {
  className: "eq",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null));
const Emblem = () => /*#__PURE__*/React.createElement("span", {
  className: "emblem",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("span", {
  className: "ring"
}), /*#__PURE__*/React.createElement("span", {
  className: "ring slow"
}), /*#__PURE__*/React.createElement("span", {
  className: "core"
}));
const Particles = () => /*#__PURE__*/React.createElement("div", {
  className: "fx-particles",
  "aria-hidden": "true"
}, Array.from({
  length: 14
}).map((_, i) => /*#__PURE__*/React.createElement("i", {
  key: i,
  style: {
    left: i * 7 + 3 + '%',
    animationDuration: 9 + i % 5 * 2.5 + 's',
    animationDelay: i * 0.9 + 's',
    background: i % 3 === 0 ? '#f5a524' : '#7cff4f',
    boxShadow: '0 0 8px ' + (i % 3 === 0 ? '#f5a524' : '#7cff4f')
  }
})));
const StatsView = ({
  stats
}) => {
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
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#8aa090'
            }
          }
        }
      }
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
      options: {
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#8aa090'
            }
          }
        }
      }
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
          x: {
            grid: {
              color: 'rgba(52,208,88,0.12)'
            },
            ticks: {
              color: '#8aa090'
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#8aa090'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
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
            x: {
              grid: {
                color: 'rgba(52,208,88,0.12)'
              },
              ticks: {
                color: '#8aa090'
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                color: '#8aa090'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }));
    }
    return () => {
      charts.forEach(c => c.destroy());
    };
  }, [stats]);
  if (!stats) return /*#__PURE__*/React.createElement("div", {
    className: "text-center py-20 text-muted animate__animated animate__fadeIn"
  }, "Chargement des statistiques...");
  return /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-8"
  }, /*#__PURE__*/React.createElement(Equalizer, null), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold font-display neon-green"
  }, "Tableau de Bord Analytique")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-6 rise"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-sm uppercase font-semibold tracking-wide"
  }, "Total Utilisateurs"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 stat-num neon-green"
  }, stats.counts.profiles), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted mt-1"
  }, "Utilisateurs inscrits")), /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-6 rise",
    style: {
      animationDelay: '0.08s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-sm uppercase font-semibold tracking-wide"
  }, "Biblioth\xE8que"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 stat-num neon-gold"
  }, stats.counts.tracks), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted mt-1"
  }, "Titres import\xE9s")), /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-6 rise",
    style: {
      animationDelay: '0.16s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-sm uppercase font-semibold tracking-wide"
  }, "Playlists"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 stat-num neon-green"
  }, stats.counts.playlists), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted mt-1"
  }, "Playlists cr\xE9\xE9es"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Sources des Titres"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.sources
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Visibilit\xE9 des Playlists"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.visibility
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Top 5 - Titres \xE9cout\xE9s"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container",
    style: {
      height: '250px'
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.top
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Top 5 - Recherches populaires"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container",
    style: {
      height: '250px'
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.searches
  })))));
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
    } catch (e) {
      console.error(e);
    }
  };
  const pingSupabase = async () => {
    setPingResult({
      type: 'Supabase',
      message: 'En cours...'
    });
    try {
      const res = await adminFetch('/api/admin/ping/supabase');
      const data = await res.json();
      setPingResult({
        type: 'Supabase',
        ...data
      });
    } catch (e) {
      setPingResult({
        type: 'Supabase',
        success: false,
        error: e.message
      });
    }
  };
  const pingAudio = async url => {
    if (!url) return alert('Entrez une URL');
    setPingResult({
      type: 'Audio',
      message: 'En cours...'
    });
    try {
      const res = await adminFetch('/api/admin/ping/audio?url=' + encodeURIComponent(url));
      const data = await res.json();
      setPingResult({
        type: 'Audio',
        ...data
      });
    } catch (e) {
      setPingResult({
        type: 'Audio',
        success: false,
        error: e.message
      });
    }
  };
  const doSearch = async () => {
    try {
      const res = await fetch('/api/audius/search?query=' + encodeURIComponent(searchQuery));
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
          'Content-Type': 'application/json'
        },
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
      if (d.success) alert('Ajouté !');else alert('Erreur: ' + d.error);
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
      if (data.success) setStats(data.data);
    } catch (e) {
      alert(e.message);
    }
  };
  const deleteTrack = async id => {
    if (!confirm('Supprimer ce titre ?')) return;
    try {
      await adminFetch('/api/admin/tracks/' + id, {
        method: 'DELETE'
      });
      loadLibrary();
    } catch (e) {
      alert(e.message);
    }
  };
  const deletePlaylist = async id => {
    if (!confirm('Supprimer cette playlist ?')) return;
    try {
      await adminFetch('/api/admin/playlists/' + id, {
        method: 'DELETE'
      });
      loadPlaylists();
    } catch (e) {
      alert(e.message);
    }
  };
  if (!isAuth) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "fx-bg"
    }), /*#__PURE__*/React.createElement("div", {
      className: "fx-grid"
    }), /*#__PURE__*/React.createElement("div", {
      className: "fx-scan"
    }), /*#__PURE__*/React.createElement(Particles, null), /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen flex items-center justify-center p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "glass p-8 w-full max-w-md rise"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 mb-5"
    }, /*#__PURE__*/React.createElement(Emblem, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl font-bold font-display title-flicker"
    }, "AFRO ", /*#__PURE__*/React.createElement("span", {
      className: "neon-green"
    }, "SOUND")), /*#__PURE__*/React.createElement("p", {
      className: "text-muted text-xs uppercase tracking-[0.25em]"
    }, "Acc\xE8s Admin"))), /*#__PURE__*/React.createElement("p", {
      className: "text-muted text-sm mb-6"
    }, "Veuillez entrer votre cl\xE9 d'administration pour continuer."), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: adminKey,
      onChange: e => setAdminKey(e.target.value),
      onKeyDown: e => e.key === 'Enter' && checkAuth(),
      className: "inp w-full rounded-xl px-4 py-3 mb-4",
      placeholder: "Cl\xE9 secr\xE8te"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: checkAuth,
      className: "btn-primary w-full py-3 rounded-xl"
    }, "Se connecter"))));
  }
  const navItems = [{
    key: 'status',
    label: 'Dashboard',
    action: () => setView('status')
  }, {
    key: 'stats',
    label: 'Statistiques',
    action: loadStats
  }, {
    key: 'library',
    label: 'Bibliothèque',
    action: loadLibrary
  }, {
    key: 'profiles',
    label: 'Utilisateurs',
    action: loadProfiles
  }, {
    key: 'playlists',
    label: 'Playlists',
    action: loadPlaylists
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "fx-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fx-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fx-scan"
  }), /*#__PURE__*/React.createElement(Particles, null), /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement("header", {
    className: "px-6 py-4 flex items-center justify-between",
    style: {
      borderBottom: '1px solid var(--border)',
      background: 'rgba(6,10,7,0.55)',
      backdropFilter: 'blur(10px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement(Emblem, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-bold font-display tracking-tight title-flicker"
  }, "AFRO ", /*#__PURE__*/React.createElement("span", {
    className: "neon-green"
  }, "SOUND"), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-muted text-sm font-sans"
  }, "/ Admin")), /*#__PURE__*/React.createElement("p", {
    className: "text-muted text-xs mt-1 tracking-wide"
  }, "Panel de gestion & monitoring"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Equalizer, null), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      localStorage.removeItem('afrosound_admin_key');
      setIsAuth(false);
    },
    className: "text-muted text-xs hover:text-cream mr-1"
  }, "D\xE9connexion"), /*#__PURE__*/React.createElement("button", {
    onClick: loadStatus,
    className: "btn-ghost px-4 py-2 rounded-lg text-sm font-semibold"
  }, "Rafra\xEEchir"))), /*#__PURE__*/React.createElement("nav", {
    className: "px-6 py-3 flex gap-3 flex-wrap",
    style: {
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,20,16,0.5)'
    }
  }, navItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.key,
    onClick: item.action,
    className: "nav-link px-4 py-1.5 rounded-lg text-sm font-medium " + (view === item.key ? 'nav-active' : 'text-muted')
  }, item.label))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 p-6 max-w-6xl mx-auto w-full"
  }, view === 'stats' && /*#__PURE__*/React.createElement(StatsView, {
    stats: stats
  }), view === 'status' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display"
  }, "\xC9tat du syst\xE8me"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(StatusCard, {
    label: "Backend",
    value: status ? "En ligne" : "Chargement...",
    state: status ? "ok" : "warn"
  }), /*#__PURE__*/React.createElement(StatusCard, {
    label: "Supabase",
    value: status?.env?.supabase ? "Configuré" : "Absent",
    state: status?.env?.supabase ? "ok" : "ko"
  }), /*#__PURE__*/React.createElement(StatusCard, {
    label: "Audius",
    value: status?.audiusReachable ? "Joignable" : "Indisponible",
    state: status?.audiusReachable ? "ok" : "ko"
  }), /*#__PURE__*/React.createElement(StatusCard, {
    label: "Node Version",
    value: status?.node || "---"
  })), /*#__PURE__*/React.createElement("div", {
    className: "divider-glow mb-8"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display"
  }, "Diagnostics"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-4 items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-[200px]"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-muted mb-2"
  }, "Ping Supabase"), /*#__PURE__*/React.createElement("button", {
    onClick: pingSupabase,
    className: "btn-primary w-full py-2 rounded-lg"
  }, "Tester la DB")), /*#__PURE__*/React.createElement("div", {
    className: "flex-[2] min-w-[300px]"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-muted mb-2"
  }, "Ping Audio"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    id: "audio-url-input",
    type: "text",
    className: "inp flex-1 rounded-lg px-3 py-2 text-sm",
    placeholder: "URL du son..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => pingAudio(document.getElementById('audio-url-input').value),
    className: "btn-gold px-4 py-2 rounded-lg"
  }, "Tester")))), pingResult && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-4 rounded-lg",
    style: {
      background: 'rgba(4,10,7,0.7)',
      border: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold neon-gold mb-2"
  }, pingResult.type, " Result:"), /*#__PURE__*/React.createElement("pre", {
    className: "text-xs overflow-auto text-cream"
  }, JSON.stringify(pingResult, null, 2)))), /*#__PURE__*/React.createElement("h2", {
    className: "neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display"
  }, "Importer des morceaux"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    type: "text",
    className: "inp flex-1 rounded-lg px-3 py-2 text-sm",
    placeholder: "Artiste, titre..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: doSearch,
    className: "btn-primary px-6 py-2 rounded-lg"
  }, "Rechercher")))), view === 'search' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold font-display neon-green"
  }, "R\xE9sultats Audius"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView('status'),
    className: "btn-ghost px-3 py-1.5 rounded-lg text-sm"
  }, "Retour")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, searchResults.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "glass glass-hover p-4 flex gap-4 rise"
  }, /*#__PURE__*/React.createElement("img", {
    src: t.cover,
    className: "w-16 h-16 rounded-lg object-cover",
    style: {
      background: 'var(--bg-2)'
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold truncate text-cream"
  }, t.title), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted truncate"
  }, t.artist), /*#__PURE__*/React.createElement("button", {
    onClick: () => addToLibrary(t),
    className: "mt-2 text-xs font-bold px-3 py-1 rounded-md neon-green",
    style: {
      background: 'rgba(124,255,79,0.12)',
      border: '1px solid var(--green)'
    }
  }, "+ Ajouter")))))), view === 'library' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6 font-display neon-green"
  }, "Biblioth\xE8que Publique (", library.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-2 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left",
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Titre"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Artiste"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Source"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, library.map(t => /*#__PURE__*/React.createElement("tr", {
    key: t.id,
    className: "tr-row",
    style: {
      borderBottom: '1px solid rgba(52,208,88,0.08)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-medium text-cream"
  }, t.title), /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-muted"
  }, t.artist), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded text-[10px] uppercase font-bold neon-gold",
    style: {
      background: 'rgba(245,165,36,0.12)'
    }
  }, t.source)), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteTrack(t.id),
    className: "text-red-400 hover:text-red-300 text-sm"
  }, "Supprimer")))))))), view === 'profiles' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6 font-display neon-green"
  }, "Utilisateurs (", profiles.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-2 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left",
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "ID"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Username"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Inscrit le"))), /*#__PURE__*/React.createElement("tbody", null, profiles.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    className: "tr-row",
    style: {
      borderBottom: '1px solid rgba(52,208,88,0.08)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-xs font-mono text-muted"
  }, p.id), /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-medium text-cream"
  }, p.username || '---'), /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-muted"
  }, new Date(p.created_at).toLocaleDateString()))))))), view === 'playlists' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6 font-display neon-green"
  }, "Playlists (", playlists.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-2 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left",
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Nom"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Propri\xE9taire"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Visibilit\xE9"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, playlists.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    className: "tr-row",
    style: {
      borderBottom: '1px solid rgba(52,208,88,0.08)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-medium text-cream"
  }, p.name), /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-muted"
  }, p.profiles?.username || p.user_id), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, p.is_public ? /*#__PURE__*/React.createElement("span", {
    className: "neon-green text-xs font-semibold"
  }, "Publique") : /*#__PURE__*/React.createElement("span", {
    className: "text-muted text-xs"
  }, "Priv\xE9e")), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => deletePlaylist(p.id),
    className: "text-red-400 hover:text-red-300 text-sm"
  }, "Supprimer"))))))))), /*#__PURE__*/React.createElement("footer", {
    className: "p-6 text-center text-muted text-xs",
    style: {
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "neon-green font-display"
  }, "AFRO SOUND"), " \xA9 2026 \u2014 Panel servi par le backend Vercel")));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
