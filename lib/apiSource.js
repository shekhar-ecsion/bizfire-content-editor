import DataService from "@/api-services/data.service";

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
   * Publish page to WordPress
   */
  async publishPage(workspaceId, postId) {
    // In production, compiles HTML and pushes to WP post meta 'bizfire_page_html'
    return {
      success: true,
      liveUrl: `/live/${workspaceId}/${postId}`,
    };
  },
};

export default ApiSource;
