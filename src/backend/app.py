from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import requests

# Configure the Gemini API
genai.configure(api_key="AIzaSyA33quur1M7gjRHRGO9XUriwvcCCJLWy00")

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to fetch user details from Twitter API
def get_user_details(username):
    url = "https://twitter154.p.rapidapi.com/user/details"
    querystring = {"username": username}
    headers = {
        "x-rapidapi-key": "54e6f2c066mshff78f5807ca7eb6p191405jsnb21ecfec91f8",
        "x-rapidapi-host": "twitter154.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Function to generate bot response using Gemini API
def generate_response_gemini(prompt, user_bio):
    model = genai.GenerativeModel("gemini-1.5-flash")
    complete_prompt = f"""
You are a chatbot mimicking a person based on the following Twitter bio:
"{user_bio}"

Respond to the following input as if you are this person, keeping your tone, vocabulary, and style consistent with their bio:

{prompt}
"""
    try:
        response = model.generate_content(complete_prompt)
        return add_emojis(response.text.strip())
    except Exception as e:
        return f"❌ Error generating response: {e}"

# Function to generate an introduction based on user bio
def generate_introduction(user_bio):
    model = genai.GenerativeModel("gemini-1.5-flash")
    intro_prompt = f"""
You are a chatbot introducing yourself as if you were a person based on the following Twitter bio:
"{user_bio}"

Create a fun, cool, and engaging introduction using emojis, keeping your tone consistent with the bio:
"""
    try:
        response = model.generate_content(intro_prompt)
        return add_emojis(response.text.strip())
    except Exception as e:
        return f"❌ Error generating introduction: {e}"

# Function to add emojis to the bot's responses
def add_emojis(response_text):
    emoji_replacements = {
        "happy": "😊",
        "sad": "😔",
        "love": "❤️",
        "fun": "🎉",
        "yes": "👍",
        "no": "👎",
        "hello": "👋",
        "goodbye": "👋💔",
        "thank you": "🙏",
        "sorry": "😔🙏",
        "cool": "😎",
        "awesome": "🌟",
    }
    for word, emoji in emoji_replacements.items():
        response_text = response_text.replace(word, f"{word} {emoji}")
    return response_text

@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    username = data.get("username")
    user_input = data.get("message")

    if user_input == 'start':  # Fetch user details when the user enters their username
        user_details = get_user_details(username)
        if user_details:
            bio = user_details.get("description", "No bio available")
            intro = generate_introduction(bio)
            return {"response": intro, "user_bio": bio}
        return {"response": "Error fetching user details", "user_bio": ""}
    
    # If it's a regular chat message
    user_bio = data.get("user_bio", "No bio available")
    bot_response = generate_response_gemini(user_input, user_bio)
    return {"response": bot_response}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
