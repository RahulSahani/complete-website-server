const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());

//MongoDB Connection

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8dbji.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;



app.get('/', (req, res) => {
    res.send('server is ready');
})

//MongoDB Collections
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const agencyCollection = client.db("DigitalAgency").collection("addServices");

    //Post Data from client site

    app.post('/addServices', (req, res) => {
        const product = req.body;
        res.send(product);
        agencyCollection.insertOne(product)
            .then(res => {
                console.log('inserted Count', res)
                console.log(res.insertedCount > 0)
            })
    })

    app.get('/services', (req, res) => {

        agencyCollection.find()
            .toArray((error, product) => {
                res.send(product)
                // console.log(product, 'from data base')
            })

    })

});


//User Reviews  data

client.connect(err => {
    const userReviewCollection = client.db("DigitalAgency").collection("userReviews");


    app.post('/userReviews', (req, res) => {
        const reviews = req.body;
        res.send(reviews);
        userReviewCollection.insertOne(reviews)
            .then(res => {
                console.log('inserted Count', res)
                console.log(res.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        userReviewCollection.find()
            .toArray((error, reviews) => {
                console.log(error)
                res.send(reviews)
            })
    })

});




app.listen(port)

