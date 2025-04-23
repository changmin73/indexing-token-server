import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.post('/token', async (req, res) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const clientEmail = process.env.CLIENT_EMAIL;
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    const response = await axios.post('https://oauth2.googleapis.com/token', {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    });

    res.json({ access_token: response.data.access_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Token generation failed' });
  }
});

app.listen(3000, () => console.log('✅ Token server running'));
