import elevenlabs
from flask import Flask, request, send_file, jsonify
import os
import whisper
from gtts import gTTS
from moviepy.editor import TextClip, CompositeVideoClip, AudioFileClip, ColorClip
from moviepy.video.fx import fadein, fadeout
import pygame
import time
import json
import PyPDF2
from langchain_groq import ChatGroq
from flask_cors import CORS
from flask import Flask, request, jsonify
from gradio_client import Client, handle_file
import cloudinary
import cloudinary.uploader
import os
import time
from elevenlabs.client import ElevenLabs
# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
# Define paths for uploads and generated videos
UPLOAD_FOLDER = "uploads"
VIDEO_FOLDER = "generated_videos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VIDEO_FOLDER, exist_ok=True)

# Initialize Whisper model
model = whisper.load_model("base")

# Initialize ChatGroq LLM for summarization
llm = ChatGroq(api_key="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", model="llama-3.3-70b-versatile")
cloudinary.config(
    cloud_name="dfx1wn6l4",
    api_key="489759552276462",
    api_secret="j0pCgqMZR8LS0x01Wil6ypNRIgM"
)

client = Client("gabrielchua/open-notebooklm")
def process_podcast(file_path=None, url=None, question="", tone="Fun", length="Medium (3-5 min)", language="English", use_advanced_audio=True):
    """ Runs the podcast generation synchronously """
    try:
        time.sleep(2)  # Simulate delay
        result = client.predict(
            files=[handle_file(file_path)] if file_path else [],
            url=url if url else "",
            question=question,
            tone=tone,
            length=length,
            language=language,
            use_advanced_audio=use_advanced_audio,
            api_name="/generate_podcast"
        )

        audio_path, transcript_text = result  # Unpack tuple

        if audio_path.startswith("http"):
            audio_url = audio_path
        else:
            response = cloudinary.uploader.upload(audio_path, resource_type="video")
            audio_url = response["secure_url"]

        # Extract dialogues
        dialogues = []
        for line in transcript_text.split("\n\n"):
            if "" in line:
                speaker, text = line.split(": ", 1)
                speaker = speaker.replace("", "").strip()
                dialogues.append(f"{speaker}: {text.strip()}")

        return {"status": "completed", "audio_url": audio_url, "formatted_text": "\n".join(dialogues)}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
    
def generate_speech_from_text(text, output_file="audio.mp3"):
    """
    Converts the input text into speech and saves it as an audio file.
    Args:
    - text (str): The input text to convert into speech.
    - output_file (str): The name of the output audio file. Defaults to 'audio.mp3'.
    """
    tts = gTTS(text)
    tts.save(output_file)
# def generate_speech_from_text(text, output_file="audio.mp3"):
#     """Converts input text into speech using ElevenLabs API."""
#     print("Generating speech from text...")
    
#     # Initialize the client using API key in a correct manner
#     client = elevenlabs.ElevenLabs(api_key="sk_ebb682d654e1b5485528af9a0418c0b432bf86793809336e")
    
#     try:
#         # Convert text to speech
#         audio_stream = client.text_to_speech.convert_as_stream(
#             text=text,
#             voice_id="ErXwobaYiN019PkySvjV",
#             model_id="eleven_multilingual_v2"
#         )
        
#         # Save the audio as a file
#         with open(output_file, "wb") as f:
#             for chunk in audio_stream:
#                 if isinstance(chunk, bytes):
#                     f.write(chunk)
#         print(f"Audio saved as {output_file}")
#     except Exception as e:
#         print(f"Error generating speech: {e}")
def process_audio_and_generate_video(audio_file):
    """
    Transcribes the audio, splits the text into lines, and generates a video with captions.
    """
    # Transcribe audio with Whisper
    result = model.transcribe(audio_file, word_timestamps=True)
    # print(result) 
    # Extract word-level timestamps
    wordlevel_info = []
    for segment in result['segments']:
        for word in segment['words']:
            if 'start' not in word or 'end' not in word:
                print(f"Skipping word due to missing timestamps: {word}")
                continue
            wordlevel_info.append({
                'word': word['word'].strip(),
                'start': word['start'],
                'end': word['end']
            })
    with open('data.json', 'w') as f:
        json.dump(wordlevel_info, f,indent=4)
    with open('data.json', 'r') as f:
        wordlevel_info_modified = json.load(f)
    # Split text into lines based on duration and character constraints
    def split_text_into_lines(data):
        MaxChars = 80
        MaxDuration = 3.0
        MaxGap = 1.5
        subtitles = []
        line = []
        line_duration = 0
        for idx, word_data in enumerate(data):
            word = word_data["word"]
            start = word_data["start"]
            end = word_data["end"]

            line.append(word_data)
            line_duration += end - start

            temp = " ".join(item["word"] for item in line)
            new_line_chars = len(temp)
            duration_exceeded = line_duration > MaxDuration
            chars_exceeded = new_line_chars > MaxChars
            if idx > 0:
                gap = word_data['start'] - data[idx - 1]['end']
                maxgap_exceeded = gap > MaxGap
            else:
                maxgap_exceeded = False

            if duration_exceeded or chars_exceeded or maxgap_exceeded:
                # print(f"Subtitle line exceeded duration or character limits: {line}")
                if line:
                    subtitle_line = {
                        "word": " ".join(item["word"] for item in line),
                        "start": line[0]["start"],
                        "end": line[-1]["end"],
                        "textcontents": line
                    }
                    subtitles.append(subtitle_line)
                    line = []
                    line_duration = 0

        if line:
            subtitle_line = {
                "word": " ".join(item["word"] for item in line),
                "start": line[0]["start"],
                "end": line[-1]["end"],
                "textcontents": line
            }
            subtitles.append(subtitle_line)

        return subtitles

    linelevel_subtitles = split_text_into_lines(wordlevel_info_modified)

    # Create video with subtitles
    audio = AudioFileClip(audio_file)
    audio_duration = audio.duration
    frame_size = (1080, 1080)

    # Function to create caption clips from subtitle data
    def create_caption(textJSON, framesize, font="Helvetica-Bold", fontsize=80, color='white', bgcolor='blue'):
        wordcount = len(textJSON['textcontents'])
        full_duration = textJSON['end'] - textJSON['start']

        word_clips = []
        xy_textclips_positions = []

        x_pos = 0
        y_pos = 0
        frame_width = framesize[0]
        frame_height = framesize[1]
        x_buffer = frame_width * 1 / 10
        y_buffer = frame_height * 1 / 5

        space_width = ""
        space_height = ""

        for index, wordJSON in enumerate(textJSON['textcontents']):
            duration = wordJSON['end'] - wordJSON['start']
            word_clip = TextClip(wordJSON['word'], font=font, fontsize=fontsize, color=color).set_start(textJSON['start']).set_duration(full_duration)
            word_clip_space = TextClip(" ", font=font, fontsize=fontsize, color=color).set_start(textJSON['start']).set_duration(full_duration)
            word_width, word_height = word_clip.size
            space_width, space_height = word_clip_space.size

            if x_pos + word_width + space_width > frame_width - 2 * x_buffer:
                # Move to the next line
                x_pos = 0
                y_pos = y_pos + word_height + 40

                # Store info of each word_clip created
                xy_textclips_positions.append({
                    "x_pos": x_pos + x_buffer,
                    "y_pos": y_pos + y_buffer,
                    "width": word_width,
                    "height": word_height,
                    "word": wordJSON['word'],
                    "start": wordJSON['start'],
                    "end": wordJSON['end'],
                    "duration": duration
                })

                word_clip = word_clip.set_position((x_pos + x_buffer, y_pos + y_buffer))
                word_clip_space = word_clip_space.set_position((x_pos + word_width + x_buffer, y_pos + y_buffer))
                x_pos = word_width + space_width
            else:
                # Store info of each word_clip created
                xy_textclips_positions.append({
                    "x_pos": x_pos + x_buffer,
                    "y_pos": y_pos + y_buffer,
                    "width": word_width,
                    "height": word_height,
                    "word": wordJSON['word'],
                    "start": wordJSON['start'],
                    "end": wordJSON['end'],
                    "duration": duration
                })

                word_clip = word_clip.set_position((x_pos + x_buffer, y_pos + y_buffer))
                word_clip_space = word_clip_space.set_position((x_pos + word_width + x_buffer, y_pos + y_buffer))

                x_pos = x_pos + word_width + space_width

            # Apply Fade-in and Fade-out effects to each word clip
            word_clip = fadein.fadein(word_clip, 0.5)  # Fade-in effect (0.5 seconds)
            word_clip = fadeout.fadeout(word_clip, 0.5)  # Fade-out effect (0.5 seconds)

            word_clips.append(word_clip)
            word_clips.append(word_clip_space)

        # Apply the blue highlight effect for the word being spoken
        for highlight_word in xy_textclips_positions:
            word_clip_highlight = TextClip(highlight_word['word'], font=font, fontsize=fontsize, color=color, bg_color='blue').set_start(highlight_word['start']).set_duration(highlight_word['duration'])
            word_clip_highlight = word_clip_highlight.set_position((highlight_word['x_pos'], highlight_word['y_pos']))

            # Apply Fade-in and Fade-out effects for the highlight text
            # word_clip_highlight = fadein.fadein(word_clip_highlight, 0.5)  # Fade-in effect
            # word_clip_highlight = f/adeout.fadeout(word_clip_highlight, 0.5)  # Fade-out effect

            word_clips.append(word_clip_highlight)

        return word_clips

    video_filename = os.path.join(VIDEO_FOLDER, "output_video.mp4")
    all_linelevel_splits = []

    for line in linelevel_subtitles:
        out = create_caption(line, frame_size)
        all_linelevel_splits.extend(out)

    # Create a background clip to fit the duration of the audio
    background_clip = ColorClip(size=frame_size, color=(0, 0, 0)).set_duration(audio_duration)

    # Combine the text clips with the background
    final_video = CompositeVideoClip([background_clip] + all_linelevel_splits)

    # Set the audio of the final video to the loaded audio
    final_video = final_video.set_audio(audio)  # Pass the AudioFileClip object, not a string path

    # Save the final clip as a video file with the audio included
    final_video.write_videofile(video_filename, fps=24, codec="libx264", audio_codec="aac")


    return video_filename

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text.strip()

# Function to split text into chunks
def split_text_into_chunks(text, chunk_size=3000):
    return [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]

# Function to summarize each chunk using ChatGroq
def summarize_chunk(chunk):
    prompt = f"Summarize this text in short:\n\n{chunk}"
    response = llm.invoke(prompt)
    return response.content if response else ""

# Function to summarize all text chunks
def summarize_text_chunks(chunks):
    summaries = []
    for index, chunk in enumerate(chunks):
        summary = summarize_chunk(chunk)
        summaries.append(summary)
        time.sleep(15)
    return "\n".join(summaries)

# Function for final summarization
def final_resummarization(text):
    prompt = f"Summarize the following in concise and meaningful words:\n\n{text}"
    response = llm.invoke(prompt)
    return response.content if response else ""

# Main function for processing the PDF and generating a summary
def process_pdf_and_generate_video(pdf_path):
    full_text = extract_text_from_pdf(pdf_path)
    text_chunks = split_text_into_chunks(full_text)
    summarized_text = summarize_text_chunks(text_chunks)
    final_summary = final_resummarization(summarized_text)
    return final_summary

# Route to process PDF and generate video
@app.route('/process_pdf', methods=['POST'])
def process_pdf():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']
    pdf_path = os.path.join(UPLOAD_FOLDER, pdf_file.filename)
    pdf_file.save(pdf_path)

    try:
        # Process the PDF and generate a summary
        final_summary = process_pdf_and_generate_video(pdf_path)
        
        # Generate speech from the summary and create a video
        audio_path = os.path.join(UPLOAD_FOLDER, "audio.mp3")
        generate_speech_from_text(final_summary, audio_path)
        
        # Process the generated audio and create video
        video_file = process_audio_and_generate_video(audio_path)
        
        return send_file(video_file, as_attachment=True, mimetype='video/mp4')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
# Route to handle POST request for processing text input and returning video
@app.route('/process_text', methods=['POST'])
def process_text():
    if 'text' not in request.form:
        return jsonify({"error": "No text provided"}), 400

    text = request.form['text']
    audio_path = os.path.join(UPLOAD_FOLDER, "audio.mp3")

    try:
        # Generate speech from text and save as audio file
        generate_speech_from_text(text, audio_path)
        
        # Process the generated audio and create video
        video_file = process_audio_and_generate_video(audio_path)
        
        return send_file(video_file, as_attachment=True, mimetype='video/mp4')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/generate_podcast', methods=['POST'])
def generate_podcast():
    """ Runs the podcast generation synchronously and returns the result """
    data = request.form  # 🔥 Use form-data instead of JSON

    file_path = None
    if 'file' in request.files:
        pdf_file = request.files['file']
        file_path = f"./{pdf_file.filename}"
        pdf_file.save(file_path)

    url = data.get("url", "")
    question = data.get("question", "")
    tone = data.get("tone", "Fun")
    length = data.get("length", "Medium (3-5 min)")
    language = data.get("language", "English")
    use_advanced_audio = data.get("use_advanced_audio", "True").lower() == "true"  # Convert string to boolean

    result = process_podcast(file_path, url, question, tone, length, language, use_advanced_audio)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
