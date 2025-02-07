from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="sk_ebb682d654e1b5485528af9a0418c0b432bf86793809336e")

audio_stream = client.text_to_speech.convert_as_stream(
    text="This is an introduction to our research on AI.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2"
)

# Save the streamed audio as an MP3 file
with open("output.mp3", "wb") as f:
    for chunk in audio_stream:
        if isinstance(chunk, bytes):
            f.write(chunk)

print("Audio saved as output.mp3")
