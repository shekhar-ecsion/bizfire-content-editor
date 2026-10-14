import {
  azureAxiosInstance,
  bizFireAxiosInstance,
  multipartInstance,
} from "./api.js";
import { API_URL } from "../constant.js";

class DataService {
  // =========================================================================
  // Core Azure .NET Generic SQL Gateway Methods (Matching Platform Standard)
  // =========================================================================

  /**
   * Secure select query via Azure .NET API gateway
   * @param {Object} payload e.g. { data_json: { table_name: "bizfire_themes", request: { ... } } }
   */
  async secureSelect(payload = {}) {
    return azureAxiosInstance.post("secure-select", {
      request_json: payload,
    });
  }

  /**
   * Secure insert query via Azure .NET API gateway
   * @param {Object|Array} payload record(s) to insert
   * @param {string} tableName target table
   */
  async secureInsert(payload = {}, tableName) {
    return azureAxiosInstance.post("secure-insert", {
      request_json: {
        data_json: {
          request: payload,
          table_name: tableName,
        },
      },
    });
  }

  /**
   * Secure update query via Azure .NET API gateway
   * @param {Object|Array} payload record(s) to update
   * @param {string} tableName target table
   */
  async secureUpdate(payload, tableName) {
    return azureAxiosInstance.post("secure-update", {
      request_json: {
        data_json: {
          request: payload,
          table_name: tableName,
        },
      },
    });
  }

  /**
   * Secure merge / upsert keyed on row_guid
   * @param {Object|Array} payload record(s) with row_guid
   * @param {string} tableName target table
   */
  async merge(payload, tableName) {
    return azureAxiosInstance.post("secure-merge", {
      request_json: {
        data_json: {
          request: payload,
          table_name: tableName,
        },
      },
    });
  }

  /**
   * Secure merge / upsert with custom composite keys
   * @param {Object|Array} payload record(s)
   * @param {string} tableName target table
   * @param {Array<string>} keys composite key column names
   */
  async mergeWithCompositeKeys(payload, tableName, keys) {
    return azureAxiosInstance.post("secure-merge-with-composite-keys", {
      request_json: {
        data_json: {
          request: payload,
          table_name: tableName,
          composite_keys: keys,
        },
      },
    });
  }

  /**
   * Invoke a custom stored procedure or PostgreSQL function
   * @param {Object} payload SP name and parameters
   */
  async secureInvokeCustomSP(payload = {}) {
    return azureAxiosInstance.post("invoke-custom-sp", {
      ...payload,
    });
  }

  /**
   * Upload files with metadata to storage
   */
  async uploadFilesWithText(payload = {}) {
    return multipartInstance.post("storage/upload-files-with-text", payload);
  }

  /**
   * External platform connector call
   */
  async callExternalApi(payload = {}) {
    return azureAxiosInstance.post("external-api/external-api-call", {
      request: payload,
    });
  }

  // =========================================================================
  // Bizfire Central User / Workspace Services
  // =========================================================================

  async bizfireSecureSelect(payload) {
    return bizFireAxiosInstance.post("secure-select", {
      request_json: payload,
    });
  }

  async bizfiresSecureInsert(payload, tableName) {
    return bizFireAxiosInstance.post("secure-insert", {
      request_json: {
        data_json: {
          request: payload,
          table_name: tableName,
        },
      },
    });
  }

  // =========================================================================
  // High-Level Content Editor Service Methods
  // =========================================================================

  /**
   * Fetch Workspace metadata
   * @param {string} workspaceId Workspace GUID
   */
  async getWorkspace(workspaceId) {
    try {
      const response = await this.secureSelect({
        data_json: {
          table_name: "user_workspaces",
          request: { workspace_guid: workspaceId },
        },
      });
      const data = response.data?.data || response.data || [];
      const ws = Array.isArray(data) ? data[0] : data;
      return {
        workspaceId: ws?.workspace_guid || workspaceId,
        clientName: ws?.workspace_name || "Client Site",
        themeId: ws?.data_json?.themeId || "trades-modern",
        wpSiteUrl: ws?.site_url || "",
      };
    } catch (err) {
      console.error("Error fetching workspace metadata:", err);
      throw err;
    }
  }

  /**
   * Fetch cloned theme bundle (theme, styleCss, components, pageTemplates) for workspace
   * @param {string} workspaceId Workspace GUID
   */
  async getThemeBundle(workspaceId) {
    try {
      // 1. Fetch workspace theme
      const themeRes = await this.secureSelect({
        data_json: {
          table_name: "bizfire_themes",
          request: { workspace_guid: workspaceId, is_deleted: false },
        },
      });
      const themeRows = themeRes.data?.data || themeRes.data || [];
      const themeRow = Array.isArray(themeRows) ? themeRows[0] : themeRows;

      if (!themeRow) {
        throw new Error(`No cloned theme found for workspace ${workspaceId}`);
      }

      // 2. Fetch components for this theme
      const compRes = await this.secureSelect({
        data_json: {
          table_name: "bizfire_theme_components",
          request: { theme_guid: themeRow.row_guid, is_deleted: false },
        },
      });
      const compRows = compRes.data?.data || compRes.data || [];

      // 3. Fetch page templates for this theme
      const tmplRes = await this.secureSelect({
        data_json: {
          table_name: "bizfire_page_templates",
          request: { theme_guid: themeRow.row_guid, is_deleted: false },
        },
      });
      const tmplRows = tmplRes.data?.data || tmplRes.data || [];

      return {
        theme: {
          id: themeRow.theme_slug,
          name: themeRow.theme_name,
          version: themeRow.version,
          fontFamily: themeRow.font_family,
          fontUrl: themeRow.font_url,
          defaultPageTemplate: themeRow.default_page_template,
          themeSettings: themeRow.theme_settings,
        },
        styleCss: themeRow.style_css || "",
        components: (Array.isArray(compRows) ? compRows : []).map((c) => ({
          id: c.component_slug,
          name: c.name,
          category: c.category,
          schema: c.schema_json,
          template: c.template_html,
          defaults: c.defaults_json,
        })),
        pageTemplates: (Array.isArray(tmplRows) ? tmplRows : []).map((t) => ({
          id: t.template_slug,
          name: t.name,
          description: t.description,
          components: t.components_json,
        })),
      };
    } catch (err) {
      console.error("Error fetching theme bundle:", err);
      throw err;
    }
  }

  /**
   * Fetch page summaries list for workspace
   * @param {string} workspaceId
   */
  async getPageList(workspaceId) {
    try {
      const response = await this.secureSelect({
        data_json: {
          table_name: "bizfire_page_contents",
          request: { workspace_guid: workspaceId, is_deleted: false },
        },
      });
      const rows = response.data?.data || response.data || [];
      return (Array.isArray(rows) ? rows : []).map((p) => ({
        postId: p.post_id,
        slug: p.slug,
        title: p.title,
        templateId: p.template_slug,
        lastSavedAt: p.last_saved_at,
        lastPublishedAt: p.last_published_at,
        status: p.status,
      }));
    } catch (err) {
      console.error("Error fetching page list:", err);
      throw err;
    }
  }

  /**
   * Fetch full page content and sections
   * @param {string} workspaceId
   * @param {number|string} postId
   */
  async getPageContent(workspaceId, postId) {
    try {
      const response = await this.secureSelect({
        data_json: {
          table_name: "bizfire_page_contents",
          request: {
            workspace_guid: workspaceId,
            post_id: Number(postId),
            is_deleted: false,
          },
        },
      });
      const rows = response.data?.data || response.data || [];
      const page = Array.isArray(rows) ? rows[0] : rows;
      if (!page) return null;

      return {
        postId: page.post_id,
        slug: page.slug,
        title: page.title,
        templateId: page.template_slug,
        lastSavedAt: page.last_saved_at,
        lastPublishedAt: page.last_published_at,
        status: page.status,
        sections: page.sections_json || [],
        compiledHtml: page.compiled_html || "",
      };
    } catch (err) {
      console.error("Error fetching page content:", err);
      throw err;
    }
  }

  /**
   * Save page content (stripping runtime instanceIds)
   * @param {string} workspaceId
   * @param {number|string} postId
   * @param {Object} pageData
   */
  async savePageContent(workspaceId, postId, pageData) {
    try {
      // Strip runtime instanceId keys before saving
      const cleanSections = (pageData.sections || []).map((section) => {
        const { instanceId, ...rest } = section;
        return rest;
      });

      const payload = {
        workspace_guid: workspaceId,
        post_id: Number(postId),
        slug: pageData.slug,
        title: pageData.title,
        template_slug: pageData.templateId || "service-standard",
        sections_json: cleanSections,
        status: pageData.status || "draft",
        last_saved_at: new Date().toISOString(),
      };

      return await this.mergeWithCompositeKeys(
        payload,
        "bizfire_page_contents",
        ["workspace_guid", "post_id"]
      );
    } catch (err) {
      console.error("Error saving page content:", err);
      throw err;
    }
  }

  /**
   * Atomically clone master theme to workspace
   * @param {string} masterThemeSlug e.g. 'trades-modern'
   * @param {string} workspaceId
   * @param {string} userEmail
   */
  async cloneTheme(masterThemeSlug, workspaceId, userEmail = "system") {
    try {
      return await this.secureInvokeCustomSP({
        sp_name: "fn_bizfire_clone_theme_to_workspace",
        parameters: {
          p_master_theme_slug: masterThemeSlug,
          p_workspace_guid: workspaceId,
          p_user: userEmail,
        },
      });
    } catch (err) {
      console.error("Error cloning theme to workspace:", err);
      throw err;
    }
  }
}

const dataService = new DataService();
export default dataService;
export { dataService as DataService };
