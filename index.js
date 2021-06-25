const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3030;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
// const { ObjectID } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8dbji.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const ObjectID = require('mongodb').ObjectID;
// console.log(process.env.DB_USER)

// console.log(uri)

const app = express();

app.use(cors());

app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('<h1>Server Is Ready</h1>');
});


//MongoDB Connection




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("productData").collection("ProductList");

  //   console.log('Database Connected SuccessFully')
  //Get Data from Server

  app.get('/products', (req, res) => {

    productCollection.find()
      .toArray((error, product) => {
        res.send(product)
        // console.log(product, 'from data base')
      })

  })


  //Post Data from client site

  app.post('/addProducts', (req, res) => {
    const product = req.body;
    res.send(product);
    productCollection.insertOne(product)
      .then(res => {
        // console.log('inserted Count' , res)
        // console.log(res.insertedCount > 0)    
      })


  })

  //Single product Data 
  app.get('/product/:id', (req, res) => {
    // console.log(req.params.id);
    productCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])

      })

  })

  //Delete product

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    productCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then((err, res) => {
        res.send(res)
      })
  })


  //Update Product

  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({ _id: ObjectID(req.params.id) },
      {
        $set: { productName: req.body.productName, productDetail: req.body.productDetail, productPrice: req.body.productPrice }
      }
    )
      .then(result => {
        console.log(result)
      })
  })


});

//user Order Data Post 


client.connect(err => {
  const userOrderCollection = client.db("productData").collection("userOrders");


  //user Data Post Data

  app.post('/userOrder', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder);
    userOrderCollection.insertOne(newOrder)
      .then((result) => {
        result.send(result.insertedCount > 0)

      })
  })


  app.get('/orders', (req, res) => {
    console.log(req.query.useremail);
    userOrderCollection.find({ useremail: req.query.useremail })
      .toArray((error, documents) => {
        res.send(documents);
      })
  })

});







app.listen(port);