import * as http from 'http';
import * as child_process from 'child_process';
import * as dotenv from 'dotenv';
dotenv.config();

const url = `${process.env.HOST}:${process.env.PORT}`;
const exec = child_process.exec;

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

  if (req.url === '/shell') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return exec('sh ./scripts/main.sh', ((err, stdout) => {
      if (err) console.error(err);
      console.log('Shell script executed');
      res.write(`${stdout}`);
      res.end();
    }));
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

http.createServer(requestListener).listen(process.env.PORT, (() => console.log(`Your web server is running url: ${url}`)));
