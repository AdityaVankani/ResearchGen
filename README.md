# AI Alchemists - Research Paper Content Transformation Tool

## Team Members
- Aagam Shah (Team Leader)
- Aditya Vankani
- Abhay Patel
- Het Chaudhari
- Jaimin Salvi

## Project Overview
Researchers often struggle with summarizing and extracting meaningful content from lengthy academic papers. Our solution addresses this challenge by automating the summarization process and transforming research papers into multiple content formats, such as:

- *Podcasts* (audio format for auditory learners)
- *Videos* (visual representation of the content)
- *Graphical Abstracts* (comics/infographics)
- *PowerPoint Presentations* (formal and casual styles)

This tool reduces the time and effort required for researchers and students to digest large volumes of academic content.

---

## Problem Statement
To build a tool that can generate new-age, alternative-form content from research papers, helping users comprehend academic material efficiently.

## Features
- ✅ *Text Extraction:* Extracts content from research papers section-wise.
- ✅ *Summarization:* Uses large language models (LLMs) to generate concise summaries.
- ✅ *Content Transformation:* Converts text into various alternative formats (Audio, Video, PPT, and Infographics).
- ✅ *User Customization:* Allows users to adjust language, tone, and duration of content.

## Technical Approach
1. *Extract text* from research papers.
2. *Summarize each section* using LLMs like Llama-3.3-70b-versatile.
3. *Generate visuals* using an open-source AI model.
4. *Transform content* into multiple formats:
   - 🎙 *Podcast* (Text to Speech Conversion)
   - 📽 *Video* (Automated visual creation and narration)
   - 📊 *PowerPoint Presentations* (Bullet points + Image generation)
   - 🎨 *Graphical Abstracts* (Comics/Infographics)

---

## Tech Stack
### LLMs/Models Used
- llama-3.3-70b-versatile
- black-forest-labs/FLUX.1-dev

### Audio/Video/Graphics Tools
- gtts (Google Text-to-Speech)
- moviepy
- numpy
- opencv-python
- pydub
- MeloTTS
- Bark
- OpenAI Whisper

### Libraries/APIs
- pptx
- langchain
- Gradio
- Customized NotebookLM
- Stability AI - Stable Diffusion 2
- Cloudinary

---

## Why Our Solution?
- 🚀 *Efficiency:* Automates content extraction and summarization, saving time.
- 🎛 *Flexibility:* Customizable content format, tone, and language for user preferences.
- 📚 *Versatility:* Supports multiple content formats to suit diverse learning styles.
- 🎯 *User-Centric:* Helps researchers quickly grasp key information in different media formats.

## Limitations
⚠ *Latency:* Processing multiple research papers may take time and require high computational power.
⚠ *Free Tier APIs:* The current implementation relies on free service plans, which may limit scalability.

---

## Chosen Output Formats
- *Primary:* PPT, Podcast, Video, Graphical Abstract
- *Paper Details:*
  - Supports *one paper at a time* (multiple papers possible with increased processing time).
  - Works for *any academic domain*.
  - Key approach: Extract, summarize, visualize, and repurpose content.

---

## Implementation Details
### 1️⃣ Podcast Generation
1. *Extract Text from PDF* using Jina Reader.
2. *Summarize the text* using Llama-3.3-70b-versatile and Fireworks AI.
3. *Convert Text to Speech (TTS)* using MeloTTS.
4. *Enhance Speech Quality* using Bark for natural intonations and effects.
5. *Assemble the Podcast* with background music and transitions.
6. *Export & Publish* in MP3/AAC format.

### 2️⃣ Comic Page Generation
1. *Extract dialogues* from podcast transcripts.
2. *Generate images* using Stability AI - Stable Diffusion 2.
3. *Overlay text in speech bubbles* using Pillow.
4. *Store generated images* in Cloudinary and provide a shareable link.

### 3️⃣ PowerPoint Presentation Generation
1. *Extract text chunk-wise* from the research paper.
2. *Generate section-wise summaries* using Groq and Llama-3.3-70b.
3. *Format the content* to make it more presentation-friendly.
4. *Generate relevant images* using AI models.
5. *Convert text into bullet points* for better readability.
6. **Use python-pptx** to create a PowerPoint presentation.

### 4️⃣ Video Generation
1. *Extract and summarize text* chunk-wise.
2. *Generate speech* using Llama-3.3-70b.
3. *Convert text to audio* using gtts.
4. *Transcribe speech* using OpenAI Whisper.
5. *Sync text with video* and add visual effects.

---

## How to Run the Project
### 🔹 1. Clone the repository:
bash
git clone https://github.com/AdityaVankani/ResearchGen
cd your-project-folder


### 🔹 2. Install dependencies:
bash
pip install -r requirements.txt


### 🔹 3. Run the application:
bash
python main.py


### 🔹 4. Upload a research paper and select the desired output format:
- 🎙 Podcast
- 📽 Video
- 📊 PowerPoint Presentation
- 🎨 Graphical Abstract

---

## Demo
🎥 *Live Demo Available!* 
https://drive.google.com/file/d/1fh8MN2b3GRobpSntig3xUf4xEX1BlIzH/view?usp=sharing

---

## Contact & Support
- *Team Name:* AI Alchemists
- *Team Leader:* Aagam Shah
- *Discord ID:* 07aagamshah04

For any questions or support, please feel free to reach out!

---

### 📢 Future Scope
- Enhance summarization accuracy with better fine-tuned LLMs.
- Improve processing speed with optimized backend architecture.
- Extend support for *batch processing of multiple papers*.
- Explore additional *content formats* like interactive PDFs.

🚀 *AI Alchemists - Transforming Research for the Future!*
