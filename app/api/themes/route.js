import { NextResponse } from 'next/server';
import { listThemes } from '../../../lib/theme';

export async function GET() {
  try {
    const themes = listThemes();
    return NextResponse.json({ themes });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to list themes' },
      { status: 500 }
    );
  }
}
