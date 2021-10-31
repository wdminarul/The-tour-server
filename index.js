const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dlkzn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




// user:Assignment-11
// pass:smGMms0XO3UgspFA

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  client.connect(err => {
    const userCollection = client.db("Profile").collection("booking");
    const orderCollection = client.db("order").collection("service");
  
    app.post('/addOrder', (req,res)=>{
      orderCollection.insertOne(req.body).then((result)=>{
        res.send(result);
      })
    })
    app.get('/myOrder/:email', async (req,res)=>{
      const result = await orderCollection.find({email: req.params.email}).toArray();
      console.log(result)
      // console.log(req.params.email);
      
      res.json(result)
    })
    app.delete('/cancelBook/:id', async(req,res)=>{
      console.log(req.params.id)
      const result = await orderCollection.deleteOne({_id: ObjectId(req.params.id)});
      // console.log(result);
      res.send(result)
    })
    app.get('/allBooking', async(req,res)=>{
      const result = await orderCollection.find({}).toArray()
      res.send(result)
    })
  
    // add all service
    app.post('/addService',(req,res)=>{
      userCollection.insertOne(req.body).then((result)=>{
        res.send(result)
      })
    })
    // get booking service api 
    app.get('/bookingServices', async(req,res)=>{
      const result= await userCollection.find({}).toArray()
      res.send(result)
    })
    // delete/cancel booking 
    app.delete('/deleteBooking/:id',async(req,res)=>{
      console.log(req.params.id)
      const result = await userCollection.deleteOne({_id: ObjectId(req.params.id)})
      res.send(result)
    })
  });


  app.listen(port,req=>{
  console.log('listening to port ', port)
  })