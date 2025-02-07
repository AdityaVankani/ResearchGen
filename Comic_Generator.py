from flask import Flask, request, jsonify
import cloudinary
import cloudinary.uploader
import os
import torch
from diffusers import StableDiffusionPipeline
import textwrap
import math
from PIL import Image, ImageDraw, ImageFont
from gradio_client import Client, handle_file

# Flask app
app = Flask(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name="dfx1wn6l4",
    api_key="489759552276462",
    api_secret="j0pCgqMZR8LS0x01Wil6ypNRIgM"
)

# Load Stable Diffusion Model (Force CPU since Kaggle GPUs might not support all models)
pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2", torch_dtype=torch.float32)
pipe.to("cpu")  # Change to 'cuda' if supported

# Gradio Client for Podcast Processing
client = Client("gabrielchua/open-notebooklm")

# Function to generate AI comic image
def generate_comic_image(prompt):
    image = pipe(prompt).images[0]
    return image.resize((512, 512))

# Function to select best font available
def get_best_font(size=48):
    possible_fonts = ["ComicSansMS-Bold.ttf", "comicbd.ttf", "arialbd.ttf"]
    for font in possible_fonts:
        if os.path.exists(font):
            return ImageFont.truetype(font, size)
    return ImageFont.load_default()

# Function to add speech bubbles
def add_speech_bubble(img, text, position):
    draw = ImageDraw.Draw(img)
    font = get_best_font(size=48)
    wrapped_text = textwrap.fill(text, width=20)
    text_size = draw.textbbox((0, 0), wrapped_text, font=font)
    bubble_width = text_size[2] - text_size[0] + 40
    bubble_height = text_size[3] - text_size[1] + 40
    x, y = position
    draw.rounded_rectangle((x, y, x + bubble_width, y + bubble_height), radius=20, fill=(255, 255, 255), outline="black", width=4)
    draw.text((x + 10, y + 10), wrapped_text, font=font, fill=(0, 0, 0))
    return img

# Function to create comic from dialogues
def generate_comic_from_dialogues(dialogues):
    comic_panels = []
    for char, dialogue in dialogues:
        prompt = "Two professionals in deep discussion at a sleek, high-tech conference table. Holographic displays show AI models, real-time data, and futuristic UI. Neon lighting reflects off glass surfaces, creating a dynamic, focused atmosphere that highlights AI-driven decision-making."
        img = generate_comic_image(prompt)
        img = add_speech_bubble(img, dialogue, (20, 20))
        comic_panels.append(img)
    
    num_images = len(comic_panels)
    cols = min(math.ceil(math.sqrt(num_images)), 4)
    rows = math.ceil(num_images / cols)
    comic_grid = Image.new("RGB", (cols * 512, rows * 512), "white")
    for i, panel in enumerate(comic_panels):
        x_offset, y_offset = (i % cols) * 512, (i // cols) * 512
        comic_grid.paste(panel, (x_offset, y_offset))
    
    file_path = "comic_grid.png"
    comic_grid.save(file_path)
    return file_path

# Function to process podcast transcript
def process_podcast(file):
    try:
        result = client.predict(
            files=[handle_file(file)], url="", question="", tone="Fun", length="Medium (3-5 min)", language="English", use_advanced_audio=True, api_name="/generate_podcast"
        )
        audio_path, transcript_text = result
        dialogues = []
        for line in transcript_text.split("\n\n"):
            if "" in line:
                speaker, text = line.split(": ", 1)
                dialogues.append((speaker.replace("", "").strip(), text.strip()))
        return dialogues
    except Exception as e:
        return None

# Flask API route for comic generation
@app.route('/generate_comic', methods=['POST'])
def generate_comic():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    # Process the podcast transcript
    dialogues = process_podcast(file)
    if not dialogues:
        return jsonify({"error": "Podcast processing failed"}), 500
    
    # Generate comic from dialogues
    comic_path = generate_comic_from_dialogues(dialogues)
    
    # Upload comic to Cloudinary
    response = cloudinary.uploader.upload(comic_path, resource_type="image")
    
    return jsonify({"comic_url": response["secure_url"]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

