from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, VideoUnavailable

def fetch_transcript(video_id, languages=['en']):
    try:
        # Try to fetch the transcript in the specified languages
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)
        return transcript
    except TranscriptsDisabled:
        print(f"Transcript for video {video_id} is disabled.")
    except VideoUnavailable:
        print(f"Video {video_id} is unavailable.")
    except Exception as e:
        print(f"An error occurred: {e}")

def write_transcript_to_file(transcript, file_path='transcription_translated_to_english.txt'):
    # Open the file in write mode to save only the text portion of the transcript
    with open(file_path, 'w', encoding='utf-8') as file:
        # Ensure transcript is a list and handle each entry
        if isinstance(transcript, list):
            for entry in transcript:
                text = entry['text']  # The text of the transcript
                file.write(f"{text}\n")  # Write only the text to the file
                print(text)  # Optionally print the text to the console as well
        else:
            print("No transcript available.")

if __name__ == '__main__':
    video_id = 'bTntBwXpQbw'  # YouTube video ID
    print(f"Fetching transcript for video ID: {video_id}")
    
    # Fetch the transcript (try English, fall back to Malayalam if needed)
    transcript = fetch_transcript(video_id, languages=['en-US'])
    
    if transcript:
        write_transcript_to_file(transcript)
    else:
        print(f"Could not retrieve a transcript for video {video_id}.")
