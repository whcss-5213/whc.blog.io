import axios from 'axios';
import { JSDOM, VirtualConsole } from 'jsdom';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

const url = 'https://www.example.com';

const response = await axios.get(url, {
  responseType: 'arraybuffer',
});

// 编码检测
const encoding = jschardet.detect(response.data).encoding;
// 编码转换
const html = iconv.decode(response.data, encoding);

// 创建虚拟窗口
// 屏蔽控制台输出
const virtualConsole = new VirtualConsole();
virtualConsole.on('error', () => {});
virtualConsole.on('warn', () => {});
virtualConsole.on('info', () => {});
virtualConsole.on('dir', () => {});
virtualConsole.on('jsdomError', () => {});

const { window } = new JSDOM(html, {
  runScripts: 'dangerously',
  virtualConsole,
});

const document = window.document;

const result = document.querySelector('h1').textContent;
// NodeList
const results = document.querySelectorAll('h1');
const text = Array.from(results).map(result => result.textContent);
const text2 = [...results].map(result => result.textContent);
const text3 = results.forEach(result => result.textContent);
