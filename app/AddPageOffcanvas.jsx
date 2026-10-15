'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Offcanvas,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert
} from 'react-bootstrap';

export default function AddPageOffcanvas({
  show,
  onHide,
  workspace,
  themeBundle
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    themeBundle?.pageTemplates?.[0]?.id || 'service-standard'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  function handleTitleChange(val) {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
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
      const template = themeBundle?.pageTemplates?.find(t => t.id === selectedTemplateId);
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
          postId: pageGuid,
          rowGuid: pageGuid,
          pageGuid: pageGuid,
          title: title.trim() || 'Untitled Page',
          slug: slug.trim() || `page-${pageGuid.slice(0, 8)}`,
          templateId: selectedTemplateId,
          sections: defaultSections
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create page');
      }

      onHide();
      router.push(`/editor/${workspace.workspaceId}/${pageGuid}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <Offcanvas
      show={show}
      onHide={isSubmitting ? undefined : onHide}
      placement="end"
      style={{ width: '560px', maxWidth: '92vw', zIndex: 1050 }}
    >
      <Offcanvas.Header closeButton={!isSubmitting} className="border-bottom pb-3">
        <div>
          <Offcanvas.Title className="fw-bold mb-1">Create New Workspace Page</Offcanvas.Title>
          <small className="text-muted">
            Initialize a new component-driven page for <strong>{workspace?.clientName}</strong>.
          </small>
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleCreatePage} className="d-flex flex-column gap-3">
          <Form.Group controlId="newPageTitle">
            <Form.Label className="fw-semibold">Page Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={title}
              required
              placeholder="e.g. Commercial AC Maintenance"
              onChange={e => handleTitleChange(e.target.value)}
              disabled={isSubmitting}
            />
          </Form.Group>

          <Form.Group controlId="newPageSlug">
            <Form.Label className="fw-semibold">URL Slug <span className="text-danger">*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text>/</InputGroup.Text>
              <Form.Control
                type="text"
                value={slug}
                required
                placeholder="commercial-ac-maintenance"
                onChange={e => setSlug(slugify(e.target.value))}
                disabled={isSubmitting}
              />
            </InputGroup>
            <Form.Text className="text-muted">
              Live URL will be: {workspace?.wpSiteUrl ? `${workspace.wpSiteUrl.replace(/\/$/, '')}/${slug || '...'}/` : `/${slug || '...'}`}
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="newPageTemplate">
            <Form.Label className="fw-semibold">Starting Page Layout Template <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={selectedTemplateId}
              onChange={e => setSelectedTemplateId(e.target.value)}
              disabled={isSubmitting}
            >
              {(themeBundle?.pageTemplates || []).map(tpl => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.components?.length || 0} sections)
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Initial sections will be populated with default content from this layout template. You can customize them in the editor.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="d-flex align-items-center gap-2"
            >
              {isSubmitting && <Spinner animation="border" size="sm" />}
              <span>{isSubmitting ? 'Creating Page...' : 'Create & Open Editor →'}</span>
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
