from fastapi import FastAPI, UploadFile, File, Form
import pdfplumber
import requests
import json
import re
from bs4 import BeautifulSoup

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"  # more stable for structured output


# -----------------------------
# Common MCQ Generator
# -----------------------------
def generate_mcqs_with_ollama(text):

    text = text[:2000]  # keep safe for RAM

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

        print("\nRAW MODEL OUTPUT:\n", raw_output)

        # Remove markdown blocks if present
        raw_output = raw_output.replace("```json", "").replace("```", "").strip()

        # Extract JSON block safely
        start = raw_output.find("{")
        end = raw_output.rfind("}") + 1

        if start != -1 and end != -1:
            json_str = raw_output[start:end]

            try:
                parsed = json.loads(json_str)

                if "mcqs" in parsed and len(parsed["mcqs"]) == 10:
                    return parsed

            except Exception as e:
                print("First parse failed:", e)

        print("Retrying once due to invalid JSON...")

        # Retry once
        response_retry = requests.post(
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

        retry_output = response_retry.json().get("response", "")
        retry_output = retry_output.replace("```json", "").replace("```", "").strip()

        parsed_retry = json.loads(retry_output)

        if "mcqs" in parsed_retry:
            return parsed_retry

        return {"mcqs": []}

    except Exception as e:
        print("Ollama error:", e)
        return {"mcqs": []}


# -----------------------------
# 1️⃣ Generate from PDF
# -----------------------------
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


# -----------------------------
# 2️⃣ Generate from Topic
# -----------------------------
@app.post("/generate-from-topic")
async def generate_from_topic(topic: str = Form(...)):

    text = f"Create MCQs about the topic: {topic}"

    return generate_mcqs_with_ollama(text)


# -----------------------------
# 3️⃣ Generate from Website Link
# -----------------------------
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