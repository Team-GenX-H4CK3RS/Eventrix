from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import WebsiteGuideChatbot, MultiUserChatHistory
from tags_classifier import TagsClassifier
app = Flask(__name__)
CORS(app)

chatbot = WebsiteGuideChatbot()
muChatHistory = MultiUserChatHistory()
tagsClassifier = TagsClassifier()


@app.route('/api/get-classification', methods=['POST'])
def get_classification():
    try:
        data = request.get_json()
        tags = data.get('tags', '')

        if not tags:
            return jsonify({"error": "No tags provided"}), 400

        classification = tagsClassifier.classify(tags.split(','))

        return jsonify({"classification": classification})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/chatbot/ask', methods=['POST'])
def chatbot_ask():
    try:
        data = request.get_json()
        user_id = data.get('userId', '')
        question = data.get('q', '')

        if not user_id or not question:
            return jsonify({"error": "userId and question are required"}), 400

        muChatHistory.create(user_id)
        chatbot.respond(muChatHistory.get(user_id))

        chatbot_response = chatbot.respond(
            question, muChatHistory.get(user_id))

        return jsonify({"response": chatbot_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def classify_tags(tags):
    return {"category": "Technology", "subcategory": "AI & ML"}


def get_chatbot_response(user_id, question):
    return f"Hello {user_id}, you asked: {question}. Here's my answer: 'I'm just a demo bot!'"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
