import express from 'express';
const router = express.Router();
import cors from 'cors';
router.use(cors({
  origin: [
    `http://localhost:${process.env.PORT || process.env.PORT2}`,
    'https://echo-restful.herokuapp.com/',
    'https://cvnuxt.vercel.app/',
  ],
}));
import * as mdb from 'mongodb';

const connectionString: any = process.env.MONGODB_URI;

mdb.MongoClient.connect(connectionString).then(client => {
  console.log('Connected to Database');
  const db = client.db('ShoppingList');
  const itemCollection = db.collection('items');
  const usersCollection = db.collection('users');

  router.get('/shopping/users', (async (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    usersCollection.find().toArray().then((list: any) => {
      res.status(200).json(list);
    }).catch(err => console.error(err));
  }));

  router.post('/shopping/users', (async (req, res) => {
    usersCollection.updateOne(
      { uuid: req.body.uuid },
      {
        $set: { uuid: req.body.uuid },
      },
      { upsert: true },
      (err: any, result: any) => {
        if (err) console.error(err);
        if (result.matchedCount > 0) {
          console.log('Existing user found.');
          res.status(400).send('Existing user found.');
        }
        else {
          console.log(`Created new document of ${req.body.uuid}`);
          res.status(201).send(`Created new document of ${req.body.uuid}`);
        }
      }
    );
  }));

  router.get('/shopping', (async (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    itemCollection.find().toArray().then((list: any) => {
      res.status(200).json(list);
    }).catch(err => console.error(err));
  }));

  router.post('/shopping', (async (req, res) => {
    const itemSchema = {
      item: req.body.item,
      quantity: req.body.quantity,
    };
    itemCollection.updateOne(
      { item: req.body.item },
      {
        $set: itemSchema,
      },
      { upsert: true },
      (err: any, result: any) => {
        if (err) console.error(err);
        if (result.matchedCount > 0) {
          console.log('Existing entry found.');
          res.status(400).send('Existing entry found.');
        }
        else {
          console.log(`Created new document of ${req.body.item}`);
          res.status(201).send(`Created new document of ${req.body.item}`);
        }
      }
    );
  }));

  router.delete('/shopping', (async (req, res) => {
    itemCollection.deleteOne(
      { item: req.body.item },
      (err: any, result: any) => {
        if (err) console.error(err);
        if (result.deletedCount == 0) {
          console.log(`${req.body.item} does not exist.`);
          res.status(400).send(`${req.body.item} does not exist.`);
        }
        else {
          console.log(`Deleted the [${req.body.item}] document`);
          res.status(200).send(`Deleted the [${req.body.item}] document`);
        }
      }
    );
  }));

  router.put('/shopping', (async (req, res) => {
    itemCollection.updateOne(
      { item: req.body.item },
      {
        $set: {
          quantity: req.body.quantity,
        },
      },
      { upsert: false },
      (err: any, result: any) => {
        if (err) { console.error(err); }
        if (result.matchedCount == 0) {
          console.error(`${req.body.item} not found, sending 400 to user.`);
          res.status(400).send(`No document named [${req.body.item}] exists.`);
        }
        else {
          console.log(`Updated quantity of ${req.body.item} to ${req.body.quantity}`);
          res.status(200).send(`Updated quantity of ${req.body.item} to ${req.body.quantity}`);
        }
      }
    );
  }));

  router.get('/projects', (async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const data = require('./projects.json');
    res.json(data);
  }));

}).catch(error => console.error(error));


module.exports = router;