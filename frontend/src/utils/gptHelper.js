const generateLessonContent = async (lesson) => {
  try {
    const response = await fetch('http://localhost:5001/api/gpt/generate-lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: lesson.title,
        subject: lesson.subject,
        duration: lesson.duration,
        difficulty: lesson.difficulty || 'intermediate'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating lesson content:', error);
    return null;
  }
};

export { generateLessonContent }; 