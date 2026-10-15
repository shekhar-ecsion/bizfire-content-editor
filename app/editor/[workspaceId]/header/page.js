import { notFound } from 'next/navigation';
import { DataSource } from '@/lib/dataSource.js';
import HeaderEditor from './HeaderEditor';

export default async function HeaderEditorPage({ params }) {
  const { workspaceId } = await params;
  let workspace;
  let pages = [];
  let header = null;

  try {
    workspace = await DataSource.getWorkspace(workspaceId);
    pages = await DataSource.getPageList(workspaceId);
    header = await DataSource.getHeader(workspaceId);
  } catch (err) {
    console.error(`Failed to load header data for workspace "${workspaceId}":`, err);
    notFound();
  }

  return (
    <HeaderEditor
      workspace={workspace}
      initialPages={pages || []}
      initialHeader={header}
    />
  );
}
