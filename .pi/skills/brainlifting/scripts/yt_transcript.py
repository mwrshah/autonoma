#!/usr/bin/env python3
"""Fetch YouTube transcript and metadata. Outputs JSON to stdout."""

import json
import re
import sys
from urllib.parse import parse_qs, urlparse


def extract_video_id(url: str) -> str:
    parsed = urlparse(url)
    if parsed.netloc in ("youtube.com", "www.youtube.com"):
        return parse_qs(parsed.query).get("v", [""])[0]
    elif parsed.netloc in ("youtu.be", "www.youtu.be"):
        return parsed.path.lstrip("/").split("?")[0]
    return ""


def fetch_transcript(url: str) -> dict:
    from youtube_transcript_api import YouTubeTranscriptApi

    video_id = extract_video_id(url)
    if not video_id:
        return {"error": f"Could not extract video ID from: {url}"}

    ytt_api = YouTubeTranscriptApi()
    transcript_list = ytt_api.list(video_id)

    try:
        transcript = transcript_list.find_manually_created_transcript(["en"]).fetch()
    except Exception:
        transcript = transcript_list.find_generated_transcript(["en"]).fetch()

    raw_text = " ".join([entry.text for entry in transcript])
    # Add paragraph breaks at sentence boundaries
    text = re.sub(r"([.!?])\s+([A-Z])", r"\1\n\n\2", raw_text)
    text = re.sub(r"\s+(\[[^\]]+\])", r"\n\n\1", text)
    text = re.sub(r"(\[[^\]]+\])\s+", r"\1\n\n", text)

    return {
        "video_id": video_id,
        "url": url,
        "transcript": text,
        "char_count": len(text),
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: yt_transcript.py <youtube-url>"}))
        sys.exit(1)

    try:
        result = fetch_transcript(sys.argv[1])
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
