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
        clientName: ws?.workspace_name || "Princeton Comfort HVAC",
        themeId: ws?.data_json?.themeId || "trades-modern",
        wpSiteUrl: ws?.site_url || process.env.NEXT_PUBLIC_WORDPRESS_URL || "",
        wpUser: ws?.data_json?.wpUser || "",
        wpAppPassword: ws?.data_json?.wpAppPassword || "",
      };
    } catch (err) {
      console.warn("Could not fetch workspace from user_workspaces, using default context:", err.message);
      return {
        workspaceId,
        clientName: "Princeton Comfort HVAC",
        themeId: "trades-modern",
        wpSiteUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || "",
        wpUser: "",
        wpAppPassword: "",
      };
    }
  }

  /**
   * Fetch cloned theme bundle (theme, styleCss, components, pageTemplates) for workspace
   * @param {string} workspaceId Workspace GUID
   */
  async getThemeBundle(workspaceId) {
    try {
      // 1. Fetch workspace theme (or fallback to master theme if not cloned yet)
      let themeRes = await this.secureSelect({
        data_json: {
          table_name: "themes",
          request: { workspace_guid: workspaceId, is_deleted: false },
        },
      });
      let themeRows = themeRes.data?.data || themeRes.data || [];
      let themeRow = Array.isArray(themeRows) ? themeRows[0] : themeRows;

      if (!themeRow) {
        // Fallback to active master theme
        themeRes = await this.secureSelect({
          data_json: {
            table_name: "themes",
            request: { is_master: true, is_deleted: false },
          },
        });
        themeRows = themeRes.data?.data || themeRes.data || [];
        themeRow = Array.isArray(themeRows) ? themeRows[0] : themeRows;
      }

      if (!themeRow) {
        throw new Error(`No theme found for workspace ${workspaceId} or master themes.`);
      }

      const activeThemeGuid = themeRow.theme_guid || themeRow.row_guid;

      // 2. Fetch components for this theme
      const compRes = await this.secureSelect({
        data_json: {
          table_name: "theme_components",
          request: { theme_guid: activeThemeGuid, is_deleted: false },
        },
      });
      const compRows = compRes.data?.data || compRes.data || [];

      // 3. Fetch page variants (templates) for this theme
      const variantRes = await this.secureSelect({
        data_json: {
          table_name: "theme_page_variants",
          request: { theme_guid: activeThemeGuid, is_deleted: false },
        },
      });
      const variantRows = variantRes.data?.data || variantRes.data || [];

      return {
        theme: {
          id: themeRow.theme_slug,
          name: themeRow.name,
          version: themeRow.version,
          fontFamily: themeRow.font_family,
          fontUrl: themeRow.font_url,
          defaultPageTemplate: themeRow.default_page_template || "service-standard",
          themeSettings: themeRow.theme_json || {},
        },
        styleCss: themeRow.css || "",
        components: (Array.isArray(compRows) ? compRows : []).map((c) => ({
          id: c.component_key,
          name: c.name,
          category: c.category,
          schema: c.schema_json?.fields || c.schema_json || {},
          rawSchema: c.schema_json || {},
          template: c.template_html || "",
          defaults: c.defaults_json || {},
        })),
        pageTemplates: (Array.isArray(variantRows) ? variantRows : []).map((v) => ({
          id: v.variant_key,
          name: v.name,
          description: v.description,
          components: v.layout_json || [],
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
          table_name: "pages",
          request: { workspace_guid: workspaceId, is_deleted: false },
        },
      });
      const rows = response.data?.data || response.data || [];
      return (Array.isArray(rows) ? rows : []).map((p) => ({
        postId: p.wp_post_id || p.id,
        slug: p.slug,
        title: p.title,
        templateId: p.variant_guid || p.page_type_guid || "service-standard",
        lastSavedAt: p.last_saved_at || p.updated_on,
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
      const isNumeric = !isNaN(Number(postId));
      const requestFilter = {
        workspace_guid: workspaceId,
        is_deleted: false,
      };
      if (isNumeric) {
        requestFilter.wp_post_id = Number(postId);
      } else {
        requestFilter.import_key = String(postId);
      }

      let response = await this.secureSelect({
        data_json: {
          table_name: "pages",
          request: requestFilter,
        },
      });
      let rows = response.data?.data || response.data || [];
      let page = Array.isArray(rows) ? rows[0] : rows;

      // Fallback: search by id if not matched by wp_post_id or import_key
      if (!page && isNumeric) {
        response = await this.secureSelect({
          data_json: {
            table_name: "pages",
            request: {
              workspace_guid: workspaceId,
              id: Number(postId),
              is_deleted: false,
            },
          },
        });
        rows = response.data?.data || response.data || [];
        page = Array.isArray(rows) ? rows[0] : rows;
      }

      if (!page) return null;

      return {
        postId: page.wp_post_id || page.id,
        pageGuid: page.page_guid,
        rowGuid: page.row_guid,
        slug: page.slug,
        title: page.title,
        templateId: page.variant_guid || "service-standard",
        lastSavedAt: page.last_saved_at || page.updated_on,
        lastPublishedAt: page.last_published_at,
        status: page.status,
        sections: page.content_json || [],
        compiledHtml: page.compiled_html || "",
        seoJson: page.seo_json || {},
        analysisJson: page.analysis_json || {},
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

      const isNumeric = !isNaN(Number(postId));
      const payload = {
        workspace_guid: workspaceId,
        slug: pageData.slug,
        title: pageData.title,
        content_json: cleanSections,
        status: pageData.status || "draft",
        last_saved_at: new Date().toISOString(),
        updated_on: new Date().toISOString(),
      };

      if (isNumeric) {
        payload.wp_post_id = Number(postId);
      } else {
        payload.import_key = String(postId);
      }

      return await this.mergeWithCompositeKeys(
        payload,
        "pages",
        ["workspace_guid", "slug"]
      );
    } catch (err) {
      console.error("Error saving page content:", err);
      throw err;
    }
  }

  /**
   * Update page publish status, compiled HTML, and live URL in PostgreSQL
   * @param {string} workspaceId
   * @param {Object} publishData
   */
  async updatePagePublishStatus(workspaceId, publishData) {
    try {
      const now = new Date().toISOString();
      const payload = {
        workspace_guid: workspaceId,
        slug: publishData.slug,
        compiled_html: publishData.compiledHtml,
        status: "published",
        last_published_at: publishData.publishedAt || now,
        live_url: publishData.liveUrl || "",
        wp_sync_status: publishData.wpSyncStatus || "synced",
        wp_sync_error: publishData.wpSyncError || null,
        updated_on: now,
        updated_at: now,
      };

      if (publishData.postId && !isNaN(Number(publishData.postId))) {
        payload.wp_post_id = Number(publishData.postId);
      }

      return await this.mergeWithCompositeKeys(
        payload,
        "pages",
        ["workspace_guid", "slug"]
      );
    } catch (err) {
      console.error("Error updating page publish status:", err);
      throw err;
    }
  }

  /**
   * Record snapshot entry in publications table
   * @param {Object} publicationRecord
   */
  async recordPublication(publicationRecord) {
    try {
      return await this.secureInsert(publicationRecord, "publications");
    } catch (err) {
      console.error("Error recording publication snapshot:", err);
      return { success: false, error: err.message };
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
        sp_name: "sp_bizfire_clone_theme_to_workspace",
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
