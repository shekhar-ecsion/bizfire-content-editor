import { NextResponse } from 'next/server';
import { DataSource } from '@/lib/dataSource.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: workspaceId' },
        { status: 400 }
      );
    }

    const header = await DataSource.getHeader(workspaceId);
    return NextResponse.json(header || {});
  } catch (err) {
    console.error('Error fetching header:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch header' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { workspaceId, headerData, action } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required field: workspaceId' },
        { status: 400 }
      );
    }

    if (!headerData) {
      return NextResponse.json(
        { error: 'Missing required field: headerData' },
        { status: 400 }
      );
    }

    if (action === 'publish') {
      const result = await DataSource.publishHeader(workspaceId, headerData);
      return NextResponse.json({
        success: true,
        action: 'publish',
        ...result,
      });
    }

    const result = await DataSource.saveHeader(workspaceId, headerData);
    return NextResponse.json({
      success: true,
      action: 'save',
      ...result,
    });
  } catch (err) {
    console.error('Error saving/publishing header:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process header action' },
      { status: 500 }
    );
  }
}
