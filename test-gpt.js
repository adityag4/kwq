const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://api.openai.com/v1'
});

async function testGPT() {
  try {
    console.log('Testing GPT API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Give me a short 2-sentence response about learning."
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    console.log('\nAPI Response:');
    console.log('Status: Success');
    console.log('Content:', completion.choices[0].message.content);
  } catch (error) {
    console.error('\nError testing GPT API:');
    console.error('Status: Failed');
    console.error('Error message:', error.message);
  }
}

testGPT();