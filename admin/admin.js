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
    if (response.status === 403) {
      throw new Error('Cloudflare Access is not authorising this administrator. Check the Access application and ADMIN_EMAIL setting.');
    }
    if (response.status === 503) {
      throw new Error('The website database is not connected yet. Configure the D1 database binding named DB in Cloudflare Pages.');
    }
    throw new Error(data.error || `Request failed (${response.status}).`);
  }
  return data;
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
  for (const field of form.elements) {
    if (!field.name) continue;
    data[field.name] = field.type === 'checkbox' ? field.checked : field.value.trim();
  }

  showStatus('Saving your settings…');
  if (submitButton) submitButton.disabled = true;
  try {
    const response = await fetch('../api/admin/config', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    });
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
