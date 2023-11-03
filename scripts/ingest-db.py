# MASTER-CODEBLOCK
##################################

# Add Import Statements
import os
import pandas as pd
from deeplake.core.vectorstore import VectorStore
from dotenv import load_dotenv  # Import the load_dotenv function

# Load environment variables from .env file
load_dotenv()

# Get ACTIVELOOP_TOKEN from environment variable
active_loop_token = os.getenv("ACTIVELOOP_TOKEN")

if active_loop_token is None:
    print("Error: ACTIVELOOP_TOKEN not found in environment variables.")
    exit(1)

os.environ['ACTIVELOOP_TOKEN'] = active_loop_token

# Load DataFrame from CSV
df = pd.read_csv('/Users/matthewsimon/Documents/GitHub/acdc.tkinterChat/tk-chatDev/source_ada/source_ada.csv')

# Prepare data
chunked_text = df['content_chunk'].tolist()
source_texts = df['filename'].tolist()
precomputed_embeddings = df['ada_similarity'].apply(eval).tolist()  # Assuming embeddings are stored as strings

# Initialize Vector Store with the Hub URL
vector_store_path = "hub://solomon/Tkinter-App-Test2"
vector_store = VectorStore(
    path=vector_store_path,
)

# Add data to Vector Store
vector_store.add(
    text=chunked_text,
    embedding=precomputed_embeddings,
    metadata=[{"source": source_text} for source_text in source_texts]
)