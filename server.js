const http = require('http');
const fs = require('fs');

const headerType = {
  css: 'text/css; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  html: 'text/html; charset=utf-8',
};

http.createServer((req, res) => {
  if (req.url.includes('..') || req.url.includes('?')) {
    res.writeHead(404);
    res.end();
    return;
  }

  const file = req.url === '/' ? 'index.html' : req.url.slice(1);
  const extention = file.split('.')[1];

  if (!headerType[extention]) {
    res.writeHead(404);
    res.end();
    return;
  }
  const data = fs.readFileSync(`${__dirname}/${file}`, { encoding: 'utf-8' });
  res.writeHead(200, {'Content-Type': headerType[extention]});
  res.end(data);
}).listen(8001);
