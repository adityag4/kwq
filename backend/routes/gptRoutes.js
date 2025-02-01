const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/generate-lesson', async (req, res) => {
  try {
    const { title, subject, duration, difficulty } = req.body;

    const prompt = `Create an educational lesson about "${title}" for ${subject} students.
    The lesson should take approximately ${duration} minutes to complete and be at a ${difficulty} level.
    Include an introduction, main concepts, examples, and a brief summary.
    Format the response in markdown.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('GPT generation error:', error);
    res.status(500).json({ error: 'Failed to generate lesson content' });
  }
});

module.exports = router; 