'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Offcanvas,
  Button,
  Form,
  Table,
  Spinner,
  Badge,
  Alert,
  ProgressBar
} from 'react-bootstrap';

export default function ImportWpPageOffcanvas({
  show,
  onHide,
  workspace,
  themeBundle,
  existingPostIds = new Set(),
  onImportSuccess
}) {
  const router = useRouter();
  const [wpPages, setWpPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState(new Set());

  // In-flight progress
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null); // { current, total, currentTitle }
  const [importingSingleId, setImportingSingleId] = useState(null);

  // Auto-fetch pages from WordPress when drawer opens
  useEffect(() => {
    if (!show || !workspace?.workspaceId) return;

    let isMounted = true;
    async function fetchWpPages() {
      setIsLoading(true);
      setError(null);
      setSelectedIds(new Set());
      setImportProgress(null);

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

    fetchWpPages();

    return () => {
      isMounted = false;
    };
  }, [show, workspace?.workspaceId]);

  // Filter pages by search input
  const filteredPages = useMemo(() => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return wpPages;
    return wpPages.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q) ||
      String(p.postId).includes(q)
    );
  }, [wpPages, searchFilter]);

  // Unimported available pages in current search
  const availablePages = useMemo(() => {
    return filteredPages.filter(p => !existingPostIds.has(Number(p.postId)));
  }, [filteredPages, existingPostIds]);

  // "Select All" toggle state
  const isAllSelected = availablePages.length > 0 && availablePages.every(p => selectedIds.has(p.postId));
  const isPartiallySelected = availablePages.some(p => selectedIds.has(p.postId)) && !isAllSelected;

  function handleToggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const next = new Set(selectedIds);
      availablePages.forEach(p => next.add(p.postId));
      setSelectedIds(next);
    }
  }

  function handleToggleRow(postId) {
    const next = new Set(selectedIds);
    if (next.has(postId)) {
      next.delete(postId);
    } else {
      next.add(postId);
    }
    setSelectedIds(next);
  }

  // Build standard default template sections automatically without confusing the user
  function buildDefaultSections() {
    const defaultTemplateId = themeBundle?.pageTemplates?.[0]?.id || 'service-standard';
    const template = themeBundle?.pageTemplates?.find(t => t.id === defaultTemplateId);
    const library = Object.fromEntries((themeBundle?.components || []).map(c => [c.id, c]));

    const sections = (template?.components || []).map((compRef) => {
      const compDef = library[compRef.type];
      return {
        type: compRef.type,
        content: compDef?.defaults ? structuredClone(compDef.defaults) : {}
      };
    });

    return { templateId: defaultTemplateId, sections };
  }

  // Single page import & immediate open in editor
  async function handleImportSingle(wpPage) {
    setImportingSingleId(wpPage.postId);
    setIsImporting(true);
    setError(null);

    try {
      const { templateId, sections } = buildDefaultSections();
      const pageGuid = wpPage.guid || (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'p_' + Date.now().toString(36));

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
          templateId,
          sections
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to import page');
      }

      const savedData = await res.json();
      if (onImportSuccess) {
        onImportSuccess([wpPage.postId]);
      }

      onHide();
      router.push(`/editor/${workspace.workspaceId}/${savedData.rowGuid || pageGuid}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setImportingSingleId(null);
      setIsImporting(false);
    }
  }

  // Batch import handler for selected or all pages
  async function handleBatchImport(pagesToImport) {
    if (!pagesToImport || pagesToImport.length === 0) return;

    setIsImporting(true);
    setError(null);
    const { templateId, sections } = buildDefaultSections();
    const importedPostIds = [];

    try {
      const total = pagesToImport.length;
      for (let i = 0; i < total; i++) {
        const wpPage = pagesToImport[i];
        setImportProgress({
          current: i + 1,
          total,
          currentTitle: wpPage.title
        });

        const pageGuid = wpPage.guid || (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'p_' + Date.now().toString(36) + '_' + i);

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
            templateId,
            sections
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(`Failed importing "${wpPage.title}": ${errData.error || 'Server error'}`);
        }

        importedPostIds.push(wpPage.postId);
      }

      // Deselect imported
      const nextSelected = new Set(selectedIds);
      importedPostIds.forEach(id => nextSelected.delete(id));
      setSelectedIds(nextSelected);

      if (onImportSuccess) {
        onImportSuccess(importedPostIds);
      }

      // Re-fetch pages to update studio status
      router.refresh();
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsImporting(false);
      setImportProgress(null);
    }
  }

  const selectedPages = useMemo(() => {
    return availablePages.filter(p => selectedIds.has(p.postId));
  }, [availablePages, selectedIds]);

  const siteDisplay = workspace?.wpSiteUrl
    ? workspace.wpSiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : 'WordPress';

  return (
    <Offcanvas
      show={show}
      onHide={isImporting ? undefined : onHide}
      placement="end"
      style={{ width: '800px', maxWidth: '95vw', zIndex: 1050 }}
    >
      <Offcanvas.Header closeButton={!isImporting} className="border-bottom pb-3">
        <div>
          <Offcanvas.Title className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-bold">Import Pages from WordPress</span>
            <Badge bg="primary" pill style={{ fontSize: '12px' }}>
              {siteDisplay}
            </Badge>
          </Offcanvas.Title>
          <small className="text-muted">
            Select one, multiple, or all WordPress pages to bring into the Bizfire Content Editor studio.
          </small>
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column p-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
            {error}
          </Alert>
        )}

        {/* Live Batch Import Progress */}
        {importProgress && (
          <Alert variant="info" className="py-2 px-3 mb-3 border-0 shadow-sm" style={{ background: '#f0f9ff', color: '#0369a1' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-semibold small d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" variant="primary" />
                Importing {importProgress.current} of {importProgress.total}: <em>{importProgress.currentTitle}</em>
              </span>
              <span className="small fw-bold">
                {Math.round((importProgress.current / importProgress.total) * 100)}%
              </span>
            </div>
            <ProgressBar
              animated
              now={(importProgress.current / importProgress.total) * 100}
              variant="primary"
              style={{ height: '6px' }}
            />
          </Alert>
        )}

        {/* Toolbar: Search & Bulk Action Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-stretch align-items-sm-center mb-3">
          <div style={{ flex: 1, minWidth: '220px' }}>
            <Form.Control
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search by title, slug, or ID..."
              disabled={isImporting}
              size="sm"
            />
          </div>

          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="primary"
              size="sm"
              disabled={selectedPages.length === 0 || isImporting}
              onClick={() => handleBatchImport(selectedPages)}
              className="d-flex align-items-center gap-1"
            >
              {isImporting && selectedPages.length > 0 && <Spinner animation="border" size="sm" />}
              <span>Import Selected ({selectedPages.length})</span>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              disabled={availablePages.length === 0 || isImporting}
              onClick={() => handleBatchImport(availablePages)}
              className="d-flex align-items-center gap-1"
            >
              {isImporting && selectedPages.length === 0 && <Spinner animation="border" size="sm" />}
              <span>Import All ({availablePages.length})</span>
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        {isLoading ? (
          <div className="text-center my-auto py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <div className="mt-3 fw-semibold text-secondary">
              Connecting to WordPress REST API...
            </div>
            <small className="text-muted">
              Loading published pages from {siteDisplay}
            </small>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center my-auto py-5 text-muted">
            <p className="mb-1 fw-semibold">
              {wpPages.length === 0 ? 'No published pages found on WordPress.' : 'No pages match your search.'}
            </p>
            <small>Verify that pages exist and are published on your site.</small>
          </div>
        ) : (
          <div className="table-responsive border rounded flex-grow-1" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
            <Table hover className="align-middle mb-0" style={{ fontSize: '13.5px' }}>
              <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                <tr>
                  <th style={{ width: '42px', textAlign: 'center' }}>
                    <Form.Check
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isPartiallySelected;
                      }}
                      onChange={handleToggleSelectAll}
                      disabled={availablePages.length === 0 || isImporting}
                      aria-label="Select all available pages"
                    />
                  </th>
                  <th style={{ width: '85px' }}>WP ID</th>
                  <th>Page Title & Permalink</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map(wp => {
                  const isAlreadyImported = existingPostIds.has(Number(wp.postId));
                  const isSelected = selectedIds.has(wp.postId);
                  const isThisImporting = importingSingleId === wp.postId;

                  return (
                    <tr key={wp.postId} className={isSelected ? 'table-primary-subtle' : undefined}>
                      <td style={{ textAlign: 'center' }}>
                        <Form.Check
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(wp.postId)}
                          disabled={isAlreadyImported || isImporting}
                          aria-label={`Select page ${wp.title}`}
                        />
                      </td>
                      <td>
                        <Badge bg="secondary" pill style={{ fontSize: '11px', fontWeight: 600 }}>
                          #{wp.postId}
                        </Badge>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{wp.title}</div>
                        <small className="text-muted font-monospace">/{wp.slug}</small>
                      </td>
                      <td>
                        <Badge bg="success" pill style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                          {wp.status}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isAlreadyImported ? (
                          <Badge bg="light" text="secondary" pill style={{ border: '1px solid #cbd5e1', padding: '5px 10px' }}>
                            Already in Studio
                          </Badge>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isImporting}
                            onClick={() => handleImportSingle(wp)}
                            style={{ fontSize: '12px', padding: '4px 10px' }}
                          >
                            {isThisImporting ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-1" />
                                Importing...
                              </>
                            ) : (
                              'Import & Edit →'
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}

        {/* Footer Stats & Close */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
          <small className="text-muted">
            Found <strong>{filteredPages.length}</strong> pages on WordPress
            {availablePages.length > 0 && (
              <> · <strong>{availablePages.length}</strong> available to import</>
            )}
            {selectedPages.length > 0 && (
              <> · <span className="text-primary fw-semibold">{selectedPages.length} selected</span></>
            )}
          </small>

          <Button
            variant="secondary"
            size="sm"
            onClick={onHide}
            disabled={isImporting}
          >
            Close
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
