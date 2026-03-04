const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

// View engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const shortUrl = require('../models/shortUrls');

// MongoDB connection (simple version — works for now)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));


// Routes

// Home page
app.get('/', async (req, res) => {
  try {
    const shortUrls = await shortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Create short URL
app.post('/shortUrls', async (req, res) => {
  try {
    await shortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
  } catch (error) {
    res.status(500).send("Error creating short URL");
  }
});

// Redirect short URL
app.get('/:shortUrl', async (req, res) => {
  try {
    const foundShortUrl = await shortUrl.findOne({ short: req.params.shortUrl });

    if (!foundShortUrl) return res.sendStatus(404);

    foundShortUrl.clicks++;
    await foundShortUrl.save();

    res.redirect(foundShortUrl.full);
  } catch (error) {
    res.status(500).send("Redirect Error");
  }
});

// IMPORTANT: Export instead of listen
module.exports = app;