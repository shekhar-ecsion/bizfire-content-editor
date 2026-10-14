import { NextResponse } from 'next/server';
import { DataSource } from '../../../lib/dataSource.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { workspaceId, postId, slug, title, templateId, sections } = body;

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

    const result = await DataSource.savePageContent(workspaceId, postId, {
      slug,
      title,
      templateId,
      sections
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API /api/save error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save page content' },
      { status: 500 }
    );
  }
}
