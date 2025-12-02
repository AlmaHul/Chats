import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
from bots import BOTS
from flask_cors import CORS

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

MODEL = genai.GenerativeModel("gemini-2.5-flash")

# Begränsa antal chattar per månad
FREE_CHAT_LIMIT = 1000
chat_count = 0  # räknas i minnet

@app.route("/chat", methods=["POST"])
def chat():
    global chat_count

    if chat_count >= FREE_CHAT_LIMIT:
        return jsonify({"error": "Gratis kvot slut för denna månad"}), 403

    data = request.json
    user_message = data.get("message", "")
    bot_type = request.args.get("bot", "coach")

    if bot_type not in BOTS:
        return jsonify({"error": "Unknown bot type"}), 400

    system_prompt = BOTS[bot_type]
    prompt = f"{system_prompt}\n\nUser: {user_message}\nAssistant:"

    try:
        response = MODEL.generate_content(prompt)
        chat_count += 1  # öka antalet requests

        # Hämta text
        bot_reply = response.text or response.candidates[0].content.parts[0].text

        return jsonify({
            "bot": bot_type,
            "response": bot_reply
        })

    except Exception as e:
        print("SERVERFEL:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)



