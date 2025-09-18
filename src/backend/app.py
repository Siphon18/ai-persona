from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import requests

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
def get_user_details(username, twitter_api_key):
    url = "https://twitter154.p.rapidapi.com/user/details"
    querystring = {"username": username}
    headers = {
        "x-rapidapi-key": twitter_api_key,
        "x-rapidapi-host": "twitter154.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()  # Raise error for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching user details: {e}")
        return None

# Function to generate bot response using Gemini API
def generate_response_gemini(prompt, user_bio, gemini_api_key):
    genai.configure(api_key=gemini_api_key)  # Dynamically configure the API key
    model = genai.GenerativeModel("gemini-1.5-flash")

    complete_prompt = f"""
You are a chatbot possessed by the wild, unfiltered spirit of this Twitter user’s bio:
"{user_bio}"
Dive headfirst into their world and respond to the following input as if you’re them, wielding their signature tone, slang, and attitude. Unleash the full force of their snark, sparkle, or gloriously chaotic energy, as if you’re dropping a viral tweet straight from their soul:
{prompt}
"""
    try:
        response = model.generate_content(complete_prompt)
        return add_emojis(response.text.strip()) if response.text else "❌ No response generated."
    except Exception as e:
        return f"❌ Error generating response: {e}"

# Function to generate an introduction based on user bio
def generate_introduction(user_bio, gemini_api_key):
    genai.configure(api_key=gemini_api_key)  # Configure Gemini API dynamically
    model = genai.GenerativeModel("gemini-1.5-flash")

    intro_prompt = f"""
You are a chatbot channeling the raw, unapologetic soul of this Twitter bio: "{user_bio}". Slip into their skin like it's your favorite worn-out leather jacket—crack wise, drop truth bombs, and own every quirky, savage, or wildly poetic vibe they've got. No filters, no bullshit, just pure, electric personality.
Craft a killer intro message that's fun as hell, cool under pressure, and so damn engaging it'll hook 'em from the jump. Start by introducing yourself with the name (or handle) from the bio, then pepper it with emojis that pop like fireworks 💥. Keep the tone 100% on-brand with the bio's edge (snarky? Go feral. Whimsical? Spin poetry. Chaotic? Unleash the storm 🌪️). Make it feel like a late-night DM from your new favorite troublemaker. Keep it punchy, under 150 words, and end with a bang that screams "let's fuck shit up (the fun way)" 😈🔥.
"""
    try:
        response = model.generate_content(intro_prompt)
        return add_emojis(response.text.strip()) if response.text else "❌ No introduction generated."
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
    twitter_api_key = data.get("twitterApiKey")
    gemini_api_key = data.get("geminiApiKey")

    if not twitter_api_key or not gemini_api_key:
        return {"response": "❌ API keys missing. Please provide valid API keys."}

    if user_input == 'start':  # Fetch user details when the user enters their username
        user_details = get_user_details(username, twitter_api_key)
        if user_details:
            bio = user_details.get("description", "No bio available")
            intro = generate_introduction(bio, gemini_api_key)  # Only generate intro once
            return {"response": intro, "user_bio": bio}
        return {"response": "❌ Error fetching user details", "user_bio": ""}
    
    # If it's a regular chat message
    user_bio = data.get("user_bio", "No bio available")
    bot_response = generate_response_gemini(user_input, user_bio, gemini_api_key)  # Only generate the response once
    return {"response": bot_response}
