import DataService from "@/api-services/data.service";
import { compilePage } from "./compile.js";

/**
 * ApiSource: PostgreSQL & Azure .NET implementation of the Editor DataSource interface
 */
export const ApiSource = {
  /**
   * Fetch Workspace metadata
   */
  async getWorkspace(workspaceId) {
    return await DataService.getWorkspace(workspaceId);
  },

  /**
   * Fetch the workspace's cloned theme bundle
   */
  async getThemeBundle(workspaceId) {
    return await DataService.getThemeBundle(workspaceId);
  },

  /**
   * Fetch list of page summaries
   */
  async getPageList(workspaceId) {
    return await DataService.getPageList(workspaceId);
  },

  /**
   * Fetch specific page content
   */
  async getPageContent(workspaceId, postId) {
    return await DataService.getPageContent(workspaceId, postId);
  },

  /**
   * Save page content
   */
  async savePageContent(workspaceId, postId, data) {
    return await DataService.savePageContent(workspaceId, postId, data);
  },

  /**
   * Publish page to WordPress and Azure PostgreSQL
   *
   * 1. Fetches current page content, theme bundle components, and workspace settings.
   * 2. Compiles component sections into clean HTML via Handlebars.
   * 3. Attempts to push compiled HTML to WordPress REST API meta (bizfire_page_html).
   * 4. Updates PostgreSQL pages table with compiled_html, status, and last_published_at.
   * 5. Records an immutable snapshot in the publications table.
   *
   * @param {string} workspaceId
   * @param {string|number} postId
   * @returns {Promise<{ success: boolean, publishedAt: string, liveUrl: string, compiledHtml: string, errors: Array, wpSyncStatus: string, wpResponse: object }>}
   */
  async publishPage(workspaceId, postId) {
    const page = await this.getPageContent(workspaceId, postId);
    if (!page) {
      throw new Error(`Page "${postId}" not found in workspace "${workspaceId}"`);
    }

    const themeBundle = await this.getThemeBundle(workspaceId);
    const workspace = await this.getWorkspace(workspaceId);

    // 1. Compile page sections into HTML using theme components
    const { html, errors } = compilePage(page.sections || [], themeBundle.components || []);
    const now = new Date().toISOString();

    // 2. Build live URL
    const siteBase = workspace?.wpSiteUrl ? workspace.wpSiteUrl.replace(/\/$/, "") : "";
    const cleanSlug = page.slug ? page.slug.replace(/^\//, "").replace(/\/$/, "") : "";
    const liveUrl = siteBase
      ? (cleanSlug ? `${siteBase}/${cleanSlug}/` : `${siteBase}/`)
      : `/live/${workspaceId}/${cleanSlug || page.postId}`;

    // 3. Attempt WordPress REST API publish if credentials are provided
    let wpResponse = null;
    let wpSyncStatus = "synced";
    let wpSyncError = null;

    if (workspace?.wpSiteUrl && workspace?.wpUser && workspace?.wpAppPassword) {
      const endpoint = `${siteBase}/wp-json/wp/v2/pages/${page.postId || postId}`;
      const authHeader = "Basic " + Buffer.from(`${workspace.wpUser}:${workspace.wpAppPassword}`).toString("base64");

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            meta: {
              bizfire_page_html: html,
            },
          }),
        });

        if (!res.ok) {
          throw new Error(`WordPress REST API error ${res.status}: ${res.statusText}`);
        }
        wpResponse = await res.json();
      } catch (wpErr) {
        console.warn("Direct WordPress REST publish warning:", wpErr.message);
        wpSyncStatus = "error";
        wpSyncError = wpErr.message;
      }
    }

    // 4. Update PostgreSQL pages table with compiled HTML and published status
    await DataService.updatePagePublishStatus(workspaceId, {
      postId: page.postId || postId,
      slug: page.slug,
      compiledHtml: html,
      publishedAt: now,
      liveUrl,
      wpSyncStatus,
      wpSyncError,
    });

    // 5. Insert immutable snapshot into publications table
    if (page.pageGuid) {
      await DataService.recordPublication({
        publication_guid: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined,
        workspace_guid: workspaceId,
        page_guid: page.pageGuid,
        wp_post_id: !isNaN(Number(page.postId)) ? Number(page.postId) : null,
        published_at: now,
        status: "published",
        snapshot_json: {
          title: page.title,
          slug: page.slug,
          sections: page.sections || [],
          compiled_length: html.length,
          errors: errors || [],
        },
      });
    }

    return {
      success: true,
      publishedAt: now,
      liveUrl,
      compiledHtml: html,
      errors,
      wpSyncStatus,
      wpResponse,
    };
  },
};

export default ApiSource;
