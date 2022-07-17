import express from 'express';
const router = express.Router();
import cors from 'cors';
router.use(cors({
  origin: [`http://localhost:${process.env.PORT}`, 'https://echo-restful.herokuapp.com/'],
}));
import * as mdb from 'mongodb';

const connectionString: any = process.env.MONGODB_URI;

mdb.MongoClient.connect(connectionString).then(client => {
  console.log('Connected to Database');
  const db = client.db('ShoppingList');
  const itemCollection = db.collection('items');

  router.get('/shopping', (async (req: any, res: any) => {
    db.collection('items').find().toArray().then((list: any) => {
      res.json(list);
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
          res.status(400).redirect('/');
        }
        else {
          console.log(`Created new document of ${req.body.item}`);
          res.status(201).redirect('/');
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
          res.status(400).redirect('/');
        }
        else {
          console.log(`Deleted the [${req.body.item}] document`);
          res.status(201).redirect('/');
        }
      }
    );
  }));

}).catch(error => console.error(error));


module.exports = router;