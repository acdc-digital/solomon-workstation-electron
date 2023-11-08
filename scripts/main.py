# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai

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
    # For testing, return a fixed response without calling OpenAI
    return {"response": "Test response without calling OpenAI"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the chatbot API!"}

