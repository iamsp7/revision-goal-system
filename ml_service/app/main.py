# from fastapi import FastAPI, UploadFile, File, Form
# import pdfplumber
# import requests
# import json
# import re
# from bs4 import BeautifulSoup

# app = FastAPI()

# OLLAMA_URL = "http://localhost:11434/api/generate"
# MODEL_NAME = "mistral"  # more stable for structured output


# # -----------------------------
# # Common MCQ Generator
# # -----------------------------
# def generate_mcqs_with_ollama(text):

#     text = text[:2000]  # keep safe for RAM

#     prompt = f"""
# You are a strict JSON generator.

# Generate EXACTLY 10 multiple choice questions.

# Rules:
# - 4 options per question
# - Only 1 correct answer
# - No explanations
# - No extra text
# - Output MUST be valid JSON
# - Do NOT write anything before or after JSON

# JSON FORMAT:

# {{
#   "mcqs": [
#     {{
#       "question": "Question text",
#       "options": ["Option A", "Option B", "Option C", "Option D"],
#       "answer": "Correct Option"
#     }}
#   ]
# }}

# Content:
# {text}
# """

#     try:
#         response = requests.post(
#             OLLAMA_URL,
#             json={
#                 "model": MODEL_NAME,
#                 "prompt": prompt,
#                 "stream": False,
#                 "options": {
#                     "temperature": 0.1,
#                     "num_predict": 2048
#                 }
#             },
#             timeout=180
#         )

#         raw_output = response.json().get("response", "")

#         print("\nRAW MODEL OUTPUT:\n", raw_output)

#         # Remove markdown blocks if present
#         raw_output = raw_output.replace("```json", "").replace("```", "").strip()

#         # Extract JSON block safely
#         start = raw_output.find("{")
#         end = raw_output.rfind("}") + 1

#         if start != -1 and end != -1:
#             json_str = raw_output[start:end]

#             try:
#                 parsed = json.loads(json_str)

#                 if "mcqs" in parsed and len(parsed["mcqs"]) == 10:
#                     return parsed

#             except Exception as e:
#                 print("First parse failed:", e)

#         print("Retrying once due to invalid JSON...")

#         # Retry once
#         response_retry = requests.post(
#             OLLAMA_URL,
#             json={
#                 "model": MODEL_NAME,
#                 "prompt": prompt,
#                 "stream": False,
#                 "options": {
#                     "temperature": 0.1,
#                     "num_predict": 2048
#                 }
#             },
#             timeout=180
#         )

#         retry_output = response_retry.json().get("response", "")
#         retry_output = retry_output.replace("```json", "").replace("```", "").strip()

#         parsed_retry = json.loads(retry_output)

#         if "mcqs" in parsed_retry:
#             return parsed_retry

#         return {"mcqs": []}

#     except Exception as e:
#         print("Ollama error:", e)
#         return {"mcqs": []}


# # -----------------------------
# # 1️⃣ Generate from PDF
# # -----------------------------
# @app.post("/generate-from-pdf")
# async def generate_from_pdf(file: UploadFile = File(...)):

#     text = ""
#     with pdfplumber.open(file.file) as pdf:
#         for page in pdf.pages:
#             t = page.extract_text()
#             if t:
#                 text += t + " "

#     if not text.strip():
#         return {"mcqs": []}

#     return generate_mcqs_with_ollama(text)


# # -----------------------------
# # 2️⃣ Generate from Topic
# # -----------------------------
# @app.post("/generate-from-topic")
# async def generate_from_topic(topic: str = Form(...)):

#     text = f"Create MCQs about the topic: {topic}"

#     return generate_mcqs_with_ollama(text)


# # -----------------------------
# # 3️⃣ Generate from Website Link
# # -----------------------------
# @app.post("/generate-from-link")
# async def generate_from_link(url: str = Form(...)):

#     try:
#         page = requests.get(url, timeout=10)
#         soup = BeautifulSoup(page.text, "html.parser")

#         text = " ".join([p.get_text() for p in soup.find_all("p")])

#         if not text.strip():
#             return {"mcqs": []}

#         return generate_mcqs_with_ollama(text)

#     except Exception as e:
#         print("Website extraction error:", e)
#         return {"mcqs": []}

# from fastapi import FastAPI, UploadFile, File, Form
# from pydantic import BaseModel
# from typing import List
# import pdfplumber
# import requests
# import json
# from bs4 import BeautifulSoup

# app = FastAPI()

# OLLAMA_URL = "http://localhost:11434/api/generate"
# MODEL_NAME = "mistral"


# # =====================================================
# # ---------------- MCQ GENERATION ---------------------
# # =====================================================

# def generate_mcqs_with_ollama(text):

#     text = text[:2000]

#     prompt = f"""
# You are a strict JSON generator.

# Generate EXACTLY 10 multiple choice questions.

# Rules:
# - 4 options per question
# - Only 1 correct answer
# - No explanations
# - No extra text
# - Output MUST be valid JSON
# - Do NOT write anything before or after JSON

# JSON FORMAT:

# {{
#   "mcqs": [
#     {{
#       "question": "Question text",
#       "options": ["Option A", "Option B", "Option C", "Option D"],
#       "answer": "Correct Option"
#     }}
#   ]
# }}

# Content:
# {text}
# """

#     try:
#         response = requests.post(
#             OLLAMA_URL,
#             json={
#                 "model": MODEL_NAME,
#                 "prompt": prompt,
#                 "stream": False,
#                 "options": {
#                     "temperature": 0.1,
#                     "num_predict": 2048
#                 }
#             },
#             timeout=180
#         )

#         raw_output = response.json().get("response", "")

#         raw_output = raw_output.replace("```json", "").replace("```", "").strip()

#         start = raw_output.find("{")
#         end = raw_output.rfind("}") + 1

#         if start != -1 and end != -1:
#             json_str = raw_output[start:end]
#             parsed = json.loads(json_str)

#             if "mcqs" in parsed and len(parsed["mcqs"]) == 10:
#                 return parsed

#         return {"mcqs": []}

#     except Exception as e:
#         print("Ollama MCQ error:", e)
#         return {"mcqs": []}


# @app.post("/generate-from-pdf")
# async def generate_from_pdf(file: UploadFile = File(...)):

#     text = ""
#     with pdfplumber.open(file.file) as pdf:
#         for page in pdf.pages:
#             t = page.extract_text()
#             if t:
#                 text += t + " "

#     if not text.strip():
#         return {"mcqs": []}

#     return generate_mcqs_with_ollama(text)


# @app.post("/generate-from-topic")
# async def generate_from_topic(topic: str = Form(...)):

#     text = f"Create MCQs about the topic: {topic}"
#     return generate_mcqs_with_ollama(text)


# @app.post("/generate-from-link")
# async def generate_from_link(url: str = Form(...)):

#     try:
#         page = requests.get(url, timeout=10)
#         soup = BeautifulSoup(page.text, "html.parser")
#         text = " ".join([p.get_text() for p in soup.find_all("p")])

#         if not text.strip():
#             return {"mcqs": []}

#         return generate_mcqs_with_ollama(text)

#     except Exception as e:
#         print("Website extraction error:", e)
#         return {"mcqs": []}


# # =====================================================
# # --------- PERSONALIZED REVISION PLAN ENGINE --------
# # =====================================================

# class TopicStat(BaseModel):
#     topic: str
#     totalAttempts: int
#     correct: int


# class PerformanceInput(BaseModel):
#     userId: int
#     topicStats: List[TopicStat]


# @app.post("/generate-revision-plan")
# def generate_revision_plan(data: PerformanceInput):

#     weak = []
#     moderate = []
#     strong = []

#     # 🔍 Analyze performance
#     for topic in data.topicStats:
#         if topic.totalAttempts == 0:
#             continue

#         accuracy = (topic.correct / topic.totalAttempts) * 100

#         if accuracy < 60:
#             weak.append((topic.topic, round(accuracy, 1)))
#         elif accuracy < 80:
#             moderate.append((topic.topic, round(accuracy, 1)))
#         else:
#             strong.append((topic.topic, round(accuracy, 1)))

#     structured_analysis = {
#         "weakTopics": weak,
#         "moderateTopics": moderate,
#         "strongTopics": strong
#     }

#     # 🤖 AI Generated Revision Strategy
#     prompt = f"""
# You are an AI learning strategist.

# Student Performance Analysis:

# Weak Topics:
# {weak}

# Moderate Topics:
# {moderate}

# Strong Topics:
# {strong}

# Generate a structured 5-day personalized revision plan.
# Keep it practical.
# Do not use markdown.
# No extra commentary.
# """

#     try:
#         response = requests.post(
#             OLLAMA_URL,
#             json={
#                 "model": MODEL_NAME,
#                 "prompt": prompt,
#                 "stream": False,
#                 "options": {
#                     "temperature": 0.3
#                 }
#             },
#             timeout=120
#         )

#         ai_plan = response.json().get("response", "").strip()

#     except Exception as e:
#         print("AI revision error:", e)
#         ai_plan = "AI plan generation failed."

#     return {
#         "analysis": structured_analysis,
#         "aiRevisionPlan": ai_plan
#     }

from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
import pdfplumber
import requests
import json
from bs4 import BeautifulSoup

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"


# =====================================================
# ---------------- MCQ GENERATION ---------------------
# =====================================================

def generate_mcqs_with_ollama(text: str):

    text = text[:2000]

    prompt = f"""
You are a strict JSON generator.

Generate EXACTLY 10 multiple choice questions.

Rules:
- 4 options per question
- Only 1 correct answer
- No explanations
- No extra text
- Output MUST be valid JSON
- Do NOT write anything before or after JSON

JSON FORMAT:

{{
  "mcqs": [
    {{
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option"
    }}
  ]
}}

Content:
{text}
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.1,
                    "num_predict": 2048
                }
            },
            timeout=180
        )

        raw_output = response.json().get("response", "")
        raw_output = raw_output.replace("```json", "").replace("```", "").strip()

        start = raw_output.find("{")
        end = raw_output.rfind("}") + 1

        if start != -1 and end != -1:
            json_str = raw_output[start:end]
            parsed = json.loads(json_str)

            if "mcqs" in parsed and len(parsed["mcqs"]) == 10:
                return parsed

        return {"mcqs": []}

    except Exception as e:
        print("Ollama MCQ error:", e)
        return {"mcqs": []}


@app.post("/generate-from-pdf")
async def generate_from_pdf(file: UploadFile = File(...)):

    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + " "

    if not text.strip():
        return {"mcqs": []}

    return generate_mcqs_with_ollama(text)


@app.post("/generate-from-topic")
async def generate_from_topic(topic: str = Form(...)):
    text = f"Create MCQs about the topic: {topic}"
    return generate_mcqs_with_ollama(text)


@app.post("/generate-from-link")
async def generate_from_link(url: str = Form(...)):

    try:
        page = requests.get(url, timeout=10)
        soup = BeautifulSoup(page.text, "html.parser")
        text = " ".join([p.get_text() for p in soup.find_all("p")])

        if not text.strip():
            return {"mcqs": []}

        return generate_mcqs_with_ollama(text)

    except Exception as e:
        print("Website extraction error:", e)
        return {"mcqs": []}


# =====================================================
# --------- PERSONALIZED REVISION PLAN ENGINE --------
# =====================================================

class TopicStat(BaseModel):
    topic: str
    totalAttempts: int
    correct: int


class PerformanceInput(BaseModel):
    userId: int
    topicStats: List[TopicStat]


@app.post("/generate-revision-plan")
def generate_revision_plan(data: PerformanceInput):

    weak = []
    moderate = []
    strong = []

    for topic in data.topicStats:
        if topic.totalAttempts == 0:
            continue

        accuracy = (topic.correct / topic.totalAttempts) * 100

        if accuracy < 60:
            weak.append((topic.topic, round(accuracy, 1)))
        elif accuracy < 80:
            moderate.append((topic.topic, round(accuracy, 1)))
        else:
            strong.append((topic.topic, round(accuracy, 1)))

    structured_analysis = {
        "weakTopics": weak,
        "moderateTopics": moderate,
        "strongTopics": strong
    }

    prompt = f"""
You are an AI learning strategist.

Student Performance Analysis:

Weak Topics:
{weak}

Moderate Topics:
{moderate}

Strong Topics:
{strong}

Generate a structured 5-day personalized revision plan.
Keep it practical.
No markdown.
No extra commentary.
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3}
            },
            timeout=120
        )

        ai_plan = response.json().get("response", "").strip()

    except Exception as e:
        print("AI revision error:", e)
        ai_plan = "AI plan generation failed."

    return {
        "analysis": structured_analysis,
        "aiRevisionPlan": ai_plan
    }


# =====================================================
# --------------- SPACED REPETITION ENGINE -----------
# =====================================================

class SpacedRepetitionInput(BaseModel):
    accuracy: float
    repetitions: int
    easeFactor: float
    intervalDays: int


@app.post("/update-spaced-repetition")
def update_spaced_repetition(data: SpacedRepetitionInput):

    repetitions = data.repetitions
    ease_factor = data.easeFactor
    interval = data.intervalDays
    accuracy = data.accuracy

    # 🔥 Simplified SM-2 algorithm
    if accuracy < 60:
        repetitions = 0
        interval = 1
        ease_factor = 2.5
    else:
        repetitions += 1
        ease_factor = max(1.3, ease_factor + (accuracy - 70) / 100)

        if repetitions == 1:
            interval = 1
        elif repetitions == 2:
            interval = 3
        else:
            interval = int(interval * ease_factor)

    next_review = datetime.now() + timedelta(days=interval)

    return {
        "repetitions": repetitions,
        "easeFactor": round(ease_factor, 2),
        "intervalDays": interval,
        "nextReview": next_review.isoformat()
    }