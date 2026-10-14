import { NextResponse } from 'next/server';
import { DataSource } from '../../../lib/dataSource.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { workspaceId, postId, rowGuid, pageGuid, sections, slug, title, templateId } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required field: workspaceId' },
        { status: 400 }
      );
    }

    if (!postId && postId !== 0) {
      return NextResponse.json(
        { error: 'Missing required field: postId' },
        { status: 400 }
      );
    }

    // If client sent unsaved sections with publish request, save first
    if (sections) {
      await DataSource.savePageContent(workspaceId, postId, {
        rowGuid: rowGuid || pageGuid,
        slug,
        title,
        templateId,
        sections
      });
    }

    const result = await DataSource.publishPage(workspaceId, postId);

    return NextResponse.json({
      success: true,
      postId,
      publishedAt: result?.publishedAt || new Date().toISOString(),
      liveUrl: result?.liveUrl || "",
      compiledHtml: result?.compiledHtml || "",
      errors: result?.errors || [],
      wpSyncStatus: result?.wpSyncStatus || "synced"
    });
  } catch (error) {
    console.error('API /api/publish error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish page' },
      { status: 500 }
    );
  }
}
