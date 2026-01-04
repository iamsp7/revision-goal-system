from fastapi import FastAPI

app = FastAPI(title="Revision Goal ML Service")

@app.get("/")
def health():
    return {"status": "ML service running"}
