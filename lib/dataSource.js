import ApiSource from "./apiSource";

/**
 * DataSource Abstraction Layer
 * The editor calls DataSource methods, which can delegate to ApiSource (Azure PostgreSQL)
 * or a local FilesystemSource mock for offline development.
 */
export const DataSource = ApiSource;

export default DataSource;
