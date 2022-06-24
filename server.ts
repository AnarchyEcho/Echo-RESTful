import * as http from 'http';

const port = 8080;

const requestListener = ((req: any, res: any) => {

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('This is the home page');
    return res.end();
  }
  if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('This is the about page');
    return res.end();
  }
  if (req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: 'Hello World' }));
    return res.end();
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>404 Page Not Found</h1>');
    return res.end();
  }
});

const server = http.createServer(requestListener);
server.listen(port);
console.log(`Your web server is running url: localhost:${port}`);
