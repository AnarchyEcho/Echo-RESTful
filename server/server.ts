import express from 'express';
const app = express();
app.use(express.json());
import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';

app.get('/', ((req, res) => res.sendFile(path.join(__dirname, '../client/index.html'))));

app.use('/api/', require('./routes/api/index'));

app.get('*', ((req, res) => res.sendFile(path.join(__dirname, '../client/404.html'))));

app.listen(process.env.PORT || 8080, (() => console.log(`Your web server is running on url: ${process.env.HOST}:${process.env.PORT}`)));
