from gtts import gTTS
from pydub import AudioSegment
import pygame
import time

# 🎤 Text with natural pauses for better flow
text = "Hello... this is a background speech example. Let's make it more expressive! \
        Sometimes, we pause... to think. And sometimes, we speak faster... for excitement!"

# 🗣️ Generate speech using gTTS
tts = gTTS(text)
tts.save("original.mp3")

# 🎵 Load generated speech
audio = AudioSegment.from_file("original.mp3")

# 🎚️ Apply pitch variation
low_pitch = audio.speedup(playback_speed=0.9)   # Slightly slower, deep voice
high_pitch = audio.speedup(playback_speed=1.2)  # Slightly faster, excited voice

# 🎼 Mix audio with pitch effects: Start slow, then go high
final_audio = low_pitch[:2000] + high_pitch[2000:]  

# 🎧 Save the modified expressive speech
final_audio.export("expressive_speech.mp3", format="mp3")

# 🎶 Initialize pygame mixer and play the audio
pygame.mixer.init()
pygame.mixer.music.load("expressive_speech.mp3")
pygame.mixer.music.play()

# ⏳ Wait until the audio finishes playing
while pygame.mixer.music.get_busy():
    time.sleep(1)

print("✅ Expressive Audio Played Successfully!")
