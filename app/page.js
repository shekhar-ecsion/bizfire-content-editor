import { listThemes, loadTheme, buildPageFromTemplate } from '../lib/theme';
import Editor from './Editor';

export default function Home() {
  const availableThemes = listThemes();
  const defaultThemeId = 'trades-modern';
  const themeData = loadTheme(defaultThemeId);
  const defaultTemplate = themeData.pageTemplates[0] || { components: [] };
  const initialPage = buildPageFromTemplate(themeData.components, defaultTemplate);

  return (
    <Editor
      mode="playground"
      availableThemes={availableThemes}
      initialTheme={themeData.theme}
      initialThemeCss={themeData.styleCss}
      initialCustomCss={themeData.customCss || ''}
      initialComponents={themeData.components}
      initialPageTemplates={themeData.pageTemplates}
      initialPage={initialPage}
    />
  );
}
