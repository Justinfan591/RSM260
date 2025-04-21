const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.get('/get-word', async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Give me one creative, guessable word for a whiteboard drawing game. Just the word.',
      max_tokens: 5,
      temperature: 0.7
    });
    const word = response.data.choices[0].text.trim();
    res.json({ word });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching word');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
