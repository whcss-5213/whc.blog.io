import axios from 'axios';
import * as cheerio from 'cheerio';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

const url = 'https://www.example.com';
const response = await axios.get(url, {
  responseType: 'arraybuffer',
});

const encoding = jschardet.detect(response.data).encoding;
const html = iconv.decode(response.data, encoding);

const $ = cheerio.load(html);

const result = $('h1').text();
// cheerio返回的是cheerio对象，不是NodeList
const results = $('h1');

const imgs = $('img');
const imgSrcs = imgs.map((i, img) => $(img).attr('src')).get();

const link = $('a');
const links = $('a')
  .map((i, a) => $(a).attr('href'))
  .get();
