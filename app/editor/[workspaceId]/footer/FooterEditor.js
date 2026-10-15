'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { compileFooter } from '@/lib/footerCompiler.js';

export default function FooterEditor({ workspace, initialPages = [], initialFooter }) {
  // Ensure robust defaults
  const [footerData, setFooterData] = useState(() => {
    const currentYear = new Date().getFullYear();
    const siteTitle = initialFooter?.branding?.siteTitle || workspace?.clientName || 'WordPress Site';

    return {
      rowGuid: initialFooter?.rowGuid || null,
      menuGuid: initialFooter?.menuGuid || null,
      branding: {
        siteTitle,
        logoUrl: initialFooter?.branding?.logoUrl || '',
        logoWidth: initialFooter?.branding?.logoWidth || 160,
        tagline: initialFooter?.branding?.tagline || 'Quality Service You Can Trust',
        aboutText:
          initialFooter?.branding?.aboutText ||
          'Providing reliable heating, cooling, and home comfort solutions. Dedicated to excellence, customer satisfaction, and fast 24/7 emergency dispatch.',
      },
      columns:
        Array.isArray(initialFooter?.columns) && initialFooter.columns.length > 0
          ? initialFooter.columns
          : [
              {
                id: 'col-quick-links',
                title: 'Quick Links',
                links: [
                  { id: 'fl-1', label: 'Home', url: '/', target: '_self' },
                  { id: 'fl-2', label: 'About Us', url: '/about/', target: '_self' },
                  { id: 'fl-3', label: 'Contact', url: '/contact/', target: '_self' },
                ],
              },
              {
                id: 'col-services',
                title: 'Services',
                links: [
                  { id: 'fl-4', label: 'AC Repair & Tune-Up', url: '/services/', target: '_self' },
                  { id: 'fl-5', label: 'Heating & Furnace Repair', url: '/services/', target: '_self' },
                  { id: 'fl-6', label: 'Emergency Dispatch', url: '/contact/', target: '_self' },
                ],
              },
            ],
      contact: {
        phone: initialFooter?.contact?.phone || '(609) 555-0100',
        phoneLabel: initialFooter?.contact?.phoneLabel || 'Phone',
        email: initialFooter?.contact?.email || 'support@example.com',
        emailLabel: initialFooter?.contact?.emailLabel || 'Email',
        address: initialFooter?.contact?.address || '100 Main Street, Princeton, NJ 08540',
        addressLabel: initialFooter?.contact?.addressLabel || 'Address',
        workingHours: initialFooter?.contact?.workingHours || 'Mon - Fri: 8:00 AM - 6:00 PM | 24/7 Emergency',
        showPhone: initialFooter?.contact?.showPhone !== false,
        showEmail: initialFooter?.contact?.showEmail !== false,
        showAddress: initialFooter?.contact?.showAddress !== false,
      },
      social: {
        facebook: initialFooter?.social?.facebook || 'https://facebook.com',
        twitter: initialFooter?.social?.twitter || 'https://twitter.com',
        linkedin: initialFooter?.social?.linkedin || 'https://linkedin.com',
        instagram: initialFooter?.social?.instagram || '',
        youtube: initialFooter?.social?.youtube || '',
      },
      bottomBar: {
        copyrightText:
          initialFooter?.bottomBar?.copyrightText ||
          `© ${currentYear} ${siteTitle}. All rights reserved.`,
        links:
          Array.isArray(initialFooter?.bottomBar?.links) && initialFooter.bottomBar.links.length > 0
            ? initialFooter.bottomBar.links
            : [
                { id: 'bb-1', label: 'Privacy Policy', url: '/privacy-policy/', target: '_self' },
                { id: 'bb-2', label: 'Terms of Service', url: '/terms-of-service/', target: '_self' },
              ],
      },
      settings: {
        theme: initialFooter?.settings?.theme || 'dark',
        backgroundColor: initialFooter?.settings?.backgroundColor || '#0f172a',
        textColor: initialFooter?.settings?.textColor || '#94a3b8',
        accentColor: initialFooter?.settings?.accentColor || '#38bdf8',
      },
    };
  });

  // Track initial snapshot to detect unsaved changes
  const [lastSavedData, setLastSavedData] = useState(() => {
    return JSON.parse(JSON.stringify(footerData));
  });

  const [activeTab, setActiveTab] = useState('columns'); // 'columns' | 'branding' | 'contact' | 'bottom' | 'settings'
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [clickNotice, setClickNotice] = useState(null);

  // Detect unsaved changes by comparing current state against last saved snapshot
  const isDirty = useMemo(() => {
    return JSON.stringify(footerData) !== JSON.stringify(lastSavedData);
  }, [footerData, lastSavedData]);

  // Warn user on browser reload/close if there are unsaved changes
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have unsaved footer changes. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Intercept in-app Next.js Link transitions when there are unsaved changes
  useEffect(() => {
    if (!isDirty) return;

    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if (anchor.target === '_blank') return;

      // Ask confirmation before navigating away and losing progress
      const confirmLeave = window.confirm(
        'You have unsaved footer changes that will be lost if you leave now.\n\nClick OK to leave and discard changes, or Cancel to stay and save.'
      );
      if (!confirmLeave) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, [isDirty]);

  // Real-time Handlebars compile
  const compiled = useMemo(() => {
    return compileFooter(footerData);
  }, [footerData]);

  // -------------------------------------------------------------
  // Column Management Handlers
  // -------------------------------------------------------------
  const handleAddColumn = () => {
    const newColId = `col-${Date.now()}`;
    const newColNumber = (footerData.columns || []).length + 1;
    const newColumn = {
      id: newColId,
      title: `Navigation ${newColNumber}`,
      links: [
        { id: `link-${Date.now()}-1`, label: 'New Link', url: '/', target: '_self' },
      ],
    };
    setFooterData((prev) => ({
      ...prev,
      columns: [...(prev.columns || []), newColumn],
    }));
  };

  const handleRemoveColumn = (colId) => {
    if ((footerData.columns || []).length <= 1) {
      window.alert('You must have at least one footer column.');
      return;
    }
    setFooterData((prev) => ({
      ...prev,
      columns: prev.columns.filter((c) => c.id !== colId),
    }));
  };

  const handleUpdateColumnTitle = (colId, title) => {
    setFooterData((prev) => ({
      ...prev,
      columns: prev.columns.map((c) => (c.id === colId ? { ...c, title } : c)),
    }));
  };

  const handleAddLinkToColumn = (colId) => {
    const newLink = {
      id: `link-${Date.now()}`,
      label: 'New Link',
      url: '/',
      target: '_self',
    };
    setFooterData((prev) => ({
      ...prev,
      columns: prev.columns.map((c) =>
        c.id === colId ? { ...c, links: [...(c.links || []), newLink] } : c
      ),
    }));
  };

  const handleUpdateLink = (colId, linkId, updates) => {
    setFooterData((prev) => ({
      ...prev,
      columns: prev.columns.map((c) => {
        if (c.id !== colId) return c;
        return {
          ...c,
          links: c.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l)),
        };
      }),
    }));
  };

  const handleRemoveLink = (colId, linkId) => {
    setFooterData((prev) => ({
      ...prev,
      columns: prev.columns.map((c) => {
        if (c.id !== colId) return c;
        return {
          ...c,
          links: c.links.filter((l) => l.id !== linkId),
        };
      }),
    }));
  };

  const handleMoveLink = (colId, index, direction) => {
    setFooterData((prev) => {
      const col = prev.columns.find((c) => c.id === colId);
      if (!col || !col.links) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= col.links.length) return prev;

      const newLinks = [...col.links];
      const temp = newLinks[index];
      newLinks[index] = newLinks[targetIndex];
      newLinks[targetIndex] = temp;

      return {
        ...prev,
        columns: prev.columns.map((c) => (c.id === colId ? { ...c, links: newLinks } : c)),
      };
    });
  };

  // -------------------------------------------------------------
  // Bottom Bar Legal Links Handlers
  // -------------------------------------------------------------
  const handleAddLegalLink = () => {
    const newLink = {
      id: `bb-${Date.now()}`,
      label: 'Legal Link',
      url: '/privacy-policy/',
      target: '_self',
    };
    setFooterData((prev) => ({
      ...prev,
      bottomBar: {
        ...prev.bottomBar,
        links: [...(prev.bottomBar?.links || []), newLink],
      },
    }));
  };

  const handleUpdateLegalLink = (linkId, updates) => {
    setFooterData((prev) => ({
      ...prev,
      bottomBar: {
        ...prev.bottomBar,
        links: prev.bottomBar.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l)),
      },
    }));
  };

  const handleRemoveLegalLink = (linkId) => {
    setFooterData((prev) => ({
      ...prev,
      bottomBar: {
        ...prev.bottomBar,
        links: prev.bottomBar.links.filter((l) => l.id !== linkId),
      },
    }));
  };

  // -------------------------------------------------------------
  // Save & Publish Operations
  // -------------------------------------------------------------
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setAlert(null);
    try {
      const res = await fetch('/api/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.workspaceId,
          footerData,
          action: 'save',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to save footer draft');
      }

      if (data.rowGuid) {
        setFooterData((prev) => ({ ...prev, rowGuid: data.rowGuid }));
      }
      setLastSavedData(JSON.parse(JSON.stringify(footerData)));
      setAlert({
        type: 'success',
        message: 'Footer draft saved successfully to database.',
      });
    } catch (err) {
      console.error('Error saving footer draft:', err);
      setAlert({
        type: 'danger',
        message: `Failed to save footer: ${err.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setAlert(null);
    try {
      const res = await fetch('/api/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.workspaceId,
          footerData,
          action: 'publish',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to publish footer');
      }

      if (data.rowGuid) {
        setFooterData((prev) => ({ ...prev, rowGuid: data.rowGuid }));
      }
      setLastSavedData(JSON.parse(JSON.stringify(footerData)));

      if (data.wpSyncStatus === 'failed') {
        setAlert({
          type: 'warning',
          message: `Footer saved to database, but WordPress sync reported a warning: ${data.wpSyncError}`,
        });
      } else {
        setAlert({
          type: 'success',
          message: 'Footer successfully compiled and published live to WordPress!',
        });
      }
    } catch (err) {
      console.error('Error publishing footer:', err);
      setAlert({
        type: 'danger',
        message: `Failed to publish footer: ${err.message}`,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const viewportWidth =
    viewport === 'mobile' ? '375px' : viewport === 'tablet' ? '768px' : '100%';

  return (
    <div className="workspace-dashboard" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header className="ws-topbar">
        <div className="ws-topbar-left">
          <Link href={`/editor/${workspace.workspaceId}`} className="ws-brand-link" title="Back to Pages">
            <span style={{ fontSize: '18px', marginRight: '4px' }}>←</span>
            <span>Pages Dashboard</span>
          </Link>
          <span className="ws-nav-separator">/</span>
          <div className="ws-client-title">
            <strong>Site Footer & Multi-Column Navigation</strong>
            <span className="ws-id-pill">{workspace.clientName}</span>
          </div>
          {isDirty ? (
            <span
              className="badge bg-warning text-dark border border-warning"
              style={{ fontSize: '11px', fontWeight: '600', marginLeft: '12px' }}
              title="You have unsaved changes"
            >
              ● Unsaved Changes
            </span>
          ) : (
            <span
              className="badge bg-light text-muted border"
              style={{ fontSize: '11px', fontWeight: '500', marginLeft: '12px' }}
              title="All changes saved to database"
            >
              All changes saved
            </span>
          )}
        </div>

        <div className="ws-topbar-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {workspace.wpSiteUrl && (
            <a
              href={workspace.wpSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ws-ext-link"
              title="Open Live WordPress Site"
            >
              WordPress Site ↗
            </a>
          )}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? 'Saving...' : 'Save Draft 💾'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handlePublish}
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish Footer to Site 🚀'}
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* Left Panel: Tabbed Controls (460px) */}
        <div
          style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Unsaved Changes Banner */}
          {isDirty && (
            <div
              style={{
                backgroundColor: '#fffbeb',
                borderBottom: '1px solid #fef3c7',
                padding: '9px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700' }}>⚠️ Unsaved:</span> Footer changes pending.
              </div>
              <button
                type="button"
                className="btn btn-warning btn-sm py-0 px-2"
                style={{ fontSize: '11px', fontWeight: '600' }}
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              padding: '6px 8px 0',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'columns', label: 'Columns & Links', icon: '☰' },
              { id: 'branding', label: 'Brand & About', icon: '🏷️' },
              { id: 'contact', label: 'Contact & Social', icon: '📞' },
              { id: 'bottom', label: 'Bottom Bar', icon: '⚖️' },
              { id: 'settings', label: 'Styles', icon: '🎨' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '9px 12px',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #0284c7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === tab.id ? '#0284c7' : '#64748b',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Columns & Navigation Links */}
          {activeTab === 'columns' && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px', color: '#0f172a' }}>
                    Footer Columns
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    Configure 2 to 4 navigation columns with custom links.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAddColumn}
                  disabled={(footerData.columns || []).length >= 4}
                >
                  + Add Column
                </button>
              </div>

              {(footerData.columns || []).map((col, colIdx) => (
                <div
                  key={col.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  {/* Column Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, marginRight: '10px' }}>
                      <span className="badge bg-secondary" style={{ fontSize: '11px' }}>
                        Col {colIdx + 1}
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={col.title}
                        onChange={(e) => handleUpdateColumnTitle(col.id, e.target.value)}
                        placeholder="Column Title (e.g. Services)"
                        style={{ fontWeight: '600' }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleRemoveColumn(col.id)}
                      title="Delete Column"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Links inside this column */}
                  <div style={{ paddingLeft: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                      Links in this column:
                    </div>

                    {(col.links || []).map((link, linkIdx) => (
                      <div
                        key={link.id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '10px',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(col.id, link.id, { label: e.target.value })}
                            placeholder="Link Label"
                            style={{ flex: 1 }}
                          />
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={link.url}
                            onChange={(e) => handleUpdateLink(col.id, link.id, { url: e.target.value })}
                            placeholder="/path/"
                            style={{ flex: 1 }}
                          />
                        </div>

                        {/* Page Picker Helper */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <select
                            className="form-select form-select-sm"
                            style={{ fontSize: '11px', height: '28px', maxWidth: '190px' }}
                            value={link.pageKey || ''}
                            onChange={(e) => {
                              const selectedSlug = e.target.value;
                              if (!selectedSlug) return;
                              const p = initialPages.find((pg) => pg.slug === selectedSlug);
                              if (p) {
                                const cleanSlug = p.slug.replace(/^\//, '').replace(/\/$/, '');
                                handleUpdateLink(col.id, link.id, {
                                  label: p.title || cleanSlug.replace(/-/g, ' '),
                                  url: `/${cleanSlug}/`,
                                  pageKey: cleanSlug,
                                });
                              }
                            }}
                          >
                            <option value="">Insert Workspace Page...</option>
                            <option value="/">Home (/)</option>
                            {initialPages.map((p) => {
                              const clean = (p.slug || '').replace(/^\//, '').replace(/\/$/, '');
                              return (
                                <option key={p.rowGuid || p.pageGuid || clean} value={clean}>
                                  {p.title || clean} (/{clean})
                                </option>
                              );
                            })}
                          </select>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              className="btn btn-light btn-sm py-0 px-1 border"
                              style={{ fontSize: '11px' }}
                              disabled={linkIdx === 0}
                              onClick={() => handleMoveLink(col.id, linkIdx, 'up')}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="btn btn-light btn-sm py-0 px-1 border"
                              style={{ fontSize: '11px' }}
                              disabled={linkIdx === col.links.length - 1}
                              onClick={() => handleMoveLink(col.id, linkIdx, 'down')}
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm py-0 px-2"
                              style={{ fontSize: '11px' }}
                              onClick={() => handleRemoveLink(col.id, link.id)}
                              title="Remove Link"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm w-100 mt-1"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleAddLinkToColumn(col.id)}
                    >
                      + Add Link to {col.title || 'Column'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Brand & About */}
          {activeTab === 'branding' && (
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', color: '#0f172a' }}>
                Brand & Company Info
              </h3>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '600' }}>
                  Site / Brand Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={footerData.branding?.siteTitle || ''}
                  onChange={(e) =>
                    setFooterData((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, siteTitle: e.target.value },
                    }))
                  }
                  placeholder="e.g. Ecsion Test HVAC"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '600' }}>
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={footerData.branding?.tagline || ''}
                  onChange={(e) =>
                    setFooterData((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, tagline: e.target.value },
                    }))
                  }
                  placeholder="e.g. Heating & Air Conditioning Specialists"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '600' }}>
                  Company About / Description Paragraph
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows={4}
                  value={footerData.branding?.aboutText || ''}
                  onChange={(e) =>
                    setFooterData((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, aboutText: e.target.value },
                    }))
                  }
                  placeholder="Briefly describe what your business does..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '600' }}>
                  Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  className="form-control form-control-sm"
                  value={footerData.branding?.logoUrl || ''}
                  onChange={(e) =>
                    setFooterData((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, logoUrl: e.target.value },
                    }))
                  }
                  placeholder="https://example.com/logo-white.png"
                />
                <div className="form-text" style={{ fontSize: '11px' }}>
                  Leave empty to display text title with tagline.
                </div>
              </div>

              {footerData.branding?.logoUrl && (
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Logo Max Width: {footerData.branding?.logoWidth || 160}px
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="100"
                    max="300"
                    step="10"
                    value={footerData.branding?.logoWidth || 160}
                    onChange={(e) =>
                      setFooterData((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, logoWidth: Number(e.target.value) },
                      }))
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Contact & Social */}
          {activeTab === 'contact' && (
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', color: '#0f172a' }}>
                Contact Info & Social Links
              </h3>

              <div className="card p-3 mb-3 bg-light border">
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Contact Details</h4>

                <div className="mb-2">
                  <div className="form-check form-switch mb-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showPhoneSwitch"
                      checked={footerData.contact?.showPhone !== false}
                      onChange={(e) =>
                        setFooterData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, showPhone: e.target.checked },
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="showPhoneSwitch" style={{ fontSize: '12px', fontWeight: '600' }}>
                      Show Phone Number
                    </label>
                  </div>
                  {footerData.contact?.showPhone !== false && (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={footerData.contact?.phone || ''}
                      onChange={(e) =>
                        setFooterData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value },
                        }))
                      }
                      placeholder="(609) 555-0100"
                    />
                  )}
                </div>

                <div className="mb-2">
                  <div className="form-check form-switch mb-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showEmailSwitch"
                      checked={footerData.contact?.showEmail !== false}
                      onChange={(e) =>
                        setFooterData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, showEmail: e.target.checked },
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="showEmailSwitch" style={{ fontSize: '12px', fontWeight: '600' }}>
                      Show Email Address
                    </label>
                  </div>
                  {footerData.contact?.showEmail !== false && (
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      value={footerData.contact?.email || ''}
                      onChange={(e) =>
                        setFooterData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value },
                        }))
                      }
                      placeholder="service@example.com"
                    />
                  )}
                </div>

                <div className="mb-2">
                  <div className="form-check form-switch mb-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showAddressSwitch"
                      checked={footerData.contact?.showAddress !== false}
                      onChange={(e) =>
                        setFooterData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, showAddress: e.target.checked },
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="showAddressSwitch" style={{ fontSize: '12px', fontWeight: '600' }}>
                      Show Physical Address
                    </label>
                  </div>
                  {footerData.contact?.showAddress !== false && (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={footerData.contact?.address || ''}
                      onChange={(e) =>
                        setFooterData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, address: e.target.value },
                        }))
                      }
                      placeholder="100 Main Street, Princeton, NJ 08540"
                    />
                  )}
                </div>

                <div>
                  <label className="form-label mb-1" style={{ fontSize: '12px', fontWeight: '600' }}>
                    Business / Working Hours
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={footerData.contact?.workingHours || ''}
                    onChange={(e) =>
                      setFooterData((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, workingHours: e.target.value },
                      }))
                    }
                    placeholder="Mon - Fri: 8am - 6pm | 24/7 Emergency"
                  />
                </div>
              </div>

              <div className="card p-3 bg-light border">
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Social Media Profiles</h4>

                {[
                  { key: 'facebook', label: 'Facebook URL' },
                  { key: 'twitter', label: 'X (Twitter) URL' },
                  { key: 'linkedin', label: 'LinkedIn URL' },
                  { key: 'instagram', label: 'Instagram URL' },
                  { key: 'youtube', label: 'YouTube URL' },
                ].map((s) => (
                  <div key={s.key} className="mb-2">
                    <label className="form-label mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                      {s.label}
                    </label>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      value={footerData.social?.[s.key] || ''}
                      onChange={(e) =>
                        setFooterData((prev) => ({
                          ...prev,
                          social: { ...prev.social, [s.key]: e.target.value },
                        }))
                      }
                      placeholder={`https://${s.key}.com/...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Bottom Bar & Legal */}
          {activeTab === 'bottom' && (
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', color: '#0f172a' }}>
                Bottom Bar & Legal Links
              </h3>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '600' }}>
                  Copyright Text
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={footerData.bottomBar?.copyrightText || ''}
                  onChange={(e) =>
                    setFooterData((prev) => ({
                      ...prev,
                      bottomBar: { ...prev.bottomBar, copyrightText: e.target.value },
                    }))
                  }
                  placeholder={`© ${new Date().getFullYear()} Company. All rights reserved.`}
                />
              </div>

              <div className="mb-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label mb-0" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Legal Links
                  </label>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm py-0 px-2"
                    style={{ fontSize: '11px' }}
                    onClick={handleAddLegalLink}
                  >
                    + Add Link
                  </button>
                </div>

                {(footerData.bottomBar?.links || []).map((link) => (
                  <div
                    key={link.id}
                    style={{
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={link.label}
                      onChange={(e) => handleUpdateLegalLink(link.id, { label: e.target.value })}
                      placeholder="Label"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={link.url}
                      onChange={(e) => handleUpdateLegalLink(link.id, { url: e.target.value })}
                      placeholder="/privacy-policy/"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleRemoveLegalLink(link.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Styling & Theme */}
          {activeTab === 'settings' && (
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', color: '#0f172a' }}>
                Theme & Footer Styling
              </h3>

              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '600' }}>
                  Theme Preset
                </label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm flex-fill ${footerData.settings?.theme === 'dark' ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() =>
                      setFooterData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, theme: 'dark' },
                      }))
                    }
                  >
                    🌙 Dark Theme
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm flex-fill ${footerData.settings?.theme === 'light' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() =>
                      setFooterData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, theme: 'light' },
                      }))
                    }
                  >
                    ☀️ Light Theme
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Live Preview (Flex 1) */}
        <div style={{ flex: 1, backgroundColor: '#f1f5f9', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Viewport Toolbar */}
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Live Preview:
              </span>
              <span className="badge bg-light text-dark border">
                {viewport === 'desktop' ? 'Desktop View (100%)' : viewport === 'tablet' ? 'Tablet View (768px)' : 'Mobile View (375px)'}
              </span>
            </div>

            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${viewport === 'desktop' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewport('desktop')}
                title="Desktop (100%)"
              >
                💻 Desktop
              </button>
              <button
                type="button"
                className={`btn ${viewport === 'tablet' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewport('tablet')}
                title="Tablet (768px)"
              >
                📱 Tablet
              </button>
              <button
                type="button"
                className={`btn ${viewport === 'mobile' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewport('mobile')}
                title="Mobile (375px)"
              >
                📱 Mobile
              </button>
            </div>
          </div>

          {/* Feedback Alert */}
          {alert && (
            <div style={{ padding: '16px 24px 0' }}>
              <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                {alert.message}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAlert(null)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          )}

          {/* Click Notice Toast */}
          {clickNotice && (
            <div style={{ padding: '16px 24px 0' }}>
              <div className="alert alert-info alert-dismissible fade show d-flex align-items-center mb-0" role="alert" style={{ fontSize: '13px' }}>
                <span style={{ marginRight: '8px' }}>ℹ️</span>
                <span>{clickNotice}</span>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  onClick={() => setClickNotice(null)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          )}

          {/* Live Preview Container */}
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: viewportWidth,
                transition: 'width 0.25s ease-in-out',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                minHeight: '500px',
              }}
              onClickCapture={(e) => {
                const anchor = e.target.closest('a');
                if (anchor) {
                  e.preventDefault();
                  e.stopPropagation();
                  const linkName = anchor.innerText?.trim() || anchor.getAttribute('href') || 'Footer link';
                  setClickNotice(`"${linkName}" clicked. Link navigation is disabled in the editor preview to prevent losing unsaved progress.`);
                }
              }}
            >
              {/* Sample Page Content Simulator to demonstrate docking below content */}
              <div style={{ padding: '60px 40px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Custom Page Content Simulator
                  </span>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                    Welcome to {footerData.branding?.siteTitle || 'Our Site'}
                  </h1>
                  <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                    This simulator demonstrates how your site footer seamlessly docks at the bottom of your published Bizfire custom pages. Scroll down to see the live multi-column navigation, brand blurb, and contact information.
                  </p>
                </div>
              </div>

              {/* Footer CSS + Rendered HTML */}
              <div
                dangerouslySetInnerHTML={{
                  __html: `${compiled.css}\n${compiled.html}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
