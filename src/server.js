require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory

app.post('/api/call-openai', async (req, res) => {
  const { location, buttonNum } = req.body;
  
  const prompt = `The user is located at ${location.lat}, ${location.lng}. They pressed button ${buttonNum}.`;

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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
