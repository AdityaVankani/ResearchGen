from flask import Flask, request, jsonify
from gradio_client import Client, handle_file

app = Flask(__name__)
client = Client("gabrielchua/open-notebooklm")

@app.route("/generate_podcast", methods=["POST"])
def generate_podcast():
    try:
        data = request.json
        file_url = data.get("file_url")
        question = data.get("question", "")
        tone = data.get("tone", "Fun")
        length = data.get("length", "Short (1-2 min)")
        language = data.get("language", "English")
        use_advanced_audio = data.get("use_advanced_audio", True)
        
        if not file_url:
            return jsonify({"error": "file_url is required"}), 400
        
        file = handle_file(file_url)
        result = client.predict(
            files=[file],
            url="",
            question=question,
            tone=tone,
            length=length,
            language=language,
            use_advanced_audio=use_advanced_audio,
            api_name="/generate_podcast"
        )
        
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)