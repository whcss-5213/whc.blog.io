import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsPath = path.join(__dirname, 'docs');
const excludeDirs = ['.vitepress', 'public', '.obsidian', 'code'];

/**
 * 获取目录下所有 .md 文件名（不含后缀）
 * @param {string} dirPath - 目录路径
 * @returns {string[]} .md 文件名数组
 */
export function getMdFiles(dirPath) {
  const entries = fs.readdirSync(dirPath);
  return entries.filter(e => e.endsWith('.md')).map(e => e.replace('.md', ''));
}

/**
 * 初始化创建 .sort.txt 文件
 * @param {string} sortPath - .sort.txt 文件路径
 * @param {string[]} mdFiles - .md 文件名数组
 */
export function initSortFile(sortPath, mdFiles) {
  fs.writeFileSync(sortPath, mdFiles.join('\n'));
  console.log('Created:', sortPath);
}

/**
 * 检查 .sort.txt 文件是否存在，不存在则初始化
 * @param {string} sortPath - .sort.txt 文件路径
 * @param {string[]} mdFiles - .md 文件名数组
 * @returns {boolean} 文件存在返回 true，不存在返回 false
 */
export function checkSortFileExists(sortPath, mdFiles) {
  if (!fs.existsSync(sortPath)) {
    initSortFile(sortPath, mdFiles);
    return false;
  }
  return true;
}

/**
 * 清除 .sort.txt 中不存在的文件名
 * @param {string} sortPath - .sort.txt 文件路径
 * @param {string[]} mdFiles - 当前目录下有效的 .md 文件名数组
 * @returns {boolean} 有清除操作返回 true，否则返回 false
 */
export function cleanInvalidNames(sortPath, mdFiles) {
  const content = fs.readFileSync(sortPath, 'utf-8').trim();
  if (content.length === 0) return false;

  const existingNames = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const validNames = existingNames.filter(name => mdFiles.includes(name));

  if (validNames.length !== existingNames.length) {
    fs.writeFileSync(sortPath, validNames.join('\n'));
    console.log('Cleaned invalid names:', sortPath);
    return true;
  }

  return false;
}

/**
 * 追加新文件到 .sort.txt 最后一行
 * @param {string} sortPath - .sort.txt 文件路径
 * @param {string[]} mdFiles - 当前目录下所有 .md 文件名数组
 * @returns {boolean} 有追加操作返回 true，否则返回 false
 */
export function appendNewFiles(sortPath, mdFiles) {
  const content = fs.readFileSync(sortPath, 'utf-8').trim();
  const existingNames =
    content.length > 0
      ? content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
      : [];

  const newFiles = mdFiles.filter(name => !existingNames.includes(name));

  if (newFiles.length > 0) {
    const allNames = [...existingNames, ...newFiles];
    fs.writeFileSync(sortPath, allNames.join('\n'));
    console.log('Appended new files:', sortPath, '+', newFiles);
    return true;
  }

  return false;
}

/**
 * 处理单个目录的 .sort.txt 文件
 * @param {string} dirPath - 目录路径
 */
export function processSortFile(dirPath) {
  const mdFiles = getMdFiles(dirPath);
  if (mdFiles.length === 0) return;

  const sortPath = path.join(dirPath, '.sort.txt');

  if (!checkSortFileExists(sortPath, mdFiles)) return;

  const content = fs.readFileSync(sortPath, 'utf-8').trim();
  if (content.length === 0) {
    initSortFile(sortPath, mdFiles);
    return;
  }

  cleanInvalidNames(sortPath, mdFiles);
  appendNewFiles(sortPath, mdFiles);
}

/**
 * 递归遍历所有目录并处理 .sort.txt 文件
 * @param {string} dirPath - 起始目录路径
 */
export function processDir(dirPath) {
  processSortFile(dirPath);

  const entries = fs.readdirSync(dirPath);
  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry);
    if (
      fs.statSync(fullPath).isDirectory() &&
      !excludeDirs.includes(entry) &&
      !entry.startsWith('.')
    ) {
      processDir(fullPath);
    }
  });
}

/**
 * 检测目录下是否有包含 .md 文件的子目录
 * @param {string} dirPath - 目录路径
 * @returns {boolean} 有包含 .md 文件的子目录返回 true，否则返回 false
 */
export function hasSubDirs(dirPath) {
  const entries = fs.readdirSync(dirPath);
  return entries.some(entry => {
    const fullPath = path.join(dirPath, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      const mdFiles = getMdFiles(fullPath);
      return mdFiles.length > 0;
    }
    return false;
  });
}

/**
 * 生成 rewrites 对象
 * 检测 docs 下的一级目录是否有二级文件夹，有则生成重写规则
 * @returns {Object} rewrites 对象
 */
export function generateRewrites() {
  const rewrites = {};
  const entries = fs.readdirSync(docsPath);

  entries.forEach(entry => {
    const fullPath = path.join(docsPath, entry);
    if (
      fs.statSync(fullPath).isDirectory() &&
      !excludeDirs.includes(entry) &&
      !entry.startsWith('.')
    ) {
      if (hasSubDirs(fullPath)) {
        const lowerName = entry.toLowerCase();
        rewrites[`${entry}/:${lowerName}/:page`] = `${lowerName}/:page`;
      }
    }
  });

  return rewrites;
}

processDir(docsPath);
console.log('Done!');
console.log('Rewrites:', JSON.stringify(generateRewrites(), null, 2));
