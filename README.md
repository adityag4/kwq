# LearnBridge - Educational Platform

LearnBridge is an interactive educational platform that combines course management, quizzes, and AI-powered learning assistance, especially targeted towards making education accessible for displaced children.

## Prerequisites

- Node.js (v14 or higher) - From https://nodejs.org/en/downloads/current
- MongoDB
- Python 3.8 or higher
- pip (Python package manager)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/learnbridge.git
cd learnbridge
```


### 2. Backend Setup


```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Database Setup

1. Start MongoDB service on your system
2. Seed the database:

```bash
cd backend
node server.js
```

### 5. Run the Application

```bash
cd frontend
npm run dev
```
### 5. Run the SMS emulation (Telegram Component)

```bash
python3 telegrambot.py
```
To access the telegram bot, you need to have a telegram account and add the bot to your contacts. The bot can be added at @kwq2bot.

## Features

- Course Management
- Interactive Quizzes
- AI-Powered Learning Assistant (via Telegram)
- Progress Tracking
- Real-time Course Updates

## Project Structure
learnbridge/
├── backend/
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ ├── config/ # Configuration files
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ └── utils/ # Utility functions
│ └── public/ # Static files
├──telegrambot.py # Telegram bot service


## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure MongoDB service is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **Telegram Bot Issues**
   - Verify bot token
   - Ensure Python dependencies are installed
   - Check internet connection

3. **API Connection Issues**
   - Verify all services are running
   - Check port availability
   - Ensure CORS is properly configured

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
