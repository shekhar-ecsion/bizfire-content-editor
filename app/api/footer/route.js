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

    const footer = await DataSource.getFooter(workspaceId);
    return NextResponse.json(footer || {});
  } catch (err) {
    console.error('Error fetching footer:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch footer' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { workspaceId, footerData, action } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required field: workspaceId' },
        { status: 400 }
      );
    }

    if (!footerData) {
      return NextResponse.json(
        { error: 'Missing required field: footerData' },
        { status: 400 }
      );
    }

    if (action === 'publish') {
      const result = await DataSource.publishFooter(workspaceId, footerData);
      return NextResponse.json({
        success: true,
        action: 'publish',
        ...result,
      });
    }

    const result = await DataSource.saveFooter(workspaceId, footerData);
    return NextResponse.json({
      success: true,
      action: 'save',
      ...result,
    });
  } catch (err) {
    console.error('Error saving/publishing footer:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process footer action' },
      { status: 500 }
    );
  }
}
