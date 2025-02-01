import openai
import asyncio
from pymongo import MongoClient
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
from telegram import Update
import certifi
from email_validator import validate_email, EmailNotValidError
from datetime import datetime

# User credentials
TELEGRAM_BOT_TOKEN = "7975477552:AAFlWPLpezHxx674jZGp1U_-m9yEhu2Kwww"
OPENAI_API_KEY = "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"
MONGO_URI = "mongodb+srv://sunayau:passwordforhackathon@cluster0.b9sz7.mongodb.net/?retryWrites=true&w=majority&ssl=true"

# Connect to MongoDB
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["learnbridge"]  # Database name
users_collection = db["students"]  # Collection for user login info

# Set up OpenAI API
openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Dictionary to track user login status
logged_in_users = {}

# Function to verify user credentials
def check_credentials(phone):
    user = users_collection.find_one({"phone": phone})
    print("babasdasd", user)
    return user

# Start command
async def start(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("Welcome! Please log in or register.\nUse /login <Offline Access Token> or /register <email> <Offline Access Token  to authenticate.")

# Login command
async def login(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id

    # Ensure user provides username and password
    if len(context.args) != 1:
        await update.message.reply_text("Usage: /login <Offline Access Token>")
        return

    phone = context.args[0].strip()
    print(phone)
    mainuser = check_credentials(phone)

    # Verify credentials
    if mainuser:
        logged_in_users[chat_id] = phone  # Store login session
        await update.message.reply_text(f"Login successful! Welcome, {mainuser.get('name', 'noname')}. You can now ask questions.")
    else:
        await update.message.reply_text("Invalid Offline Access Token. Please try again.")

# Logout command
async def logout(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id

    if chat_id in logged_in_users:
        del logged_in_users[chat_id]
        await update.message.reply_text("You have been logged out successfully.")
    else:
        await update.message.reply_text("You are not logged in.")

# ChatGPT message handler (only for logged-in users)
async def handle_message(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id

    # Check if user is logged in
    # if chat_id not in logged_in_users:
    #     await update.message.reply_text("You must log in first! Use /login <username> <password>.")
    #     return

    user_message = update.message.text

    # Send user message to ChatGPT
    try:
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_message}],
        )
        reply_text = response.choices[0].message.content
    except Exception as e:
        reply_text = f"Error: {str(e)}"

    # Send response
    await context.bot.send_message(chat_id=chat_id, text=reply_text)

# Register command
async def register(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    
    if len(context.args) != 2:
        await update.message.reply_text(
            "Usage: /register <email> <offline_access_token>\n"
            "Example: /register john@example.com 1234567890"
        )
        return

    email, access_token = context.args

    # Validate email format
    try:
        validate_email(email)
    except EmailNotValidError:
        await update.message.reply_text("Please provide a valid email address.")
        return

    # Validate access token format
    if not access_token.isdigit() or len(access_token) != 10:
        await update.message.reply_text("Access token must be a 10-digit number.")
        return

    try:
        # Check if access token is already in use
        existing_user = users_collection.find_one({"phone": access_token})
        if existing_user:
            await update.message.reply_text("This access token is already in use. Please choose a different one.")
            return

        # Create new user
        new_user = {
            "email": email,
            "phone": access_token,
            "firstLogin": True,
            "lastLogin": datetime.now(),
            "courses": []
        }
        
        result = users_collection.insert_one(new_user)
        
        if result.inserted_id:
            await update.message.reply_text(
                "Registration successful! You can now use /login with your access token."
            )
        else:
            await update.message.reply_text("Registration failed. Please try again.")
            
    except Exception as e:
        print(f"Registration error: {str(e)}")
        await update.message.reply_text("An error occurred during registration. Please try again later.")

# Main function to run the bot
def main():
    # Create bot application
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Add command handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("login", login))
    app.add_handler(CommandHandler("logout", logout))
    app.add_handler(CommandHandler("register", register))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Run the bot
    app.run_polling()

if __name__ == "__main__":
    main()