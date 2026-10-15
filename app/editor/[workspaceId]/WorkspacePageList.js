'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImportWpPageModal from '../../ImportWpPageModal';

export default function WorkspacePageList({
  workspace,
  themeBundle,
  initialPages = []
}) {
  const router = useRouter();
  const [pages, setPages] = useState(initialPages);

  // New Page Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    themeBundle?.pageTemplates?.[0]?.id || ''
  );

  // Import Existing WP Pages Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  function handleTitleChange(val) {
    setNewTitle(val);
    if (!newSlug || newSlug === slugify(newTitle)) {
      setNewSlug(slugify(val));
    }
  }

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  async function handleCreatePage(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Generate clean UUID for the new draft page
      const pageGuid = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);

      // Find selected template to generate default sections
      const template = themeBundle.pageTemplates?.find(t => t.id === selectedTemplateId);
      const library = Object.fromEntries((themeBundle.components || []).map(c => [c.id, c]));

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
          postId: pageGuid,
          rowGuid: pageGuid,
          pageGuid: pageGuid,
          title: newTitle.trim() || 'Untitled Page',
          slug: newSlug.trim() || `page-${pageGuid.slice(0, 8)}`,
          templateId: selectedTemplateId,
          sections: defaultSections
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create page');
      }

      setIsModalOpen(false);
      router.push(`/editor/${workspace.workspaceId}/${pageGuid}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function getStatusBadge(page) {
    if (!page.lastPublishedAt) {
      return <span className="status-badge badge-draft">Draft</span>;
    }
    if (page.lastSavedAt && new Date(page.lastSavedAt) > new Date(page.lastPublishedAt)) {
      return <span className="status-badge badge-changes">Unpublished Changes</span>;
    }
    return <span className="status-badge badge-published">Published</span>;
  }

  function formatDate(isoStr) {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  }

  // Filter WP pages by search query
  const existingPostIds = new Set(pages.map(p => Number(p.postId)).filter(Boolean));

  return (
    <div className="workspace-dashboard">
      {/* Top Header */}
      <header className="ws-topbar">
        <div className="ws-topbar-left">
          <Link href="/" className="ws-brand-link" title="Theme Playground">
            <div className="brand-mark">B</div>
            <span>Bizfire</span>
          </Link>
          <span className="ws-nav-separator">/</span>
          <div className="ws-client-title">
            <strong>{workspace.clientName}</strong>
            <span className="ws-id-pill">{workspace.workspaceId}</span>
          </div>
        </div>

        <div className="ws-topbar-right">
          {workspace.wpSiteUrl && (
            <a
              href={workspace.wpSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ws-ext-link"
            >
              WordPress Site ↗
            </a>
          )}
          <Link href="/" className="btn-secondary">
            Playground ↗
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsImportModalOpen(true)}
            title="Import an existing page from your WordPress site"
          >
            Import from WordPress ⤓
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setNewTitle('');
              setNewSlug('');
              setIsModalOpen(true);
            }}
          >
            + Create New Page
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="ws-main-content">
        {/* Workspace Overview Cards */}
        <div className="ws-overview-cards">
          <div className="ws-card">
            <span className="ws-card-label">Client Name</span>
            <strong className="ws-card-value">{workspace.clientName}</strong>
          </div>
          <div className="ws-card">
            <span className="ws-card-label">Workspace Theme Clone</span>
            <strong className="ws-card-value">{themeBundle.theme?.name || workspace.themeId}</strong>
            <small className="ws-card-sub">
              {themeBundle.components?.length || 0} components · {themeBundle.pageTemplates?.length || 0} templates
            </small>
          </div>
          <div className="ws-card">
            <span className="ws-card-label">Total Pages</span>
            <strong className="ws-card-value">{pages.length}</strong>
            <small className="ws-card-sub">
              {pages.filter(p => !!p.lastPublishedAt).length} published to WordPress
            </small>
          </div>
          <div className="ws-card">
            <span className="ws-card-label">Target WordPress Site</span>
            <strong className="ws-card-value ws-truncate" title={workspace.wpSiteUrl}>
              {workspace.wpSiteUrl ? workspace.wpSiteUrl.replace(/^https?:\/\//, '') : 'None configured'}
            </strong>
          </div>
        </div>

        {/* Page List Section */}
        <section className="ws-table-container">
          <div className="ws-table-header">
            <div>
              <h2>Workspace Pages</h2>
              <p>Manage and edit component-driven pages for this client.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsImportModalOpen(true)}
              >
                Import from WordPress ⤓
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Page
              </button>
            </div>
          </div>

          {pages.length === 0 ? (
            <div className="ws-empty-state">
              <p>No pages created yet for this workspace.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  Import Existing WordPress Page
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create First Page
                </button>
              </div>
            </div>
          ) : (
            <table className="ws-pages-table">
              <thead>
                <tr>
                  <th>WordPress ID</th>
                  <th>Page Title & Slug</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th>Last Saved</th>
                  <th>Last Published</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => {
                  const targetIdentifier = page.rowGuid || page.postId;
                  return (
                    <tr key={page.rowGuid || page.postId}>
                      <td>
                        {page.postId ? (
                          <span className="post-id-tag">#{page.postId}</span>
                        ) : (
                          <span className="post-id-tag draft-tag">Draft (Unpublished)</span>
                        )}
                      </td>
                      <td>
                        <div className="page-title-cell">
                          <strong>{page.title || 'Untitled Page'}</strong>
                          <code>/{page.slug || ''}</code>
                        </div>
                      </td>
                      <td>
                        <span className="template-pill">
                          {themeBundle.pageTemplates?.find(t => t.id === page.templateId)?.name || page.templateId || 'Custom'}
                        </span>
                      </td>
                      <td>{getStatusBadge(page)}</td>
                      <td>{formatDate(page.lastSavedAt)}</td>
                      <td>{formatDate(page.lastPublishedAt)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/editor/${workspace.workspaceId}/${targetIdentifier}`}
                          className="btn-table-edit"
                        >
                          Edit Content →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* Import from WordPress Modal */}
      <ImportWpPageModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        workspace={workspace}
        themeBundle={themeBundle}
        existingPostIds={existingPostIds}
      />

      {/* Create New Page Modal */}
      {isModalOpen && (
        <div className="ws-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="ws-modal" onClick={e => e.stopPropagation()}>
            <div className="ws-modal-header">
              <h3>Create New Workspace Page</h3>
              <button
                type="button"
                className="ws-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="ws-modal-form">
              {error && <div className="ws-modal-error">{error}</div>}

              <div className="ws-form-group">
                <label>Page Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  required
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="e.g. Commercial AC Maintenance"
                />
              </div>

              <div className="ws-form-group">
                <label>URL Slug *</label>
                <div className="ws-slug-wrap">
                  <span>/</span>
                  <input
                    type="text"
                    value={newSlug}
                    required
                    onChange={e => setNewSlug(e.target.value)}
                    placeholder="commercial-ac-maintenance"
                  />
                </div>
              </div>

              <div className="ws-form-group">
                <label>Starting Page Template *</label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                >
                  {(themeBundle.pageTemplates || []).map(tpl => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.components?.length || 0} sections)
                    </option>
                  ))}
                </select>
                <small>Initial sections will be populated with default content from this template.</small>
              </div>

              <div className="ws-modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create & Open Editor →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
