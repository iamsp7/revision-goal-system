import requests
import os

# 🔐 Use ENV variable (recommended)
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY") or "AIzaSyDLoJXfLCNxmoVD8c0G5jTqXX17Rt9epmk"


def get_youtube_resources(topic: str):
    """
    Fetch YouTube videos related to a specific topic.
    Returns clean, embeddable resources.
    """

    search_url = "https://www.googleapis.com/youtube/v3/search"

    # 🔥 Smart query for better results
    query = f"{topic} programming concept explanation examples"

    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 8,
        "videoDuration": "medium",   # avoid shorts
        "order": "relevance",
        "key": YOUTUBE_API_KEY
    }

    try:
        response = requests.get(search_url, params=params)

        # 🚨 Check for API errors
        if response.status_code != 200:
            print("YouTube API Error:", response.text)
            return []

        data = response.json()

        resources = []

        for item in data.get("items", []):
            video_id = item["id"].get("videoId")
            title = item["snippet"].get("title", "")

            # Skip invalid entries
            if not video_id:
                continue

            # 🔥 Filter unwanted videos
            if "shorts" in title.lower():
                continue

            resources.append({
                "title": title,
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "embedUrl": f"https://www.youtube.com/embed/{video_id}",
                "type": "video"
            })

        # Return top 5 clean videos
        return resources[:5]

    except Exception as e:
        print("YouTube API Exception:", str(e))
        return []


def get_article_resources(topic: str):
    """
    Return article links for the topic
    """

    topic_dash = topic.replace(" ", "-").lower()
    topic_underscore = topic.replace(" ", "_")

    return [
        {
            "title": f"GeeksforGeeks: {topic}",
            "url": f"https://www.geeksforgeeks.org/{topic_dash}/",
            "type": "article"
        },
        {
            "title": f"Wikipedia: {topic}",
            "url": f"https://en.wikipedia.org/wiki/{topic_underscore}",
            "type": "article"
        }
    ]


def get_all_resources(topic: str):
    """
    Combine videos + articles
    """

    videos = get_youtube_resources(topic)
    articles = get_article_resources(topic)

    return videos + articles