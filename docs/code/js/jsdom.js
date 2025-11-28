import axios from 'axios';
import { JSDOM } from 'jsdom';
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

const { window } = new JSDOM(html, {
  runScripts: 'dangerously',
});

const document = window.document;

const result = document.querySelector('h1').textContent;
// NodeList
const results = document.querySelectorAll('h1');
const text = Array.from(results).map(result => result.textContent);
const text2 = [...results].map(result => result.textContent);
const text3 = results.forEach(result => result.textContent);
