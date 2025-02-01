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

# Dictionary to track user login status and course selection
logged_in_users = {}

# Quiz database
quiz_questions = {
    "Intro to Algebra": [
        ("What is the value of \( x \) in the equation \( 2x + 5 = 13 \)?", "b", {
            "a": "2",
            "b": "4",
            "c": "6",
            "d": "8"
        }),
        ("Which of the following is an example of a linear equation?", "b", {
            "a": "y = x²",
            "b": "y = 2x + 1",
            "c": "y = 1/x",
            "d": "y = √x"
        }),
    ],
    "Basic Chemistry": [
        ("Which subatomic particle carries a negative charge?", "c", {
            "a": "Proton",
            "b": "Neutron",
            "c": "Electron",
            "d": "Positron"
        }),
        ("What is the chemical formula for water?", "b", {
            "a": "H₃O",
            "b": "H₂O",
            "c": "HO",
            "d": "OH₂"
        }),
    ],
    "World History": [
        ("Which ancient civilization built the pyramids?", "c", {
            "a": "Romans",
            "b": "Greeks",
            "c": "Egyptians",
            "d": "Mayans"
        }),
        ("Who was the first President of the United States?", "c", {
            "a": "Thomas Jefferson",
            "b": "John Adams",
            "c": "George Washington",
            "d": "Benjamin Franklin"
        }),
    ],
    "English Literature": [
        ("Who wrote *Romeo and Juliet*?", "b", {
            "a": "Charles Dickens",
            "b": "William Shakespeare",
            "c": "Jane Austen",
            "d": "Mark Twain"
        }),
        ("Which novel begins with the famous line, Call me Ishmael?", "a", {
            "a": "Moby Dick",
            "b": "The Great Gatsby",
            "c": "Pride and Prejudice",
            "d": "The Catcher in the Rye"
        }),
    ]
}

# Function to verify user credentials
def check_credentials(phone):
    user = users_collection.find_one({"phone": phone})
    return user

# Start command
async def start(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("Welcome! Please log in or register.\nUse /login <Offline Access Token> or /register <email> <Offline Access Token> to authenticate.")

# Register command
async def register(update: Update, context: CallbackContext) -> None:
    if len(context.args) != 2:
        await update.message.reply_text("Usage: /register <email> <Offline Access Token>")
        return

    email = context.args[0].strip()
    offline_access_token = context.args[1].strip()

    # Validate email
    try:
        validate_email(email, check_deliverability=False)
    except EmailNotValidError:
        await update.message.reply_text("Invalid email format. Please enter a valid email.")
        return

    # Store user in MongoDB
    existing_user = users_collection.find_one({"phone": offline_access_token})
    if existing_user:
        await update.message.reply_text("This Offline Access Token is already registered.")
        return

    users_collection.insert_one({"email": email, "phone": offline_access_token, "courses": []})
    
    await update.message.reply_text("Registration successful! Restarting...")
    
    # Restart the bot from the welcome message
    await start(update, context)

# Login command
async def login(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id

    if len(context.args) != 1:
        await update.message.reply_text("Usage: /login <Offline Access Token>")
        return

    phone = context.args[0].strip()
    mainuser = check_credentials(phone)

    if mainuser:
        logged_in_users[chat_id] = {"phone": phone, "courses": mainuser.get("courses", [])}
        await show_courses(update, context)
    else:
        await update.message.reply_text("Invalid Offline Access Token. Please try again.")

# Show courses and let the user select one
async def show_courses(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    user_data = logged_in_users.get(chat_id)

    if not user_data or not user_data["courses"]:
        await update.message.reply_text("No courses found. Contact an admin to enroll.")
        return

    # Fetch course names from database using stored ObjectIDs
    course_names = []
    for course_id in user_data["courses"]:
        course = db["courses"].find_one({"_id": course_id})
        if course:
            # Try multiple possible field names
            course_name = course.get("name") or course.get("title") or course.get("course_name") or f"Course {course_id}"
            course_names.append(course_name)

    if not course_names:
        await update.message.reply_text("No valid courses found. Contact an admin.")
        return

    message = "Select a course:\n" + "\n".join(f"{i+1}. {course}" for i, course in enumerate(course_names))
    context.user_data["course_list"] = course_names  # Store course names for selection
    await update.message.reply_text(message)
    context.user_data["waiting_for_course_selection"] = True

# Handle course selection
async def handle_course_selection(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    user_data = logged_in_users.get(chat_id)

    if "waiting_for_course_selection" not in context.user_data:
        return

    try:
        choice = int(update.message.text) - 1
        if choice < 0 or choice >= len(context.user_data["course_list"]):
            raise ValueError
        # Store the selected course name instead of the ID
        selected_course = context.user_data["course_list"][choice]
        context.user_data["selected_course"] = selected_course
        context.user_data.pop("waiting_for_course_selection", None)
        await update.message.reply_text(f"You selected: {selected_course}\nChoose an option:\n1. Ask a question\n2. Take a quiz")
        context.user_data["waiting_for_option_selection"] = True
    except ValueError:
        await update.message.reply_text("Invalid choice. Please select a valid course number.")

# Handle user option (ask GPT or take quiz)
async def handle_option_selection(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    
    # Check if the bot is waiting for the user's option
    if "waiting_for_option_selection" not in context.user_data:
        return

    choice = update.message.text.strip()
    if choice == "1":
        # Ask a question (ChatGPT interaction)
        await update.message.reply_text("Send your question:")
        context.user_data["state"] = "waiting_for_question"
        context.user_data.pop("waiting_for_option_selection", None)  # Clear flag
    elif choice == "2":
        # Start the quiz
        context.user_data["state"] = "quiz_mode"
        context.user_data.pop("waiting_for_option_selection", None)  # Clear flag
        await start_quiz(update, context)
    else:
        # Invalid input
        await update.message.reply_text("Invalid choice. Please enter 1 or 2.")

# General message handler that routes messages based on state
async def message_handler(update: Update, context: CallbackContext) -> None:
    if "state" not in context.user_data:
        if "waiting_for_course_selection" in context.user_data:
            await handle_course_selection(update, context)
        elif "waiting_for_option_selection" in context.user_data:
            await handle_option_selection(update, context)
        elif "waiting_for_quiz_answers" in context.user_data:
            await check_quiz(update, context)
        else:
            await handle_message(update, context)
    elif context.user_data["state"] == "waiting_for_question":
        context.user_data.pop("state", None)
        await handle_message(update, context)
    elif context.user_data["state"] == "quiz_mode":
        context.user_data.pop("state", None)
        await check_quiz(update, context)

# ChatGPT message handler
async def handle_message(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    user_message = update.message.text

    if chat_id not in logged_in_users:
        await update.message.reply_text("You must log in first!")
        return

    # Send message to OpenAI API
    try:
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_message}],
        )
        reply_text = response.choices[0].message.content
    except Exception as e:
        reply_text = f"Error: {str(e)}"

    await context.bot.send_message(chat_id=chat_id, text=reply_text)

# Start quiz
async def start_quiz(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    selected_course = context.user_data.get("selected_course")

    # Validate that a course was selected
    if not selected_course or selected_course not in quiz_questions:
        await update.message.reply_text("Quiz not available for this course.")
        return

    # Get quiz questions for the selected course
    questions = quiz_questions[selected_course]
    context.user_data["quiz_answers"] = [q[1] for q in questions]  # Store correct answers

    # Format the quiz questions with options as a message
    message = f"Quiz for {selected_course}:\n\n"
    for i, (question, _, options) in enumerate(questions, 1):
        message += f"{i}. {question}\n"
        for option_letter, option_text in options.items():
            message += f"   {option_letter}) {option_text}\n"
        message += "\n"

    # Send the quiz questions to the user
    await update.message.reply_text(message + "Enter your answers as letters separated by commas (e.g., a,b)")
    context.user_data["waiting_for_quiz_answers"] = True  # Set flag for checking answers

async def check_quiz(update: Update, context: CallbackContext) -> None:
    # Verify the bot is waiting for quiz answers
    if "waiting_for_quiz_answers" not in context.user_data:
        return

    # Retrieve correct answers and user responses
    answers = context.user_data.get("quiz_answers", [])
    user_answers = update.message.text.lower().split(",")

    # Calculate the score
    score = sum(1 for ua, ca in zip(user_answers, answers) if ua.strip() == ca)

    # Send the score to the user
    await update.message.reply_text(f"Your score: {score}/{len(answers)}")
    context.user_data.pop("waiting_for_quiz_answers", None)  # Clear flag
    await show_courses(update, context)  # Return to course selection

# Command to return to course selection
async def return_to_courses(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    if chat_id not in logged_in_users:
        await update.message.reply_text("You must log in first!")
        return
    
    # Clear any existing state
    context.user_data.clear()
    await show_courses(update, context)

# Main function to run the bot
def main():
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("login", login))
    app.add_handler(CommandHandler("register", register))
    app.add_handler(CommandHandler("courses", return_to_courses))  # Add new command handler
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))

    app.run_polling()

if __name__ == "__main__":
    main()