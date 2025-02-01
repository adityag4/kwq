const OpenAI = require('openai');
const Course = require('../models/Course');
const mongoose = require('mongoose');

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://api.openai.com/v1'
});

async function generateContent(title, courseName) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an expert teacher creating comprehensive educational content.`
      },
      {
        role: "user",
        content: `Create a detailed educational lesson about "${title}" for the course "${courseName}".`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  return completion.choices[0].message.content;
}

async function generateAllContent() {
  try {
    await mongoose.connect('mongodb://localhost:27017/your_database');
    
    const courses = await Course.find({});
    
    for (const course of courses) {
      console.log(`Processing course: ${course.title}`);
      
      for (const reading of course.readings) {
        if (!reading.content) {
          console.log(`Generating content for reading: ${reading.title}`);
          const content = await generateContent(reading.title, course.title);
          reading.content = content;
          await course.save();
          console.log('Content generated and saved');
        }
      }
    }
    
    console.log('All content generated successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

generateAllContent(); 