import fs from 'node:fs';
import path from 'node:path';
import { compilePage } from './compile.js';

const workspacesRoot = () => path.join(process.cwd(), 'workspaces');

/**
 * Strips UI-only keys (like instanceId) from sections before persisting.
 * Retains internal content IDs (like item._id in arrays) which belong to content.
 */
function sanitizeSections(sections = []) {
  return sections.map(section => {
    const { instanceId, ...rest } = section;
    return {
      type: rest.type,
      content: rest.content || {}
    };
  });
}

/**
 * Get workspace metadata
 */
export async function getWorkspace(workspaceId) {
  const wsDir = path.join(workspacesRoot(), workspaceId);
  const wsConfigPath = path.join(wsDir, 'workspace.json');

  if (!fs.existsSync(wsConfigPath)) {
    throw new Error(`Workspace "${workspaceId}" not found at ${wsConfigPath}`);
  }

  const raw = fs.readFileSync(wsConfigPath, 'utf8');
  const data = JSON.parse(raw);
  return {
    workspaceId: data.workspaceId || workspaceId,
    clientName: data.clientName || 'Untitled Client',
    themeId: data.themeId || 'trades-modern',
    wpSiteUrl: data.wpSiteUrl || '',
    wpUser: data.wpUser || '',
    wpAppPassword: data.wpAppPassword || '',
    createdAt: data.createdAt || null
  };
}

/**
 * Get the workspace's cloned theme bundle (styles, components, page templates)
 */
export async function getThemeBundle(workspaceId) {
  const wsDir = path.join(workspacesRoot(), workspaceId);
  const themeDir = path.join(wsDir, 'theme');

  if (!fs.existsSync(themeDir)) {
    throw new Error(`Theme directory for workspace "${workspaceId}" not found at ${themeDir}`);
  }

  // 1. Theme metadata
  const themeJsonPath = path.join(themeDir, 'theme.json');
  const theme = fs.existsSync(themeJsonPath)
    ? JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'))
    : { id: 'custom', name: 'Workspace Cloned Theme' };

  // 2. CSS Stylesheet
  const styleCssPath = path.join(themeDir, 'style.css');
  const styleCss = fs.existsSync(styleCssPath)
    ? fs.readFileSync(styleCssPath, 'utf8')
    : '';

  // 3. Components
  const components = [];
  const componentsDir = path.join(themeDir, 'components');
  if (fs.existsSync(componentsDir)) {
    const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const compDir = path.join(componentsDir, entry.name);
      const schemaPath = path.join(compDir, 'schema.json');
      const tplPath = path.join(compDir, 'template.html');
      const defPath = path.join(compDir, 'defaults.json');
      const compStylePath = path.join(compDir, 'style.css');

      if (fs.existsSync(schemaPath) && fs.existsSync(tplPath)) {
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        const template = fs.readFileSync(tplPath, 'utf8');
        const defaults = fs.existsSync(defPath)
          ? JSON.parse(fs.readFileSync(defPath, 'utf8'))
          : {};
        const css = fs.existsSync(compStylePath)
          ? fs.readFileSync(compStylePath, 'utf8')
          : '';

        components.push({
          id: entry.name,
          name: schema.name || entry.name,
          category: schema.category || 'General',
          schema: schema.fields || schema,
          rawSchema: schema,
          template,
          defaults,
          css
        });
      }
    }
  }

  // 4. Page Templates (look in page-templates/ or legacy pages/)
  const pageTemplates = [];
  let templatesDir = path.join(themeDir, 'page-templates');
  if (!fs.existsSync(templatesDir)) {
    templatesDir = path.join(themeDir, 'pages');
  }

  if (fs.existsSync(templatesDir)) {
    const entries = fs.readdirSync(templatesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        try {
          const tpl = JSON.parse(fs.readFileSync(path.join(templatesDir, entry.name), 'utf8'));
          pageTemplates.push(tpl);
        } catch (err) {
          console.error(`Error parsing template ${entry.name}:`, err);
        }
      }
    }
  }

  // 5. Workspace Global Custom CSS (Layer 3 overrides)
  const customCssPath = path.join(wsDir, 'custom.css');
  const customCss = fs.existsSync(customCssPath)
    ? fs.readFileSync(customCssPath, 'utf8')
    : '';

  return {
    theme,
    styleCss,
    components,
    pageTemplates,
    customCss
  };
}

/**
 * List all pages for a workspace (summary view)
 */
export async function getPageList(workspaceId) {
  const pagesDir = path.join(workspacesRoot(), workspaceId, 'pages');
  if (!fs.existsSync(pagesDir)) {
    return [];
  }

  const entries = fs.readdirSync(pagesDir, { withFileTypes: true });
  const list = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      try {
        const filePath = path.join(pagesDir, entry.name);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        list.push({
          postId: Number(data.postId || path.basename(entry.name, '.json')),
          slug: data.slug || '',
          title: data.title || 'Untitled Page',
          templateId: data.templateId || '',
          lastSavedAt: data.lastSavedAt || null,
          lastPublishedAt: data.lastPublishedAt || null
        });
      } catch (err) {
        console.error(`Failed to read page summary for ${entry.name}:`, err);
      }
    }
  }

  return list.sort((a, b) => a.postId - b.postId);
}

/**
 * Get full page content by postId
 */
export async function getPageContent(workspaceId, postId) {
  const pagePath = path.join(workspacesRoot(), workspaceId, 'pages', `${postId}.json`);

  if (!fs.existsSync(pagePath)) {
    throw new Error(`Page ${postId} not found for workspace "${workspaceId}"`);
  }

  const raw = fs.readFileSync(pagePath, 'utf8');
  const data = JSON.parse(raw);

  return {
    postId: Number(data.postId || postId),
    slug: data.slug || '',
    title: data.title || '',
    templateId: data.templateId || '',
    lastSavedAt: data.lastSavedAt || null,
    lastPublishedAt: data.lastPublishedAt || null,
    sections: data.sections || []
  };
}

/**
 * Save page content JSON (strips instanceId from sections before writing)
 */
export async function savePageContent(workspaceId, postId, pageData) {
  const pagesDir = path.join(workspacesRoot(), workspaceId, 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  const pagePath = path.join(pagesDir, `${postId}.json`);
  let existing = {};

  if (fs.existsSync(pagePath)) {
    try {
      existing = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
    } catch {
      existing = {};
    }
  }

  const now = new Date().toISOString();
  const sanitizedSections = sanitizeSections(pageData.sections || existing.sections || []);

  const toSave = {
    postId: Number(postId),
    slug: pageData.slug ?? existing.slug ?? '',
    title: pageData.title ?? existing.title ?? 'Untitled Page',
    templateId: pageData.templateId ?? existing.templateId ?? '',
    lastSavedAt: now,
    lastPublishedAt: existing.lastPublishedAt || null,
    sections: sanitizedSections
  };

  fs.writeFileSync(pagePath, JSON.stringify(toSave, null, 2), 'utf8');

  return {
    success: true,
    savedAt: now,
    data: toSave
  };
}

/**
 * Publish page: compile sections to HTML and update lastPublishedAt
 */
export async function publishPage(workspaceId, postId) {
  const page = await getPageContent(workspaceId, postId);
  const themeBundle = await getThemeBundle(workspaceId);
  const workspace = await getWorkspace(workspaceId);

  // 1. Compile HTML (with Layer 2 component styles and Layer 3 custom CSS)
  const { html, errors } = compilePage(page.sections, themeBundle.components, {
    customCss: themeBundle.customCss || ''
  });
  const now = new Date().toISOString();

  // 2. If WordPress credentials exist, attempt push to WordPress REST API
  let wpResponse = null;
  if (workspace.wpSiteUrl && workspace.wpUser && workspace.wpAppPassword) {
    const endpoint = `${workspace.wpSiteUrl.replace(/\/$/, '')}/wp-json/wp/v2/pages/${postId}`;
    const authHeader = 'Basic ' + Buffer.from(`${workspace.wpUser}:${workspace.wpAppPassword}`).toString('base64');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          meta: {
            bizfire_page_html: html
          }
        })
      });

      if (!res.ok) {
        throw new Error(`WordPress API returned ${res.status}: ${res.statusText}`);
      }

      wpResponse = await res.json();
    } catch (err) {
      console.error('WordPress publish failed:', err);
      // We still update local file with compiled HTML and mark error
      return {
        success: false,
        error: `Compiled successfully, but failed to push to WordPress: ${err.message}`,
        compiledHtml: html,
        errors
      };
    }
  }

  // 3. Update lastPublishedAt in local storage
  const pagePath = path.join(workspacesRoot(), workspaceId, 'pages', `${postId}.json`);
  if (fs.existsSync(pagePath)) {
    const raw = fs.readFileSync(pagePath, 'utf8');
    const data = JSON.parse(raw);
    data.lastPublishedAt = now;
    fs.writeFileSync(pagePath, JSON.stringify(data, null, 2), 'utf8');
  }

  const liveUrl = workspace.wpSiteUrl
    ? `${workspace.wpSiteUrl.replace(/\/$/, '')}/${page.slug}`
    : `https://example.com/${page.slug}`;

  return {
    success: true,
    publishedAt: now,
    liveUrl,
    compiledHtml: html,
    errors,
    wpResponse
  };
}

/**
 * Fetch Site Header configuration for workspace
 */
export async function getHeader(workspaceId) {
  const wsDir = workspaceDir(workspaceId);
  const headerFile = path.join(wsDir, 'header.json');
  if (fs.existsSync(headerFile)) {
    return JSON.parse(fs.readFileSync(headerFile, 'utf8'));
  }
  const workspace = await getWorkspace(workspaceId);
  const pages = await getPageList(workspaceId);
  return {
    workspaceId,
    branding: {
      siteTitle: workspace?.clientName || 'Demo Site',
      logoUrl: '',
      logoWidth: 180,
      tagline: 'Quality Service You Can Trust',
    },
    contact: {
      phone: '(609) 555-0100',
      phoneLabel: 'Call Us 24/7',
      showPhone: true,
    },
    cta: {
      text: 'Schedule Service',
      url: '/contact/',
      showCta: true,
    },
    settings: {
      isSticky: true,
      showTopBar: true,
      topBarText: 'Proudly Serving Local Homeowners & Businesses',
    },
    items: (pages || []).slice(0, 5).map((p, idx) => ({
      id: `item-${idx}`,
      label: p.title || p.slug,
      url: `/${p.slug}/`,
      target: '_self',
    })),
  };
}

/**
 * Save Site Header configuration
 */
export async function saveHeader(workspaceId, headerData) {
  const wsDir = workspaceDir(workspaceId);
  const headerFile = path.join(wsDir, 'header.json');
  fs.writeFileSync(headerFile, JSON.stringify(headerData, null, 2), 'utf8');
  return { success: true, savedAt: new Date().toISOString(), headerData };
}

/**
 * Publish Site Header
 */
export async function publishHeader(workspaceId, headerData) {
  await saveHeader(workspaceId, headerData);
  return { success: true, publishedAt: new Date().toISOString() };
}

/**
 * Save workspace global custom CSS (Layer 3 overrides)
 */
export async function saveWorkspaceCustomCss(workspaceId, customCss) {
  const customCssPath = path.join(workspacesRoot(), workspaceId, 'custom.css');
  fs.writeFileSync(customCssPath, customCss || '', 'utf8');
  return {
    success: true,
    workspaceId,
    customCss: customCss || '',
    savedAt: new Date().toISOString()
  };
}


