import { notFound } from 'next/navigation';
import { DataSource } from '../../../../lib/dataSource.js';
import Editor from '../../../Editor';
import TemplatePicker from './TemplatePicker';

export default async function WorkspacePostEditorPage({ params }) {
  const { workspaceId, postId } = await params;

  let workspace;
  let themeBundle;
  let pageData = null;

  try {
    workspace = await DataSource.getWorkspace(workspaceId);
    themeBundle = await DataSource.getThemeBundle(workspaceId);
  } catch (err) {
    console.error(`Failed to load workspace or theme for "${workspaceId}":`, err);
    notFound();
  }

  try {
    pageData = await DataSource.getPageContent(workspaceId, postId);
  } catch (err) {
    // Page does not exist yet (e.g. newly created in WordPress)
    pageData = null;
  }

  // If page content has not been created yet, show the template picker
  if (!pageData) {
    return (
      <TemplatePicker
        workspace={workspace}
        themeBundle={themeBundle}
        postId={postId}
      />
    );
  }

  return (
    <Editor
      mode="workspace"
      workspace={workspace}
      pageData={pageData}
      initialTheme={themeBundle.theme}
      initialThemeCss={themeBundle.styleCss}
      initialComponents={themeBundle.components}
      initialVariants={themeBundle.pageTemplates}
    />
  );
}
