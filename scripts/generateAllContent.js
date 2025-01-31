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