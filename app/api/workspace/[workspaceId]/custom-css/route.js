import { NextResponse } from 'next/server';
import { DataSource } from '@/lib/dataSource';

export async function GET(request, { params }) {
  try {
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required parameter: workspaceId' },
        { status: 400 }
      );
    }

    const themeBundle = await DataSource.getThemeBundle(workspaceId);
    return NextResponse.json({
      success: true,
      workspaceId,
      customCss: themeBundle?.customCss || ''
    });
  } catch (error) {
    console.error('API /api/workspace/[workspaceId]/custom-css GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workspace custom CSS' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required parameter: workspaceId' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { customCss, rowGuid } = body;

    const result = await DataSource.saveWorkspaceCustomCss(workspaceId, customCss || '', rowGuid);

    return NextResponse.json({
      success: true,
      workspaceId,
      customCss: customCss || '',
      result
    });
  } catch (error) {
    console.error('API /api/workspace/[workspaceId]/custom-css POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save workspace custom CSS' },
      { status: 500 }
    );
  }
}
