from fastapi import FastAPI, UploadFile, File
import pdfplumber
import random

app = FastAPI()

def generate_mcqs_from_text(text):
    sentences = text.split(".")
    mcqs = []

    for sentence in sentences[:5]:  # limit for demo
        words = sentence.split()
        if len(words) > 5:
            answer = words[-1]
            question = sentence.replace(answer, "_____")

            options = random.sample(words, min(3, len(words)))
            options.append(answer)
            random.shuffle(options)

            mcqs.append({
                "question": question.strip(),
                "options": options,
                "answer": answer
            })

    return mcqs


@app.post("/generate-mcq")
async def generate_mcq(file: UploadFile = File(...)):
    text = ""

    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + " "

    mcqs = generate_mcqs_from_text(text)

    return {"mcqs": mcqs}
