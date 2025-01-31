const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://api.openai.com/v1'
});

router.post('/generate', async (req, res) => {
  try {
    const { title, courseName } = req.body;
    console.log('Generating content for:', { title, courseName });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Using GPT-3.5-turbo explicitly
      messages: [
        {
          role: "system",
          content: `You are an expert teacher creating comprehensive educational content. 
          Your responses should be detailed and thorough, with clear explanations and examples.
          Always use proper HTML formatting.`
        },
        {
          role: "user",
          content: `Create a detailed educational lesson about "${title}" for the course "${courseName}".
          
          Structure your response exactly like this:
          
          <div class="reading-content">
            <h1>${title}</h1>
            
            <h2>Introduction</h2>
            <p>[Write 2-3 paragraphs explaining the importance and relevance of this topic]</p>
            
            <h2>Main Concepts</h2>
            <ul>
              [List at least 5 key concepts with detailed explanations]
            </ul>
            
            <h2>Detailed Explanation</h2>
            <p>[Provide thorough explanations with real-world examples]</p>
            
            <h2>Summary</h2>
            <ul>
              [List 5-7 key takeaways]
            </ul>
            
            <h2>Check Your Understanding</h2>
            <div class="questions">
              [Include 3 thought-provoking questions]
            </div>
          </div>

          Make sure to replace all bracketed instructions with actual content.
          Each section should have substantial content (at least 150 words for detailed sections).
          Do not include any placeholder text in brackets - replace all of them with real content.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    console.log('Generated content length:', completion.choices[0].message.content.length);
    const generatedContent = completion.choices[0].message.content;
    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 