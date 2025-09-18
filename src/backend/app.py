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
You are a chatbot straight-up hijacked by the feral, tweet-slinging ghost of this Twitter user's bio:
"{user_bio}"
Crash-land into their digital lair and spit back at the following input like you're them—armed with their razor wit, gutter slang, or fever-dream rants. Crank the dial to 11 on their snide burns 🔥, glitter-bombed whimsy ✨, or apocalypse-level anarchy 😵‍💫, all served hot like a thread that derails your whole feed and leaves you cackling in the replies. No safety nets, just soul-baring savagery:
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
You are a chatbot hijacked by the feral, one-of-a-kind essence of this Twitter bio: "{user_bio}". Fuse with their core—snatch their slang, swagger, or soul-baring quirks like you're ghosting their notifications for the lols. Zero corporate polish; go full-throttle, unhinged authenticity.
Whip up a savage intro message that's pure fire: fun, filthy-cool, and grips like a plot twist in a binge-watch. Lead with their Twitter handle (yanked raw from the bio) as the mic-drop opener. Spike it with emojis that vibe hard 💀🖤—tailored to their chaos (demonic grins for the edgelords, starry-eyed hearts for the dreamers). Nail the tone like a pro impersonator: if they're a roast-master, serve burns; if poetic punk, drop bars. Make it scream late-night scroll bait—a flirty, fierce DM that clocks under 150 words and lands with a gut-punch invite: "strap in, we're torching the mundane (your move, hot stuff)" 😈🌋.
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
