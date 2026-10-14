import Handlebars from 'handlebars';

/**
 * Compiles an array of page sections into clean HTML using component Handlebars templates.
 *
 * @param {Array<{ type: string, content: object }>} sections - The sections to render.
 * @param {Array<object> | Record<string, object>} components - Available component definitions.
 * @param {object} [options]
 * @param {boolean} [options.wrapSections=true] - Whether to wrap each section in <section data-component="...">
 * @returns {{ html: string, errors: Array<{ sectionIndex: number, type: string, error: string }> }}
 */
export function compilePage(sections = [], components = [], options = {}) {
  const { wrapSections = true } = options;
  const errors = [];

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

  const fullHtml = renderedSections.join('\n\n');

  return {
    html: fullHtml,
    errors
  };
}
