import { notFound } from "next/navigation";
import { DataSource } from "../../../lib/dataSource.js";
import WorkspacePageList from "./WorkspacePageList";

export default async function WorkspacePagesPage({ params }) {
  const { workspaceId } = await params;
  let workspace;
  let themeBundle;
  let pages = [];

  try {
    workspace = await DataSource.getWorkspace(workspaceId);
    themeBundle = await DataSource.getThemeBundle(workspaceId);
    pages = await DataSource.getPageList(workspaceId);
  } catch (err) {
    console.error(`Failed to load workspace "${workspaceId}":`, err);
    notFound();
  }

  return (
    <WorkspacePageList
      workspace={workspace}
      themeBundle={themeBundle}
      initialPages={pages}
    />
  );
}
