from fastapi import FastAPI, UploadFile, File
import pdfplumber
import random
import re
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

nlp = spacy.load("en_core_web_sm")


def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9., ]', '', text)
    return text


def extract_keywords(text, top_n=50):
    doc = nlp(text)

    nouns = [token.text for token in doc 
             if token.pos_ in ["NOUN", "PROPN"] and len(token.text) > 3]

    # TF-IDF for importance
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()

    scores = X.toarray()[0]
    word_score = dict(zip(feature_names, scores))

    ranked = sorted(
        [w.lower() for w in nouns if w.lower() in word_score],
        key=lambda x: word_score[x],
        reverse=True
    )

    return list(set(ranked[:top_n]))


def generate_mcqs(text, num_questions=15):
    sentences = re.split(r'[.!?]', text)
    sentences = [s.strip() for s in sentences if len(s.split()) > 8]

    keywords = extract_keywords(text)

    mcqs = []

    for sentence in sentences:
        for keyword in keywords:
            if keyword in sentence.lower():
                question = sentence.replace(keyword, "_____")

                distractors = random.sample(
                    [k for k in keywords if k != keyword],
                    min(3, len(keywords)-1)
                )

                options = distractors + [keyword]
                random.shuffle(options)

                mcqs.append({
                    "question": question.strip(),
                    "options": options,
                    "answer": keyword
                })

                break

        if len(mcqs) >= num_questions:
            break

    return mcqs


@app.post("/generate-mcq")
async def generate_mcq(file: UploadFile = File(...)):
    text = ""

    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    text = clean_text(text)

    if not text.strip():
        return {"mcqs": []}

    mcqs = generate_mcqs(text)

    return {"mcqs": mcqs}