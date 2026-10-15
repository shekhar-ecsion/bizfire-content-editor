import { NextResponse } from 'next/server';
import DataService from '@/api-services/data.service';

export async function GET(request, { params }) {
  try {
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
    }

    const workspace = await DataService.getWorkspace(workspaceId);
    if (!workspace?.wpSiteUrl || !workspace?.apiKey) {
      return NextResponse.json(
        { error: 'WordPress site URL or API key is not configured for this workspace.' },
        { status: 400 }
      );
    }

    const siteBase = workspace.wpSiteUrl.replace(/\/$/, '');
    const endpoint = `${siteBase}/index.php/wp-json/bizfire/v1/all-pages?per_page=100`;

    const res = await fetch(endpoint, {
      headers: {
        'x-api-key': workspace.apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `WordPress responded with ${res.status}: ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const wpPages = Array.isArray(data?.pages) ? data.pages : [];

    // Map clean, lightweight page summaries for the import UI
    const mapped = wpPages.map((p) => ({
      postId: p.post_id || p.ID,
      title: p.page_name || p.post_title || p.post_name || 'Untitled',
      slug: (p.post_slug || p.post_name || '').replace(/^\//, '').replace(/\/$/, ''),
      guid: p.row_guid || p.post_unique_uuid || p.post_guid || '',
      postType: p.post_type || 'page',
      status: p.post_status || 'publish',
      permalink: p.preview_url || p.post_url || '',
    }));

    return NextResponse.json({
      success: true,
      total: data?.total || mapped.length,
      pages: mapped,
    });
  } catch (err) {
    console.error('Error fetching WP pages:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch WordPress pages' },
      { status: 500 }
    );
  }
}
