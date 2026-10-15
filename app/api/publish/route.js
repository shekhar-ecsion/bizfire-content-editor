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

    // Support batch publishing if body.pages array is provided
    if (Array.isArray(body.pages) && body.pages.length > 0) {
      const results = [];
      for (const p of body.pages) {
        const targetId = (p.postId && Number(p.postId) > 0) ? p.postId : (p.rowGuid || p.pageGuid || p.postId);
        if (!targetId && targetId !== 0) continue;
        try {
          if (p.sections) {
            await DataSource.savePageContent(workspaceId, targetId, {
              rowGuid: p.rowGuid || p.pageGuid,
              slug: p.slug,
              title: p.title,
              templateId: p.templateId || templateId,
              sections: p.sections
            });
          }
          const res = await DataSource.publishPage(workspaceId, targetId, {
            apiKey: body.apiKey || p.apiKey || request.headers.get("x-api-key") || request.headers.get("X-API-Key"),
            slug: p.slug,
            title: p.title,
            rowGuid: p.rowGuid || p.pageGuid,
          });
          results.push({
            success: true,
            postId: res?.postId || targetId,
            rowGuid: p.rowGuid || p.pageGuid,
            liveUrl: res?.liveUrl,
            publishedAt: res?.publishedAt,
            wpSyncStatus: res?.wpSyncStatus
          });
        } catch (err) {
          results.push({
            success: false,
            postId: targetId,
            rowGuid: p.rowGuid || p.pageGuid,
            error: err.message
          });
        }
      }
      return NextResponse.json({
        success: true,
        count: results.length,
        results
      });
    }

    const targetPostId = (postId && Number(postId) > 0) ? postId : (rowGuid || pageGuid || postId);
    if (!targetPostId && targetPostId !== 0) {
      return NextResponse.json(
        { error: 'Missing required field: postId or rowGuid' },
        { status: 400 }
      );
    }

    // If client sent unsaved sections with publish request, save first
    if (sections) {
      await DataSource.savePageContent(workspaceId, targetPostId, {
        rowGuid: rowGuid || pageGuid,
        slug,
        title,
        templateId,
        sections
      });
    }

    const result = await DataSource.publishPage(workspaceId, targetPostId, {
      apiKey: body.apiKey || request.headers.get("x-api-key") || request.headers.get("X-API-Key"),
      slug,
      title,
      rowGuid: rowGuid || pageGuid,
    });

    return NextResponse.json({
      success: true,
      postId: result?.postId || postId,
      uuid: result?.wpResponse?.uuid || rowGuid || pageGuid,
      publishedAt: result?.publishedAt || new Date().toISOString(),
      liveUrl: result?.liveUrl || "",
      compiledHtml: result?.compiledHtml || "",
      errors: result?.errors || [],
      wpSyncStatus: result?.wpSyncStatus || "synced",
      wpSyncError: result?.wpSyncError || null,
    });
  } catch (error) {
    console.error('API /api/publish error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish page' },
      { status: 500 }
    );
  }
}
