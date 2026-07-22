import os
import requests
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables reliably from backend directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

def get_top_3_youtube_videos(query: str):
    """Fetch top 3 YouTube video IDs & metadata using YouTube Data API."""
    api_key = os.getenv("Youtube_API_KEY")
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 3,
        "key": api_key
    }
    
    videos = []
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if "items" in data:
            for item in data["items"]:
                videos.append({
                    "video_id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "channel": item["snippet"]["channelTitle"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
                })
    except Exception as e:
        print(f"Error fetching YouTube videos: {e}")
        
    return videos

def get_video_transcripts(videos: list):
    """Retrieve text transcripts for the top 3 YouTube videos using YouTubeTranscriptApi."""
    combined_transcripts = []
    
    for i, vid in enumerate(videos, start=1):
        try:
            # Try YouTubeTranscriptApi.get_transcript
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(vid["video_id"])
                text = " ".join([item.get("text", "") for item in transcript_list])
            except Exception:
                # Fallback to instance fetch method if available
                ytt = YouTubeTranscriptApi()
                snippets = ytt.fetch(vid["video_id"])
                text = " ".join([getattr(s, 'text', str(s)) for s in snippets])
                
            combined_transcripts.append(f"--- VIDEO {i}: {vid['title']} ({vid['channel']}) ---\n{text[:4000]}")
        except Exception as e:
            combined_transcripts.append(f"--- VIDEO {i}: {vid['title']} ---\n[Transcript unavailable or disabled]")
            
    return "\n\n".join(combined_transcripts)

def generate_ai_editorial(problem_title: str, platform: str, difficulty: str):
    """
    1. Search YouTube API for top 3 solution videos.
    2. Extract transcripts for those 3 video IDs using YouTubeTranscriptApi.
    3. Send transcripts to Gemini AI to generate editorial text, code solutions, and 3 hints.
    """
    search_query = f"{platform} {problem_title} solution walkthrough tutorial"
    videos = get_top_3_youtube_videos(search_query)
    transcripts_text = get_video_transcripts(videos)
    
    gemini_key = os.getenv("GEMINI_EDITORIAL_API_KEY")
    if not gemini_key or not gemini_key.startswith("AIzaSy"):
        gemini_key = os.getenv("GEMINI_API_KEY")
        
    client = genai.Client(api_key=gemini_key)
    
    prompt = f"""
    You are an expert competitive programmer and computer science educator.
    
    Problem Title: {problem_title}
    Platform: {platform}
    Difficulty: {difficulty}
    
    Below are transcripts extracted from the top 3 YouTube solution videos for this problem:
    
    {transcripts_text}
    
    TASK:
    Based on these video transcripts and your algorithmic expertise, generate:
    1. 3 progressive hints to guide the user without revealing the full solution immediately.
    2. A comprehensive, beautifully structured solution editorial.
    
    Return a valid JSON object matching this exact schema:
    {{
      "hints": [
        "Hint 1: High-level intuition, key observation, or pattern recognition hint.",
        "Hint 2: Core algorithm selection, data structure choice, or invariant hint.",
        "Hint 3: Detailed step-by-step logic, edge case alert, or transition formula hint."
      ],
      "intuition": "Detailed intuition and breakdown of the key core idea behind solving this problem.",
      "approach": "Clear step-by-step approach explaining the solution algorithm.",
      "time_complexity": "e.g. O(N log N)",
      "time_complexity_explanation": "Why this time complexity applies.",
      "space_complexity": "e.g. O(N)",
      "space_complexity_explanation": "Why this space complexity applies.",
      "code_python": "Clean, well-commented Python 3 solution.",
      "code_cpp": "Clean, well-commented C++ solution.",
      "code_java": "Clean, well-commented Java solution.",
      "edge_cases": "Important edge cases or common pitfalls to watch out for."
    }}
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    
    editorial_data = response.text
    import json
    parsed_editorial = json.loads(editorial_data)
    
    return {
        "editorial": parsed_editorial
    }