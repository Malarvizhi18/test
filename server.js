const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/theatre';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define the schema
const movieSchema = new mongoose.Schema({
  mov_name: { type: String, required: true },
  rank: { type: Number, required: true },
  released: { type: Number, required: true },
  percentage: { type: Number, required: true }
});

// Create a model from the schema
const Movie = mongoose.model('Movie', movieSchema);

// Middleware to parse JSON
app.use(express.json());

// Define a route to test the server
app.get('/', (req, res) => {
  res.status(200).send('Server is running and connected to MongoDB');
});

// Define a route to fetch data
app.get('/fetch', async (req, res) => {
  try {
    const data = await Movie.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a route to add data
app.post('/send', async (req, res) => {
  try {
    const { mov_name, rank, released, percentage } = req.body;
    const newMovie = new Movie({ mov_name, rank, released, percentage });
    await newMovie.save();
    res.status(201).json(newMovie+"added successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
