import * as filesystemSource from './filesystemSource.js';
import ApiSource from './apiSource.js';

/**
 * DataSource Abstraction Layer
 *
 * Provides a uniform API for the Bizfire Editor to interact with workspaces,
 * themes, page templates, and page contents regardless of whether the underlying
 * data is stored in the local filesystem (development mock) or an Azure PostgreSQL
 * REST API service (production).
 *
 * Defaults to filesystemSource for local mock development (e.g. test-workspace-001).
 * Set DATA_SOURCE="api" in your environment to switch to Azure PostgreSQL / DataService.
 */
const activeSource = process.env.DATA_SOURCE === 'api' ? ApiSource : filesystemSource;

export const DataSource = {
  /**
   * Fetch workspace metadata by ID
   * @param {string} workspaceId
   * @returns {Promise<import('./types').WorkspaceConfig>}
   */
  getWorkspace: (workspaceId) => activeSource.getWorkspace(workspaceId),

  /**
   * Fetch workspace's cloned theme bundle (styles, components, page templates)
   * @param {string} workspaceId
   * @returns {Promise<import('./types').ThemeBundle>}
   */
  getThemeBundle: (workspaceId) => activeSource.getThemeBundle(workspaceId),

  /**
   * Fetch all page summaries for a workspace
   * @param {string} workspaceId
   * @returns {Promise<Array<object>>}
   */
  getPageList: (workspaceId) => activeSource.getPageList(workspaceId),

  /**
   * Fetch a single page's content by postId
   * @param {string} workspaceId
   * @param {string | number} postId
   * @returns {Promise<object>}
   */
  getPageContent: (workspaceId, postId) => activeSource.getPageContent(workspaceId, postId),

  /**
   * Save/update page content JSON (strips instanceId automatically)
   * @param {string} workspaceId
   * @param {string | number} postId
   * @param {object} pageData
   * @returns {Promise<{ success: boolean, savedAt: string, data: object }>}
   */
  savePageContent: (workspaceId, postId, pageData) => activeSource.savePageContent(workspaceId, postId, pageData),

  /**
   * Compile page sections to HTML and publish to WordPress
   * @param {string} workspaceId
   * @param {string | number} postId
   * @returns {Promise<{ success: boolean, liveUrl?: string, publishedAt: string, compiledHtml: string }>}
   */
  publishPage: (workspaceId, postId, options) => activeSource.publishPage(workspaceId, postId, options),

  /**
   * Fetch Site Header configuration for a workspace
   */
  getHeader: (workspaceId) => activeSource.getHeader(workspaceId),

  /**
   * Save Site Header draft configuration
   */
  saveHeader: (workspaceId, headerData) => activeSource.saveHeader(workspaceId, headerData),

  /**
   * Compile and publish Site Header to WordPress
   */
  publishHeader: (workspaceId, headerData) => activeSource.publishHeader(workspaceId, headerData),

  /**
   * Fetch Site Footer configuration for a workspace
   */
  getFooter: (workspaceId) => activeSource.getFooter(workspaceId),

  /**
   * Save Site Footer draft configuration
   */
  saveFooter: (workspaceId, footerData) => activeSource.saveFooter(workspaceId, footerData),

  /**
   * Compile and publish Site Footer to WordPress
   */
  publishFooter: (workspaceId, footerData) => activeSource.publishFooter(workspaceId, footerData),
};

export { filesystemSource, ApiSource };
export default DataSource;
