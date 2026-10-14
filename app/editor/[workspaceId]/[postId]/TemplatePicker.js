'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TemplatePicker({
  workspace,
  themeBundle,
  postId
}) {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    themeBundle?.pageTemplates?.[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  function handleTitleChange(val) {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
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

  async function handleInitializePage(e) {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
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
          postId: Number(postId),
          title: title.trim() || `Page ${postId}`,
          slug: slug.trim() || `page-${postId}`,
          templateId: selectedTemplateId,
          sections: defaultSections
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to initialize page');
      }

      // Refresh to load the newly initialized page
      router.refresh();
    } catch (err) {
      setError(err.message);
      setIsCreating(false);
    }
  }

  return (
    <div className="template-picker-page">
      <header className="ws-topbar">
        <div className="ws-topbar-left">
          <Link href={`/editor/${workspace.workspaceId}`} className="ws-back-btn">
            ← Back to Pages
          </Link>
          <span className="ws-nav-separator">/</span>
          <div className="ws-client-title">
            <strong>{workspace.clientName}</strong>
            <span className="ws-id-pill">Post #{postId}</span>
          </div>
        </div>
      </header>

      <div className="template-picker-container">
        <div className="template-picker-header">
          <span className="picker-tag">New Page Setup</span>
          <h2>Initialize Page #{postId}</h2>
          <p>
            This page has not been built yet. Select a page template from your workspace's cloned theme to populate initial sections.
          </p>
        </div>

        {error && <div className="ws-modal-error">{error}</div>}

        <form onSubmit={handleInitializePage} className="template-picker-form">
          <div className="picker-inputs-row">
            <div className="ws-form-group">
              <label>Page Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Commercial Boiler Services"
              />
            </div>

            <div className="ws-form-group">
              <label>URL Slug *</label>
              <div className="ws-slug-wrap">
                <span>/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="commercial-boiler-services"
                />
              </div>
            </div>
          </div>

          <div className="ws-form-group">
            <label>Select Starting Page Template *</label>
            <div className="template-cards-grid">
              {(themeBundle.pageTemplates || []).map(tpl => {
                const isSelected = tpl.id === selectedTemplateId;
                return (
                  <div
                    key={tpl.id}
                    className={`template-select-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                  >
                    <div className="card-top">
                      <strong>{tpl.name}</strong>
                      {isSelected && <span className="check-badge">✓ Selected</span>}
                    </div>
                    {tpl.description && (
                      <p className="card-desc">{tpl.description}</p>
                    )}
                    <div className="card-components-preview">
                      <small>INCLUDED SECTIONS ({tpl.components?.length || 0}):</small>
                      <div className="components-tag-list">
                        {(tpl.components || []).map((c, i) => (
                          <span key={i} className="comp-tag">{c.type}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="picker-form-actions">
            <Link href={`/editor/${workspace.workspaceId}`} className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn-primary btn-large"
              disabled={isCreating || !title.trim()}
            >
              {isCreating ? 'Creating Page...' : 'Initialize & Open Editor →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
