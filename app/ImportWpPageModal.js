'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportWpPageModal({
  isOpen,
  onClose,
  workspace,
  themeBundle,
  existingPostIds = new Set()
}) {
  const router = useRouter();
  const [wpPages, setWpPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [importTemplateId, setImportTemplateId] = useState(
    themeBundle?.pageTemplates?.[0]?.id || ''
  );
  const [importingPostId, setImportingPostId] = useState(null);

  useEffect(() => {
    if (!isOpen || !workspace?.workspaceId) return;

    let isMounted = true;
    async function loadPages() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/workspace/${workspace.workspaceId}/wp-pages`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch WordPress pages');
        }
        if (isMounted) {
          setWpPages(data.pages || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPages();

    return () => {
      isMounted = false;
    };
  }, [isOpen, workspace?.workspaceId]);

  if (!isOpen) return null;

  const filteredPages = wpPages.filter(p => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q) ||
      String(p.postId).includes(q)
    );
  });

  async function handleImportPage(wpPage) {
    setImportingPostId(wpPage.postId);
    setError(null);

    try {
      // Use existing deterministic post GUID or generate clean UUID
      const pageGuid = wpPage.guid || (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9));

      const template = themeBundle?.pageTemplates?.find(t => t.id === importTemplateId);
      const library = Object.fromEntries((themeBundle?.components || []).map(c => [c.id, c]));

      const defaultSections = (template?.components || []).map((compRef) => {
        const compDef = library[compRef.type];
        return {
          type: compRef.type,
          content: compDef?.defaults ? structuredClone(compDef.defaults) : {}
        };
      });

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.workspaceId,
          postId: wpPage.postId,
          rowGuid: pageGuid,
          pageGuid: pageGuid,
          title: wpPage.title,
          slug: wpPage.slug,
          templateId: importTemplateId,
          sections: defaultSections
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to import page');
      }

      onClose();
      router.push(`/editor/${workspace.workspaceId}/${pageGuid}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setImportingPostId(null);
    }
  }

  const siteDisplay = workspace?.wpSiteUrl
    ? workspace.wpSiteUrl.replace(/^https?:\/\//, '')
    : 'WordPress';

  return (
    <div className="ws-modal-backdrop" onClick={onClose}>
      <div className="ws-modal ws-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="ws-modal-header">
          <div>
            <h3>Import Existing Page from WordPress</h3>
            <small style={{ color: '#64748b' }}>
              Select an existing page from <strong>{siteDisplay}</strong> to edit in the Bizfire Content Editor studio.
            </small>
          </div>
          <button
            type="button"
            className="ws-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <div className="ws-modal-error">{error}</div>}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search WordPress pages by title, slug, or ID..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ minWidth: '220px' }}>
              <select
                value={importTemplateId}
                onChange={e => setImportTemplateId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px'
                }}
              >
                {(themeBundle?.pageTemplates || []).map(tpl => (
                  <option key={tpl.id} value={tpl.id}>
                    Starting Template: {tpl.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
              <div style={{ marginBottom: '8px', fontWeight: 600 }}>Connecting to WordPress REST API...</div>
              <small>Fetching published pages from {siteDisplay}</small>
            </div>
          ) : filteredPages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              {wpPages.length === 0
                ? 'No published pages found on WordPress.'
                : 'No WordPress pages match your search.'}
            </div>
          ) : (
            <div style={{ maxHeight: '380px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table className="ws-pages-table" style={{ margin: 0, width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>WP ID</th>
                    <th>Title & Permalink</th>
                    <th style={{ width: '90px' }}>Status</th>
                    <th style={{ width: '150px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map(wp => {
                    const isAlreadyImported = existingPostIds.has(Number(wp.postId));
                    const isImporting = importingPostId === wp.postId;
                    return (
                      <tr key={wp.postId}>
                        <td>
                          <span className="post-id-tag">#{wp.postId}</span>
                        </td>
                        <td>
                          <strong>{wp.title}</strong>
                          <div>
                            <small style={{ color: '#64748b' }}>/{wp.slug}</small>
                          </div>
                        </td>
                        <td>
                          <span
                            className="status-badge badge-published"
                            style={{ textTransform: 'capitalize' }}
                          >
                            {wp.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isAlreadyImported ? (
                            <button
                              type="button"
                              className="btn-secondary"
                              disabled
                              style={{ padding: '4px 10px', fontSize: '12px', opacity: 0.6 }}
                            >
                              Already in Studio
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => handleImportPage(wp)}
                              disabled={isImporting}
                              style={{ padding: '6px 14px', fontSize: '13px' }}
                            >
                              {isImporting ? 'Importing...' : 'Import & Edit →'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="ws-modal-actions" style={{ marginTop: '0', paddingTop: '12px' }}>
            <span style={{ marginRight: 'auto', color: '#64748b', fontSize: '13px' }}>
              Found {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'} on WordPress
            </span>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
