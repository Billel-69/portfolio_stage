import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'data', 'documents.json');
const documents = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/ask', async (req, res) => {
  const { question, docId } = req.body;
  const document = documents.find(d => d.id === docId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Tu es un assistant répondant aux questions sur ce document : ${document.content}` },
        { role: 'user', content: question }
      ]
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur avec OpenAI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
