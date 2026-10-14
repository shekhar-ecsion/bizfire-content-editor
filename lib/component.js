import fs from 'node:fs';
import path from 'node:path';

const root = () => path.join(process.cwd(), 'components');

export function loadComponent(name) {
  const dir = path.join(root(), name);
  return {
    id: name,
    schema: JSON.parse(fs.readFileSync(path.join(dir, 'schema.json'), 'utf8')),
    template: fs.readFileSync(path.join(dir, 'template.html'), 'utf8')
  };
}

export function loadComponents() {
  return fs.readdirSync(root(), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => loadComponent(entry.name));
}

export function loadThemeCss() {
  return fs.readFileSync(path.join(process.cwd(), 'app', 'style.css'), 'utf8');
}
