import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsPath = path.resolve(__dirname, '..');

function getSidebarItems(dirPath, prefix = '') {
  const items = [];

  if (!fs.existsSync(dirPath)) {
    return items;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subItems = getSidebarItems(fullPath, `${prefix}${file}/`);
      if (subItems.length > 0) {
        items.push({
          text: file,
          collapsible: true,
          collapsed: true,
          items: subItems,
        });
      }
    } else if (file.endsWith('.md') && file !== 'index.md') {
      const name = file.replace('.md', '');
      items.push({
        text: name,
        link: `/${prefix}${name}`,
      });
    } else if (file === 'index.md') {
      items.unshift({
        text: '概述',
        link: `/${prefix.replace(/\/$/, '')}`,
      });
    }
  });

  return items;
}

function generateSidebar() {
  const sidebar = {};

  const directories = [
    'JS',
    'TS',
    'vue',
    'react',
    'extension',
    'linux',
    'CSS',
    'git',
    'nginx',
    'docker',
    'DB',
    'browser',
    'miscellaneous',
    'snippet',
    'node',
    'uni-app',
    'tools',
  ];

  directories.forEach(dir => {
    const dirPath = path.join(docsPath, dir);
    if (fs.existsSync(dirPath)) {
      const items = getSidebarItems(dirPath, `${dir}/`);
      if (items.length > 0) {
        sidebar[`/${dir}/`] = {
          text: dir,
          collapsible: true,
          collapsed: true,
          items,
        };
      }
    }
  });

  return sidebar;
}

export default generateSidebar();
