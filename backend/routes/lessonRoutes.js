const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://api.openai.com/v1'
});

router.post('/generate', async (req, res) => {
  try {
    const { title, subject } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator."
        },
        {
          role: "user",
          content: `Create an educational lesson about "${title}" in the subject of ${subject}.
          Include:
          1. A brief introduction
          2. Key concepts
          3. Examples
          4. Practice questions
          Format the response in HTML with appropriate headings and paragraphs.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const generatedContent = completion.choices[0].message.content;

    res.json({ 
      content: generatedContent,
      status: 'success'
    });
  } catch (error) {
    console.error('Error generating lesson:', error);
    res.status(500).json({ 
      error: 'Failed to generate lesson content',
      details: error.message 
    });
  }
});

module.exports = router; 