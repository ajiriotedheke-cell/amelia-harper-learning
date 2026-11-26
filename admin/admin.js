const form = document.getElementById('settings-form');
const statusEl = document.getElementById('status');
const submitButton = form?.querySelector('button[type="submit"]');

function showStatus(message, kind = 'info') {
  statusEl.textContent = message;
  statusEl.dataset.state = kind;
  statusEl.style.color = kind === 'error' ? '#b42318' : kind === 'success' ? '#18794e' : '#6b559c';
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 403) throw new Error('Cloudflare Access is not authorising this administrator. Check the Access application and ADMIN_EMAIL setting.');
    if (response.status === 503) throw new Error('The website database is not connected yet. Configure the D1 database binding named DB in Cloudflare Pages.');
    throw new Error(data.error || `Request failed (${response.status}).`);
  }
  return data;
}

function getYouTubeId(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { throw new Error('Enter a valid YouTube video URL.'); }
  const host = url.hostname.replace(/^www\./, '').toLowerCase();
  let id = '';
  if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
  else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
    else if (/^\/(shorts|embed|live)\//.test(url.pathname)) id = url.pathname.split('/')[2] || '';
  }
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('That does not look like a supported YouTube video link.');
  return id;
}

async function loadSettings() {
  showStatus('Checking saved settings…');
  try {
    const response = await fetch('../api/config', { cache: 'no-store' });
    const data = await readResponse(response);
    for (const [key, value] of Object.entries(data)) {
      const field = form.elements.namedItem(key);
      if (!field) continue;
      if (field.type === 'checkbox') field.checked = Boolean(value);
      else if (key === 'youtubeVideos' && Array.isArray(value)) field.value = value.map(video => `${video.title} | https://www.youtube.com/watch?v=${video.videoId}`).join('\n');
      else field.value = value ?? '';
    }
    showStatus('Saved settings loaded. You can edit and save your links.', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

form?.addEventListener('submit', async event => {
  event.preventDefault();
  const data = {};
  try {
    for (const field of form.elements) {
      if (!field.name) continue;
      if (field.type === 'checkbox') data[field.name] = field.checked;
      else if (field.name === 'youtubeVideos') {
        data.youtubeVideos = field.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map((line, index) => {
          const separator = line.indexOf('|');
          if (separator < 1) throw new Error(`Line ${index + 1}: use Video title | YouTube URL.`);
          const title = line.slice(0, separator).trim();
          if (!title || title.length > 120) throw new Error(`Line ${index + 1}: video title must be 1–120 characters.`);
          return { title, videoId: getYouTubeId(line.slice(separator + 1).trim()) };
        });
      } else data[field.name] = field.value.trim();
    }
  } catch (error) {
    showStatus(error.message, 'error');
    return;
  }

  showStatus('Saving your settings…');
  if (submitButton) submitButton.disabled = true;
  try {
    const response = await fetch('../api/admin/config', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const result = await readResponse(response);
    showStatus(`Saved successfully (${result.saved} settings). Your public website will reflect the changes shortly.`, 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

loadSettings();

const analyticsBox = document.getElementById('analytics');
document.getElementById('refresh-analytics')?.addEventListener('click', async () => {
  analyticsBox.textContent = 'Loading analytics…';
  try {
    const response = await fetch('../api/admin/analytics', { cache: 'no-store' });
    const data = await readResponse(response);
    const totals = data.totals || {};
    analyticsBox.textContent = `Events: ${totals.events || 0} · Starts: ${totals.starts || 0} · Completions: ${totals.completions || 0} · Errors: ${totals.errors || 0}`;
  } catch (error) {
    analyticsBox.textContent = error.message;
  }
});
