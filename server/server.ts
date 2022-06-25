import * as http from 'http';
import * as child_process from 'child_process';
import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';

const url = `${process.env.HOST}:${process.env.PORT}`;
const exec = child_process.exec;

const requestListener = ((req: any, res: any) => {
  switch (req.url) {
  case '/':
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return fs.readFile('./client/index.html', ((err, data) => {
      if (err) console.error(err);
      res.write(data);
      return res.end();
    }));

  case '/scripts/helloWorld':
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return exec(`sh ./server/${req.url}.sh`, ((err, stdout) => {
      if (err) console.error(err);
      console.log('Shell script executed');
      res.write(`${stdout}`);
      res.end();
    }));

  case '/api/hello':
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log('API request received');
    return fs.readFile('./server/api/helloWorld.json', 'utf8', ((err, data) => {
      if (err) console.error(err);
      res.write(data);
      return res.end();
    }));

  default:
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write(`<h1>404 Page Not Found</h1> <p>URL: <a href="">${url + req.url}</a> is not a real url.</p> <a href="../../../../../../../..">Return to main page</a>`);
    return res.end();
  }
});

http.createServer(requestListener).listen(process.env.PORT, (() => console.log(`Your web server is running on url: ${url}`)));
