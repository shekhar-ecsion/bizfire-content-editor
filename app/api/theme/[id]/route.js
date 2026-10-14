import { NextResponse } from 'next/server';
import { loadTheme, buildPageFromVariant } from '../../../../lib/theme';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const themeData = loadTheme(id);
    const defaultVariant = themeData.variants[0] || { components: [] };
    const initialPage = buildPageFromVariant(themeData.components, defaultVariant);

    return NextResponse.json({
      theme: themeData.theme,
      styleCss: themeData.styleCss,
      components: themeData.components,
      variants: themeData.variants,
      initialPage
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load theme' },
      { status: 404 }
    );
  }
}
