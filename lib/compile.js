import Handlebars from 'handlebars';

/**
 * Compiles an array of page sections into clean HTML using component Handlebars templates,
 * deduplicating component-level CSS and cascading workspace custom CSS.
 *
 * @param {Array<{ type: string, content: object }>} sections - The sections to render.
 * @param {Array<object> | Record<string, object>} components - Available component definitions.
 * @param {object} [options]
 * @param {boolean} [options.wrapSections=true] - Whether to wrap each section in <section data-component="...">
 * @param {string} [options.customCss=''] - Workspace-level global custom CSS overrides (Layer 3).
 * @param {boolean} [options.includeStyles=true] - Whether to prepend the scoped <style> block.
 * @returns {{ html: string, rawSectionsHtml: string, componentCss: string, customCss: string, combinedScopedCss: string, errors: Array<{ sectionIndex: number, type: string, error: string }> }}
 */
export function compilePage(sections = [], components = [], options = {}) {
  const { wrapSections = true, customCss = '', includeStyles = true } = options;
  const errors = [];
  const usedTypes = new Set();
  const componentCssList = [];

  // Index components by id for O(1) lookup
  const compMap = Array.isArray(components)
    ? Object.fromEntries(components.map(c => [c.id, c]))
    : components;

  const renderedSections = (sections || []).map((section, index) => {
    const compDef = compMap[section.type];

    if (!compDef) {
      const errMsg = `Component "${section.type}" not found in theme`;
      errors.push({ sectionIndex: index, type: section.type, error: errMsg });
      return `<!-- Error: ${errMsg} -->`;
    }

    // Collect deduplicated component styles (Layer 2)
    if (!usedTypes.has(section.type)) {
      usedTypes.add(section.type);
      const css = compDef.css || compDef.style_css || '';
      if (css && css.trim()) {
        componentCssList.push(`/* ── Component: ${section.type} ── */\n${css.trim()}`);
      }
    }

    try {
      const template = Handlebars.compile(compDef.template || '');
      const innerHtml = template(section.content || {});

      if (wrapSections) {
        return `<section class="bizfire-section" data-component="${section.type}">\n${innerHtml}\n</section>`;
      }
      return innerHtml;
    } catch (err) {
      const errMsg = `Failed to render component "${section.type}": ${err.message}`;
      errors.push({ sectionIndex: index, type: section.type, error: errMsg });
      return `<!-- Error: ${errMsg} -->`;
    }
  });

  const rawSectionsHtml = renderedSections.join('\n\n');

  // Build Layer 2 (Component CSS) + Layer 3 (Workspace Custom CSS) style block
  const styleBlocks = [];
  if (componentCssList.length > 0) {
    styleBlocks.push(componentCssList.join('\n\n'));
  }
  if (customCss && customCss.trim()) {
    styleBlocks.push(`/* ── Workspace Custom CSS (Layer 3 Overrides) ── */\n${customCss.trim()}`);
  }

  const combinedScopedCss = styleBlocks.join('\n\n');

  let outputHtml = rawSectionsHtml;
  if (includeStyles && combinedScopedCss) {
    outputHtml = `<style id="bizfire-scoped-styles">\n${combinedScopedCss}\n</style>\n\n${rawSectionsHtml}`;
  }

  return {
    html: outputHtml,
    rawSectionsHtml,
    componentCss: componentCssList.join('\n\n'),
    customCss: customCss || '',
    combinedScopedCss,
    errors
  };
}

