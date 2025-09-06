// UI to paste URL + show README + FILE LIST

// src/components/FetchRepo.tsx
import React, { useState } from 'react';

type RepoEntry = { name: string; type: 'blob' | 'tree' | string };
type RepoFile = { path: string; content?: string };

const FetchRepo: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [readme, setReadme] = useState<string | null>(null);
  const [entries, setEntries] = useState<RepoEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function onFetch() {
    setLoading(true);
    setError(null);
    setReadme(null);
    setEntries([]);
    try {
      const resp = await fetch('/api/fetch-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: url })
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || 'Fetch failed');
      }
      const data = await resp.json();
      setReadme(data.readme ?? null);
      setEntries(data.entries ?? []);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  async function openFile(path: string) {
    setLoading(true);
    try {
      const resp = await fetch('/api/fetch-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: url, filePath: path })
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || 'Failed to fetch file');
      }
      const data = await resp.json();
      // show file content - for demo just set readme area:
      setReadme(`--- ${path} ---\n\n${data.text}`);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Fetch GitHub repo (demo)</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          style={{ flex: 1 }}
        />
        <button onClick={onFetch} disabled={loading || !url}>Fetch</button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading…</div>}

      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <h4>Files at repo root</h4>
          <ul>
            {entries.map((e) => (
              <li key={e.name}>
                {e.name} ({e.type}) {' '}
                {e.type === 'blob' && <button onClick={() => openFile(e.name)}>open</button>}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 2 }}>
          <h4>README / file view</h4>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 400, overflow: 'auto' }}>
            {readme ?? 'No README loaded'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FetchRepo;
