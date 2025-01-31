const lessonRoutes = require('./routes/lessonRoutes');
const readingRoutes = require('./routes/readingRoutes');

app.use('/api/lessons', lessonRoutes);
app.use('/api/readings', readingRoutes); 