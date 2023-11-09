# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
client = OpenAI()

# Ideally, use environment variables for this.
openai.api_key = "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"

app = FastAPI()

# Set up CORS middleware options
origins = [
    "http://localhost:3000",  # Adjust this to your frontend's address
    "https://your-deployment-domain.com"  # If you have a deployment domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat/")
async def chat(chat_request: ChatRequest):
    try:
        completion = client.chat.completion.create(
            model="gpt-3.5-turbo",
            messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
)
        
        response_text = completion.choices[0].text.strip()
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the chatbot API!"}
