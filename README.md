# AI Persona

## Project Overview
This repository contains the source code for an AI chatbot application that uses the Gemini API for generating personalized responses. The chatbot mimics the style and tone of a specified Twitter user, leveraging user bio information fetched from the Twitter API. It features a modern, interactive frontend built with React and a backend powered by FastAPI.

## Features
- Fetches Twitter user details to personalize bot responses.
- Generates context-aware responses using the Gemini generative AI model.
- Emoji-enhanced chatbot interactions.
- Fully responsive UI with smooth animations and transitions.
- Backend integration with RapidAPI for Twitter data.

## Tech Stack
### Frontend
- **React**: For building the user interface.
- **Framer Motion**: For animations and transitions.
- **Tailwind CSS**: For styling the application.

### Backend
- **FastAPI**: For handling API requests and responses.
- **Gemini API**: For generative AI capabilities.
- **RapidAPI**: For fetching Twitter user details.
- **CORS Middleware**: For enabling cross-origin resource sharing.

### Deployment
- **Uvicorn**: For running the FastAPI server.

## Installation

### Prerequisites
- Node.js (for the frontend)
- Python 3.9+ (for the backend)
- A valid API key for:
  - Gemini API
  - RapidAPI (Twitter API)

### Steps

#### Backend
1. Clone this repository:
    ```bash
    git clone https://github.com/Siphon18/my-app.git
    cd ai-chatbot-gemini/backend
    ```
2. Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Set up environment variables:
    Create a `.env` file and add the following:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    RAPIDAPI_KEY=your_rapidapi_key
    ```
5. Run the backend server:
    ```bash
    uvicorn main:app --reload
    ```

#### Frontend
1. Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

## API Endpoints

### 1. Fetch User Details
**GET** `/api/user/{username}`
- Fetches Twitter user bio information.

### 2. Generate Chat Response
**POST** `/api/chat`
- Request Body:
    ```json
    {
      "prompt": "Your message here",
      "username": "elonmusk"
    }
    ```
- Response:
    ```json
    {
      "response": "Generated response here"
    }
    ```

## Usage
1. Open the frontend at `http://localhost:5173`.
2. Enter a username (e.g., `elonmusk`) and start chatting!
3. The chatbot will respond in the style of the specified Twitter user.

## Screenshots
my-app\public\screenshot\image.png

my-app\public\screenshot\Screenshot 2024-12-29 162933.png

my-app\public\screenshot\Screenshot 2024-12-29 162922.png


## Future Enhancements
- Add support for additional generative AI models.
- Improve the error handling and logging system.
- Enhance the UI/UX with more customization options.
- Integrate user authentication and profile management.

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements
- [OpenAI](https://openai.com/) for the Gemini model.
- [RapidAPI](https://rapidapi.com/) for Twitter API integration.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Framer Motion](https://www.framer.com/motion/) for animations.

---
Happy coding! 🚀

