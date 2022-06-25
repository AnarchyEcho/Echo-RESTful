import express from 'express';
const router = express.Router();

const helloWorld = require('./endpoints/helloWorld.json');

router.get('/helloWorld', ((req: any, res: any) => {
  res.json(helloWorld);
}));

module.exports = router;