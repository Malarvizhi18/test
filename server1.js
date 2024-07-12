const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('theatre');
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware to parse JSON
app.use(express.json());

// Define a route to test the server
app.get('/', (req, res) => {
  res.status(200).send('Server is running and connected to MongoDB');
});

// Define a route to fetch data
app.get('/fetch', async (req, res) => {
  try {
    const data = await db.collection('movies').find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a route to add data
app.post('/send', async (req, res) => {
  try {
    const movie = req.body;
    const result = await db.collection('movies').insertOne(movie);
    res.status(201).json(" Data added succesfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
