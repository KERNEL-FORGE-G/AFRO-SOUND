// Panel de surveillance + testeur d'API servi par le backend Vercel.
// HTML autonome (CSS + JS inline). Le JS client n'utilise PAS de backticks ni
// de `${}` afin de ne pas interférer avec ce template literal serveur.
module.exports = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AFRO SOUND — Panel backend</title>
<style>
  :root {
    --bg: #0d0f12; --card: #16191f; --border: #262b33; --text: #e9edf2;
    --muted: #8b94a3; --primary: #1db954; --accent: #ff7a00; --danger: #ff4d4f;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg); color: var(--text); line-height: 1.45;
  }
  header {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }
  header h1 { margin: 0; font-size: 20px; letter-spacing: .5px; }
  header h1 span { color: var(--primary); }
  header .sub { color: var(--muted); font-size: 13px; }
  main { padding: 24px; max-width: 1100px; margin: 0 auto; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin: 28px 0 12px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
  .card .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
  .card .value { font-size: 18px; font-weight: 600; margin-top: 6px; word-break: break-word; }
  .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
  .ok { background: var(--primary); } .ko { background: var(--danger); } .warn { background: var(--accent); }
  .panel { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .panel h3 { margin: 0 0 12px; font-size: 15px; }
  .row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  input, select {
    background: #0f1216; border: 1px solid var(--border); color: var(--text);
    padding: 9px 11px; border-radius: 8px; font-size: 14px; min-width: 120px;
  }
  input:focus, select:focus { outline: none; border-color: var(--primary); }
  button {
    background: var(--primary); color: #04120a; border: none; padding: 9px 16px;
    border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
  }
  button.secondary { background: #222831; color: var(--text); border: 1px solid var(--border); }
  button:hover { filter: brightness(1.08); }
  button:disabled { opacity: .5; cursor: default; }
  .meta { color: var(--muted); font-size: 12px; margin: 10px 0; }
  pre {
    background: #0f1216; border: 1px solid var(--border); border-radius: 8px;
    padding: 12px; overflow: auto; max-height: 320px; font-size: 12.5px; margin: 0;
  }
  .tracks { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-top: 12px; }
  .track { display: flex; gap: 10px; background: #0f1216; border: 1px solid var(--border); border-radius: 10px; padding: 10px; }
  .track img { width: 56px; height: 56px; border-radius: 6px; object-fit: cover; background: #222; }
  .track .t { font-weight: 600; font-size: 14px; }
  .track .a { color: var(--muted); font-size: 12px; }
  .track .src { display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: .5px; color: var(--accent); margin-top: 4px; }
  .track button { margin-top: 6px; padding: 5px 10px; font-size: 12px; }
  footer { color: var(--muted); font-size: 12px; text-align: center; padding: 24px; }
  .player { position: sticky; bottom: 0; background: var(--card); border-top: 1px solid var(--border); padding: 12px 24px; }
  .player audio { width: 100%; }
  .player .now { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
</style>
</head>
<body>
<header>
  <div>
    <h1>AFRO <span>SOUND</span> — Panel backend</h1>
    <div class="sub">Surveillance & test des API — backend Vercel</div>
  </div>
  <button class="secondary" onclick="loadStatus()">↻ Rafraîchir l'état</button>
</header>

<main>
  <h2>État du serveur</h2>
  <div class="grid" id="status-grid">
    <div class="card"><div class="label">Chargement…</div></div>
  </div>

  <h2>Tester les API</h2>

  <div class="panel">
    <h3>🔎 Audius — Recherche</h3>
    <div class="row">
      <input id="s-query" placeholder="ex. burna boy" value="burna boy" />
      <input id="s-limit" type="number" value="6" min="1" max="50" style="min-width:80px" />
      <button onclick="doSearch()">Rechercher</button>
    </div>
    <div class="meta" id="s-meta"></div>
    <div class="tracks" id="s-tracks"></div>
  </div>

  <div class="panel">
    <h3>🔥 Audius — Tendances</h3>
    <div class="row">
      <input id="t-genre" placeholder="genre optionnel (ex. Afrobeats)" />
      <input id="t-limit" type="number" value="6" min="1" max="50" style="min-width:80px" />
      <button onclick="doTrending()">Charger les tendances</button>
    </div>
    <div class="meta" id="t-meta"></div>
    <div class="tracks" id="t-tracks"></div>
  </div>

  <div class="panel">
    <h3>🗄️ Supabase — Gestion</h3>
    <div class="row" style="margin-bottom: 12px;">
      <button onclick="doSongs()">Titres (Public)</button>
      <button class="secondary" onclick="doAdminProfiles()">Utilisateurs</button>
      <button class="secondary" onclick="doAdminPlaylists()">Playlists</button>
    </div>
    <div class="meta" id="db-meta"></div>
    <div id="db-list" style="margin-top:12px"></div>
    <pre id="db-out" style="margin-top:12px; display:none">—</pre>
  </div>

  <div class="panel">
    <h3>🧪 Requête brute</h3>
    <div class="row">
      <select id="r-path">
        <option value="/api/health">/api/health</option>
        <option value="/api/status">/api/status</option>
        <option value="/api/audius/search?query=davido&limit=3">/api/audius/search?query=davido&limit=3</option>
        <option value="/api/audius/trending?limit=3">/api/audius/trending?limit=3</option>
        <option value="/api/songs">/api/songs</option>
      </select>
      <input id="r-custom" placeholder="…ou un chemin perso /api/…" style="min-width:260px" />
      <button onclick="doRaw()">Envoyer</button>
    </div>
    <div class="meta" id="r-meta"></div>
    <pre id="r-out">—</pre>
  </div>
</main>

<div class="player">
  <div class="now" id="now">Aucune lecture</div>
  <audio id="audio" controls preload="none"></audio>
</div>

<footer>AFRO SOUND · panel servi par le backend Vercel</footer>

<script>
  function el(tag, props, children) {
    var e = document.createElement(tag);
    if (props) { for (var k in props) {
      if (k === 'text') { e.textContent = props[k]; }
      else if (k === 'html') { e.innerHTML = props[k]; }
      else { e.setAttribute(k, props[k]); }
    } }
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function statusCard(label, value, state) {
    var dot = state ? el('span', {'class': 'dot ' + state}) : null;
    var val = el('div', {'class': 'value'});
    if (dot) val.appendChild(dot);
    val.appendChild(document.createTextNode(value));
    return el('div', {'class': 'card'}, [el('div', {'class': 'label', text: label}), val]);
  }

  async function loadStatus() {
    var grid = document.getElementById('status-grid');
    grid.innerHTML = '';
    grid.appendChild(statusCard('Backend', 'Vérification…', 'warn'));
    try {
      var t0 = performance.now();
      var r = await fetch('/api/status');
      var ms = Math.round(performance.now() - t0);
      var d = await r.json();
      grid.innerHTML = '';
      grid.appendChild(statusCard('Backend', r.ok ? 'En ligne (' + ms + ' ms)' : 'Erreur', r.ok ? 'ok' : 'ko'));
      grid.appendChild(statusCard('Supabase', d.env && d.env.supabase ? 'Configuré' : 'Absent', d.env && d.env.supabase ? 'ok' : 'ko'));
      grid.appendChild(statusCard('Audius', d.audiusReachable ? 'Joignable' : 'Indispo', d.audiusReachable ? 'ok' : 'ko'));
      grid.appendChild(statusCard('Audius app_name', d.env ? d.env.audiusAppName : '—', null));
      grid.appendChild(statusCard('Jamendo', d.env && d.env.jamendo ? 'Configuré' : 'Absent', d.env && d.env.jamendo ? 'ok' : 'warn'));
      grid.appendChild(statusCard('Node', d.node || '—', null));
      grid.appendChild(statusCard('Uptime', (d.uptimeSeconds || 0) + ' s', null));
    } catch (e) {
      grid.innerHTML = '';
      grid.appendChild(statusCard('Backend', 'Injoignable', 'ko'));
    }
  }

  function playStream(url, title) {
    var a = document.getElementById('audio');
    a.src = url; a.play();
    document.getElementById('now').textContent = '▶ ' + (title || url);
  }

  function renderTracks(list, container) {
    container.innerHTML = '';
    if (!Array.isArray(list) || !list.length) {
      container.appendChild(el('div', {'class': 'meta', text: 'Aucun résultat.'}));
      return;
    }
    list.forEach(function (t) {
      var img = el('img', {src: t.cover || '', alt: ''});
      var btn = el('button', {text: '▶ Lire'});
      btn.onclick = function () { playStream(t.audioUrl, (t.title || '') + ' — ' + (t.artist || '')); };

      var delBtn = el('button', {text: '🗑 Suppr', 'class': 'secondary', style: 'margin-left: 8px; border-color: var(--danger); color: var(--danger);'});
      delBtn.onclick = async function() {
        if(!confirm('Supprimer ce titre ?')) return;
        try {
          await fetch('/api/admin/tracks/' + t.id, {method: 'DELETE'});
          doSongs(); // Refresh
        } catch(e) { alert(e.message); }
      };

      var info = el('div', {}, [
        el('div', {'class': 't', text: t.title || '(sans titre)'}),
        el('div', {'class': 'a', text: t.artist || ''}),
        el('div', {'class': 'src', text: t.source || ''}),
        el('div', {}, [btn, delBtn]),
      ]);
      container.appendChild(el('div', {'class': 'track'}, [img, info]));
    });
  }

  async function fetchJson(path, metaEl) {
    var t0 = performance.now();
    var r = await fetch(path);
    var ms = Math.round(performance.now() - t0);
    var d = await r.json();
    if (metaEl) { metaEl.textContent = 'HTTP ' + r.status + ' · ' + ms + ' ms · ' + path; }
    return d;
  }

  async function doSearch() {
    var q = encodeURIComponent(document.getElementById('s-query').value || '');
    var lim = document.getElementById('s-limit').value || 6;
    var meta = document.getElementById('s-meta');
    meta.textContent = 'Chargement…';
    try {
      var d = await fetchJson('/api/audius/search?query=' + q + '&limit=' + lim, meta);
      renderTracks(d, document.getElementById('s-tracks'));
    } catch (e) { meta.textContent = 'Erreur: ' + e.message; }
  }

  async function doTrending() {
    var g = encodeURIComponent(document.getElementById('t-genre').value || '');
    var lim = document.getElementById('t-limit').value || 6;
    var meta = document.getElementById('t-meta');
    meta.textContent = 'Chargement…';
    var path = '/api/audius/trending?limit=' + lim + (g ? '&genre=' + g : '');
    try {
      var d = await fetchJson(path, meta);
      renderTracks(d, document.getElementById('t-tracks'));
    } catch (e) { meta.textContent = 'Erreur: ' + e.message; }
  }

  async function doSongs() {
    var meta = document.getElementById('db-meta');
    var out = document.getElementById('db-out');
    var list = document.getElementById('db-list');
    meta.textContent = 'Chargement des titres…';
    list.innerHTML = ''; out.style.display = 'none';
    try {
      var d = await fetchJson('/api/songs', meta);
      renderTracks(d, list);
    } catch (e) { meta.textContent = 'Erreur: ' + e.message; }
  }

  async function doAdminProfiles() {
    var meta = document.getElementById('db-meta');
    var out = document.getElementById('db-out');
    var list = document.getElementById('db-list');
    meta.textContent = 'Chargement des profils…';
    list.innerHTML = ''; out.style.display = 'block';
    try {
      var d = await fetchJson('/api/admin/profiles', meta);
      out.textContent = JSON.stringify(d, null, 2);
    } catch (e) { meta.textContent = 'Erreur: ' + e.message; }
  }

  async function doAdminPlaylists() {
    var meta = document.getElementById('db-meta');
    var out = document.getElementById('db-out');
    var list = document.getElementById('db-list');
    meta.textContent = 'Chargement des playlists…';
    list.innerHTML = ''; out.style.display = 'block';
    try {
      var d = await fetchJson('/api/admin/playlists', meta);
      out.textContent = JSON.stringify(d, null, 2);
    } catch (e) { meta.textContent = 'Erreur: ' + e.message; }
  }

  async function doRaw() {
    var custom = document.getElementById('r-custom').value.trim();
    var path = custom || document.getElementById('r-path').value;
    var meta = document.getElementById('r-meta');
    meta.textContent = 'Chargement…';
    try {
      var d = await fetchJson(path, meta);
      document.getElementById('r-out').textContent = JSON.stringify(d, null, 2);
    } catch (e) { meta.textContent = 'Erreur: ' + e.message; }
  }

  loadStatus();
</script>
</body>
</html>`;
