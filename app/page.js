import { listThemes, loadTheme, buildPageFromVariant } from '../lib/theme';
import Editor from './Editor';

export default function Home() {
  const availableThemes = listThemes();
  const defaultThemeId = 'trades-modern';
  const themeData = loadTheme(defaultThemeId);
  const defaultVariant = themeData.variants[0] || { components: [] };
  const initialPage = buildPageFromVariant(themeData.components, defaultVariant);

  return (
    <Editor
      availableThemes={availableThemes}
      initialTheme={themeData.theme}
      initialThemeCss={themeData.styleCss}
      initialComponents={themeData.components}
      initialVariants={themeData.variants}
      initialPage={initialPage}
    />
  );
}
