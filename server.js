const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const GEMINI_API_KEY = 'AIzaSyAH-RCiHQua5_DzXEcDGMCrjfDHjs4Fyc4';

app.post('/ask', async (req, res) => {
  const userInput = req.body.message;

  // Ethical filter
  const badWords = ['fuck', 'idiot', 'stupid', 'bitch'];
  if (badWords.some(word => userInput.toLowerCase().includes(word))) {
    return res.json({ reply: 'ඔබ තාම ඉගෙන ගන්න වයසේ දරුවෙක් අමතකද?' });
  }

  // Gemini API call
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userInput }] }]
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'මට ඒක තේරෙන්නේ නැහැ.';
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ reply: 'Server error. කරුණාකර පසුව උත්සාහ කරන්න.' });
  }
});

app.listen(3000, () => console.log('VISHWA AI is running on port 3000'));
