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