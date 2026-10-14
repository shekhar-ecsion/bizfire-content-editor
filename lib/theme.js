import fs from 'node:fs';
import path from 'node:path';

const themesRoot = () => path.join(process.cwd(), 'themes');

export function listThemes() {
  const root = themesRoot();
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const themeJsonPath = path.join(root, d.name, 'theme.json');
      if (fs.existsSync(themeJsonPath)) {
        return JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));
      }
      return { id: d.name, name: d.name };
    });
}

export function loadTheme(themeId = 'trades-modern') {
  const root = themesRoot();
  const themeDir = path.join(root, themeId);

  if (!fs.existsSync(themeDir)) {
    throw new Error(`Theme "${themeId}" not found at ${themeDir}`);
  }

  // 1. Theme metadata
  const themeMetaPath = path.join(themeDir, 'theme.json');
  const theme = fs.existsSync(themeMetaPath)
    ? JSON.parse(fs.readFileSync(themeMetaPath, 'utf8'))
    : { id: themeId, name: themeId };

  // 2. Pure Theme CSS
  const stylePath = path.join(themeDir, 'style.css');
  const styleCss = fs.existsSync(stylePath)
    ? fs.readFileSync(stylePath, 'utf8')
    : '';

  // 3. Components
  const componentsDir = path.join(themeDir, 'components');
  const components = [];
  if (fs.existsSync(componentsDir)) {
    const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const compDir = path.join(componentsDir, entry.name);
      const schemaPath = path.join(compDir, 'schema.json');
      const tplPath = path.join(compDir, 'template.html');
      const defPath = path.join(compDir, 'defaults.json');

      if (fs.existsSync(schemaPath) && fs.existsSync(tplPath)) {
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        const template = fs.readFileSync(tplPath, 'utf8');
        const defaults = fs.existsSync(defPath)
          ? JSON.parse(fs.readFileSync(defPath, 'utf8'))
          : {};

        components.push({
          id: entry.name,
          name: schema.name || entry.name,
          category: schema.category || 'General',
          schema: schema.fields || schema,
          rawSchema: schema,
          template,
          defaults
        });
      }
    }
  }

  // 4. Page Variants
  const pagesDir = path.join(themeDir, 'pages');
  const variants = [];
  if (fs.existsSync(pagesDir)) {
    const entries = fs.readdirSync(pagesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        const variantData = JSON.parse(fs.readFileSync(path.join(pagesDir, entry.name), 'utf8'));
        variants.push(variantData);
      }
    }
  }

  return {
    theme,
    styleCss,
    components,
    variants
  };
}

export function buildPageFromVariant(componentsList, variant) {
  const library = Object.fromEntries(componentsList.map(c => [c.id, c]));
  const timestamp = Date.now();

  return (variant.components || []).map((compRef, index) => {
    const compDef = library[compRef.type];
    const instanceId = `inst_${timestamp}_${index + 1}`;
    const content = compDef?.defaults ? structuredClone(compDef.defaults) : {};

    return {
      instanceId,
      type: compRef.type,
      content
    };
  });
}
