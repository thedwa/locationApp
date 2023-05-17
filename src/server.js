require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory

app.post('/api/generateLocationInfo', async (req, res) => {
  const data = req.body;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    res.send(json);
    console.log(json);
  } catch (error) {
    res.status(500).send({ message: 'Error making request to OpenAI API' });
  }
});


app.post('/api/generateImage', async (req, res) => {
  const data = req.body;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    res.send(json);
    console.log(json);
  } catch (error) {
    res.status(500).send({ message: 'Error making request to DALL·E API' });
  }
});




//start the port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
