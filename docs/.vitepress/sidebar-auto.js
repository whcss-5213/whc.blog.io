import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsPath = path.resolve(__dirname, '..');

function getFiles(dirPath, basePath = '', dirName = '') {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  const entries = fs.readdirSync(dirPath);
  const sortFilePath = path.join(dirPath, '.sort.txt');
  let sortList = null;

  if (fs.existsSync(sortFilePath)) {
    const sortContent = fs.readFileSync(sortFilePath, 'utf-8');
    sortList = sortContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subFiles = getFiles(fullPath, `${basePath}${entry}/`, entry);
      files.push(...subFiles);
    } else if (entry.endsWith('.md')) {
      const name = entry.replace('.md', '');
      files.push({
        text: name === 'index' ? dirName : name,
        link: `/${basePath}${name}`,
        name: name,
      });
    }
  });

  files.sort((a, b) => {
    if (a.name === 'index') return -1;
    if (b.name === 'index') return 1;

    if (sortList) {
      const aIndex = sortList.indexOf(a.name);
      const bIndex = sortList.indexOf(b.name);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
    }

    return a.text.localeCompare(b.text);
  });

  files.forEach(item => delete item.name);

  return files;
}

function generateSidebar() {
  const sidebar = {};

  const excludeDirs = ['.vitepress', 'public', '.obsidian'];
  const directories = fs.readdirSync(docsPath).filter(file => {
    const fullPath = path.join(docsPath, file);
    return (
      fs.statSync(fullPath).isDirectory() &&
      !excludeDirs.includes(file) &&
      !file.startsWith('.')
    );
  });

  directories.forEach(dir => {
    const dirPath = path.join(docsPath, dir);
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath);
    const subDirs = entries.filter(entry => {
      const fullPath = path.join(dirPath, entry);
      return fs.statSync(fullPath).isDirectory();
    });

    if (subDirs.length > 0) {
      subDirs.forEach(subDir => {
        const subDirPath = path.join(dirPath, subDir);
        const files = getFiles(subDirPath, `${subDir}/`, subDir);
        if (files.length > 0) {
          sidebar[`/${subDir}/`] = {
            text: subDir,
            collapsible: true,
            collapsed: true,
            items: files,
          };
        }
      });
    } else {
      const files = getFiles(dirPath, `${dir}/`, dir);
      if (files.length > 0) {
        sidebar[`/${dir}/`] = {
          text: dir,
          collapsible: true,
          collapsed: true,
          items: files,
        };
      }
    }
  });

  return sidebar;
}

export default generateSidebar();
