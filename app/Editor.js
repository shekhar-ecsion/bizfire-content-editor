'use client';

import { useMemo, useState, useRef } from 'react';
import Handlebars from 'handlebars';
import ImageCropperModal from './ImageCropperModal';

function generateUniqueId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// Ensure every item in array has a stable unique _id
function sanitizeArrayItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    if (typeof item === 'object' && item !== null && !item._id) {
      return { _id: generateUniqueId('itm'), ...item };
    }
    return item;
  });
}

// Generic helper to get a meaningful title for any array item without hardcoding
function getItemBadgeTitle(item, config, index) {
  if (!item || typeof item !== 'object') return `#${index + 1}`;
  if (config.labelField && item[config.labelField]) {
    const val = String(item[config.labelField]);
    return val.length > 28 ? `${val.slice(0, 28)}…` : val;
  }
  // Generic fallback: first non-empty string property that isn't _id
  for (const [k, v] of Object.entries(item)) {
    if (k !== '_id' && typeof v === 'string' && v.trim()) {
      return v.length > 28 ? `${v.slice(0, 28)}…` : v;
    }
  }
  return `#${index + 1}`;
}

// Generate empty default value from schema field configuration
function emptyFieldFromSchema(config) {
  if (config.default !== undefined) return structuredClone(config.default);
  if (config.type === 'image') return { src: '', alt: '' };
  if (config.type === 'array' || config.type === 'list') return [];
  if (config.type === 'number') return 0;
  if (config.type === 'boolean') return false;
  return '';
}

function emptyObjectFromSchema(schema) {
  return Object.fromEntries(
    Object.entries(schema).map(([key, config]) => [key, emptyFieldFromSchema(config)])
  );
}

// Image Editor Field with live thumbnail and interactive cropper
function ImageField({ name, config, value, onChange }) {
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempSrc, setTempSrc] = useState('');
  const fileInputRef = useRef(null);

  const imgSrc = value?.src || '';
  const imgAlt = value?.alt || '';

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempSrc(reader.result);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function openCropperWithCurrent() {
    setTempSrc(imgSrc);
    setIsCropperOpen(true);
  }

  return (
    <fieldset className="editor-field editor-field--image">
      <legend>{config.label || name}</legend>

      <div className="image-field-preview-box">
        {imgSrc ? (
          <div className="image-field-thumb-wrap">
            <img src={imgSrc} alt={imgAlt || 'Preview'} className="image-field-thumb" />
            {value?.provider && (
              <span className={`image-provider-badge is-${value.provider}`}>
                {value.provider === 'wordpress' ? 'WordPress Media' : 'Local Storage'}
              </span>
            )}
          </div>
        ) : (
          <div className="image-field-empty">
            <span>No image selected</span>
          </div>
        )}

        <div className="image-field-actions">
          <button
            type="button"
            className="btn-image-action btn-crop"
            onClick={openCropperWithCurrent}
            title="Crop &amp; Upload image"
          >
            ✂ Crop &amp; Upload
          </button>
          <label className="btn-image-action">
            <span>📁 Choose File</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>

      <div className="image-field-inputs">
        <label>
          <span>Image URL (or upload above)</span>
          <input
            value={imgSrc}
            placeholder="https://... or /uploads/..."
            onChange={e => onChange({ ...value, src: e.target.value })}
          />
        </label>
        <label>
          <span>Alt Text (SEO &amp; Accessibility)</span>
          <input
            value={imgAlt}
            placeholder="Descriptive image text"
            onChange={e => onChange({ ...value, alt: e.target.value })}
          />
        </label>
      </div>

      <ImageCropperModal
        isOpen={isCropperOpen}
        initialSrc={tempSrc || imgSrc}
        initialAlt={imgAlt}
        defaultRatio={config.aspectRatio || '16:9'}
        onClose={() => setIsCropperOpen(false)}
        onComplete={({ src, alt, provider, id }) => {
          onChange({
            ...value,
            src,
            alt: alt || imgAlt,
            provider,
            mediaId: id
          });
        }}
      />
    </fieldset>
  );
}

// 100% Generic Schema-to-Form Field Engine
function GenericField({ name, config, value, onChange }) {
  if (config.type === 'image') {
    return <ImageField name={name} config={config} value={value} onChange={onChange} />;
  }

  if (config.type === 'textarea') {
    return (
      <label className="editor-field">
        <span>{config.label || name}{config.required ? ' *' : ''}</span>
        <textarea
          rows={config.rows || 3}
          value={value || ''}
          required={!!config.required}
          onChange={e => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (config.type === 'array' || config.type === 'list') {
    const rawItems = Array.isArray(value) ? value : [];
    const items = sanitizeArrayItems(rawItems);
    const itemSchema = config.itemSchema || { text: { type: 'text', label: 'Item' } };
    const isComplex = typeof itemSchema === 'object' && !itemSchema.type;

    function addItem() {
      const newItem = isComplex ? emptyObjectFromSchema(itemSchema) : '';
      const itemWithId = typeof newItem === 'object'
        ? { _id: generateUniqueId('itm'), ...newItem }
        : newItem;
      onChange([...items, itemWithId]);
    }

    function updateItem(targetId, key, val) {
      const next = items.map(item => {
        if (item._id !== targetId) return item;
        return isComplex ? { ...item, [key]: val } : val;
      });
      onChange(next);
    }

    function removeItem(targetId) {
      onChange(items.filter(item => item._id !== targetId));
    }

    function moveItem(index, dir) {
      const targetIndex = index + dir;
      if (targetIndex < 0 || targetIndex >= items.length) return;
      const next = [...items];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      onChange(next);
    }

    return (
      <fieldset className="editor-field editor-field--array">
        <legend>
          <span>{config.label || name} <small>({items.length})</small></span>
        </legend>
        <div className="array-items-list">
          {items.map((item, idx) => {
            const stableKey = item._id || `item_${idx}`;
            const badgeTitle = getItemBadgeTitle(item, config, idx);

            return (
              <div key={stableKey} className="array-item-card">
                <div className="array-item-header">
                  <span className="array-item-badge">#{idx + 1} {badgeTitle}</span>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === items.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeItem(item._id)}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="array-item-fields">
                  {isComplex ? (
                    Object.entries(itemSchema).map(([fieldKey, fieldConf]) => (
                      <GenericField
                        key={fieldKey}
                        name={fieldKey}
                        config={fieldConf}
                        value={item?.[fieldKey]}
                        onChange={val => updateItem(item._id, fieldKey, val)}
                      />
                    ))
                  ) : (
                    <GenericField
                      name={`item_${idx}`}
                      config={itemSchema}
                      value={item}
                      onChange={val => updateItem(item._id, null, val)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" className="add-array-item-btn" onClick={addItem}>
          + Add {config.itemLabel || 'Item'}
        </button>
      </fieldset>
    );
  }

  return (
    <label className="editor-field">
      <span>{config.label || name}{config.required ? ' *' : ''}</span>
      <input
        type={config.type === 'number' ? 'number' : 'text'}
        value={value || ''}
        required={!!config.required}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

// 100% Generic Studio Editor Component
export default function Editor({
  availableThemes = [],
  initialTheme,
  initialThemeCss = '',
  initialComponents = [],
  initialVariants = [],
  initialPage = []
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [themeCss, setThemeCss] = useState(initialThemeCss);
  const [components, setComponents] = useState(initialComponents);
  const [variants, setVariants] = useState(initialVariants);
  const [page, setPage] = useState(() => initialPage.length ? initialPage : []);
  const [selectedId, setSelectedId] = useState(() => initialPage[0]?.instanceId || '');
  const [activeVariantId, setActiveVariantId] = useState(() => initialVariants[0]?.id || '');
  const [isLoadingTheme, setIsLoadingTheme] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const library = useMemo(() => Object.fromEntries(components.map(c => [c.id, c])), [components]);

  const selected = page.find(x => x.instanceId === selectedId) || page[0];
  const selectedDef = selected ? library[selected.type] : null;

  async function switchTheme(newThemeId) {
    if (newThemeId === theme?.id) return;
    setIsLoadingTheme(true);
    try {
      const res = await fetch(`/api/theme/${newThemeId}`);
      if (!res.ok) throw new Error('Failed to load theme data');
      const data = await res.json();
      setTheme(data.theme);
      setThemeCss(data.styleCss);
      setComponents(data.components);
      setVariants(data.variants);
      setPage(data.initialPage || []);
      setActiveVariantId(data.variants[0]?.id || '');
      setSelectedId(data.initialPage[0]?.instanceId || '');
    } catch (err) {
      console.error('Error switching theme:', err);
      alert('Error switching theme: ' + err.message);
    } finally {
      setIsLoadingTheme(false);
    }
  }

  function updateField(key, value) {
    setPage(p => p.map(x => x.instanceId === selectedId ? {
      ...x,
      content: { ...x.content, [key]: value }
    } : x));
  }

  function moveSection(id, direction) {
    setPage(p => {
      const arr = [...p];
      const i = arr.findIndex(x => x.instanceId === id);
      const j = i + direction;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  function removeSection(id) {
    setPage(p => {
      const next = p.filter(x => x.instanceId !== id);
      if (id === selectedId) {
        setSelectedId(next[0]?.instanceId || '');
      }
      return next;
    });
  }

  function addComponent(type) {
    const compDef = library[type];
    if (!compDef) return;
    const instanceId = generateUniqueId('inst');
    const content = compDef.defaults ? structuredClone(compDef.defaults) : emptyObjectFromSchema(compDef.schema);
    setPage(p => [...p, { instanceId, type, content }]);
    setSelectedId(instanceId);
  }

  // Load a complete Page Variant skeleton
  function loadVariant(variantId) {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;
    setActiveVariantId(variantId);

    const newPage = (variant.components || []).map((compRef, idx) => {
      const compDef = library[compRef.type];
      const instanceId = `inst_${Date.now()}_${idx + 1}`;
      const content = compDef?.defaults
        ? structuredClone(compDef.defaults)
        : (compDef?.schema ? emptyObjectFromSchema(compDef.schema) : {});
      return { instanceId, type: compRef.type, content };
    });

    setPage(newPage);
    setSelectedId(newPage[0]?.instanceId || '');
  }

  // Save current composition as a reusable Page Variant skeleton (Issue-4)
  function saveAsPageVariant() {
    const variantSkeleton = {
      id: `variant-custom-${Date.now().toString(36)}`,
      name: `Custom ${theme?.name || 'Theme'} Variant`,
      pageType: 'service',
      description: 'Exported from Bizfire Page Editor studio.',
      components: page.map(item => ({ type: item.type }))
    };

    const blob = new Blob([JSON.stringify(variantSkeleton, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${variantSkeleton.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Generate complete, self-contained, high-performance HTML
  function generateFullHtml() {
    const renderedSections = page.map(item => {
      const def = library[item.type];
      if (!def) return '';
      try {
        return Handlebars.compile(def.template)(item.content);
      } catch (err) {
        console.error('Handlebars compile error:', err);
        return '';
      }
    }).join('\n\n');

    const fontLink = theme?.fontUrl
      ? `<link rel="stylesheet" href="${theme.fontUrl}">`
      : `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Page - ${theme?.name || 'Bizfire'}</title>
  <meta name="description" content="Clean, fast standalone service page powered by Bizfire Component Engine.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${fontLink}
  <style>
${themeCss}
  </style>
</head>
<body>
${renderedSections}
</body>
</html>`;
  }

  function exportHtml() {
    const html = generateFullHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  }

  return (
    <main className="editor-shell">
      <header className="app-header">
        <div className="brand-wrap">
          <span className="brand-mark">B</span>
          <div className="brand-title">
            <strong>Bizfire Theme Playground</strong>
            <span>Canonical Git Theme Library Engine</span>
          </div>
        </div>

        <div className="header-actions">
          {availableThemes.length > 1 ? (
            <div className="theme-switcher-box">
              <label htmlFor="theme-select" className="theme-switcher-label">ACTIVE THEME:</label>
              <select
                id="theme-select"
                className="theme-select-input"
                value={theme?.id}
                onChange={e => switchTheme(e.target.value)}
                disabled={isLoadingTheme}
              >
                {availableThemes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} (v{t.version || '1.0'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span className="theme-pill-badge">
              Theme: {theme?.name || 'Trades Modern'} (v{theme?.version || '1.0'})
            </span>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={saveAsPageVariant}
            title="Export reusable layout skeleton without customer content"
          >
            Save as Variant ⤓
          </button>
          <button
            type="button"
            className={`export-button ${exportSuccess ? 'is-success' : ''}`}
            onClick={exportHtml}
            title="Download standalone, ultra-optimized HTML5 page"
          >
            {exportSuccess ? '✓ Exported page.html' : 'Export as HTML ⤓'}
          </button>
        </div>
      </header>

      <div className="page-editor-grid">
        {/* Left Sidebar: Page Composition & Variant Selector */}
        <aside className="component-list-panel">
          {variants.length > 0 && (
            <div className="variant-selector-box">
              <label>PAGE LAYOUT VARIANT</label>
              <select
                value={activeVariantId}
                onChange={e => loadVariant(e.target.value)}
              >
                {variants.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <p className="panel-kicker">PAGE SECTIONS ({page.length})</p>
            <div className="component-list">
              {page.map((item, idx) => {
                const def = library[item.type];
                const isSelected = item.instanceId === selectedId;

                return (
                  <div
                    key={item.instanceId}
                    className={`component-row ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedId(item.instanceId)}
                  >
                    <div className="component-row-info">
                      <small>SECTION {idx + 1}</small>
                      <strong>{def?.name || item.type}</strong>
                    </div>
                    <div className="row-actions">
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); moveSection(item.instanceId, -1); }}
                        disabled={idx === 0}
                        title="Move section up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); moveSection(item.instanceId, 1); }}
                        disabled={idx === page.length - 1}
                        title="Move section down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); removeSection(item.instanceId); }}
                        title="Remove section"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="add-component-box">
            <label>+ ADD COMPONENT</label>
            <select
              defaultValue=""
              onChange={e => {
                if (e.target.value) {
                  addComponent(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="" disabled>Choose component from library…</option>
              {components.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
              ))}
            </select>
          </div>

          <div className="sidebar-tools-box">
            <details>
              <summary>Page JSON State</summary>
              <pre>{JSON.stringify(page, null, 2)}</pre>
            </details>
            <details>
              <summary>Compiled HTML Markup</summary>
              <pre>{generateFullHtml()}</pre>
            </details>
          </div>
        </aside>

        {/* Center Sidebar: Generic Schema Form Engine */}
        <aside className="editor-panel">
          {selectedDef ? (
            <>
              <div className="panel-heading">
                <p className="panel-kicker">{selectedDef.category || 'COMPONENT'}</p>
                <h1>{selectedDef.name}</h1>
                <span>Inferred from <code>{selectedDef.id}/schema.json</code></span>
              </div>
              <div className="fields">
                {Object.entries(selectedDef.schema).map(([name, config]) => (
                  <GenericField
                    key={name}
                    name={name}
                    config={config}
                    value={selected.content?.[name]}
                    onChange={v => updateField(name, v)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>Select a section to edit.</p>
          )}
        </aside>

        {/* Right Panel: Live Handlebars Preview Styled by Active Theme */}
        <section className="preview-panel">
          <div className="preview-toolbar">
            <div>
              <strong>Live Page Preview</strong>
              <span>pure Handlebars + active theme style.css</span>
            </div>
            <button
              type="button"
              className={`export-button export-button--toolbar ${exportSuccess ? 'is-success' : ''}`}
              onClick={exportHtml}
              title="Download standalone HTML file"
            >
              {exportSuccess ? '✓ Exported!' : 'Export HTML ⤓'}
            </button>
          </div>

          <div className="preview-canvas page-preview">
            {/* Inject Active Theme Google Font & CSS into preview */}
            {theme?.fontUrl && (
              <link rel="stylesheet" href={theme.fontUrl} />
            )}
            <style dangerouslySetInnerHTML={{ __html: themeCss }} />

            {page.map(item => {
              const def = library[item.type];
              if (!def) return null;
              const html = Handlebars.compile(def.template)(item.content);
              const isSelected = item.instanceId === selectedId;

              return (
                <div
                  key={item.instanceId}
                  className={`preview-component ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedId(item.instanceId)}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
