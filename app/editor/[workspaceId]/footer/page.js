import { notFound } from 'next/navigation';
import { DataSource } from '@/lib/dataSource.js';
import FooterEditor from './FooterEditor';

export default async function FooterEditorPage({ params }) {
  const { workspaceId } = await params;
  let workspace;
  let pages = [];
  let footer = null;

  try {
    workspace = await DataSource.getWorkspace(workspaceId);
    pages = await DataSource.getPageList(workspaceId);
    footer = await DataSource.getFooter(workspaceId);
  } catch (err) {
    console.error(`Failed to load footer data for workspace "${workspaceId}":`, err);
    notFound();
  }

  return (
    <FooterEditor
      workspace={workspace}
      initialPages={pages || []}
      initialFooter={footer}
    />
  );
}
