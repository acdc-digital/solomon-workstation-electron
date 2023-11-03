# MASTER-CODEBLOCK (short-form working module)
##################################

# Add Import Statements
import os
import pandas as pd
import nltk
import openai
from dotenv import load_dotenv
from transformers import GPT2TokenizerFast

# Load environment variables from .env file
load_dotenv()

# Download necessary NLTK data
nltk.download('stopwords')
from nltk.corpus import stopwords

# Stop words from NLTK
def remove_stopwords(text):
    stop_words = set(stopwords.words('english'))
    words = text.split()
    cleaned_text = " ".join([word for word in words if word.lower() not in stop_words])
    return cleaned_text

# Your existing setup (msimon@acdc.digital)
openai_api_key = os.getenv("OPENAI_API_KEY")
print(f"API Key from env: {openai_api_key}")

# Set the OpenAI API key
openai.api_key = openai_api_key

input_datapath = '/Users/matthewsimon/Documents/GitHub/acdc.tkinterChat/tk-chatDev/source_csv/source_docs.csv'
df_check = pd.read_csv(input_datapath)
df = pd.read_csv(input_datapath)

# Check if DataFrame is empty
if df.empty:
    print("The DataFrame is empty. Please check your data source.")
else:
    # Your existing setup
    df = df[['filename', 'title_or_heading', 'content_summary', 'content_chunk', 'file_size']]

    # Remove stop words from 'content_chunk'
    df['cleaned_content_chunk'] = df['content_chunk'].apply(remove_stopwords)

    # Initialize the tokenizer
    tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")

    # Function to return token IDs and decoded tokens
    def get_tokens_and_decoded(text):
        token_ids = tokenizer.encode(text, truncation=True, max_length=4095)
        decoded_tokens = [tokenizer.decode([token_id]) for token_id in token_ids]
        return token_ids, decoded_tokens

    # Add new columns for token counts, token IDs, and decoded tokens
    df['n_tokens'], df['tokens'] = zip(*df['cleaned_content_chunk'].apply(lambda x: (len(get_tokens_and_decoded(x)[0]), get_tokens_and_decoded(x)[0])))
    df['decoded_tokens'] = df['cleaned_content_chunk'].apply(lambda x: get_tokens_and_decoded(x)[1])

    # Filter rows based on token count
    df = df[df.n_tokens < 5000]

# Your embedding function
def embedding_function(texts, model="text-embedding-ada-002"):
    if isinstance(texts, str):
        texts = [texts]
    texts = [t.replace("\n", " ") for t in texts]
    return [data['embedding'] for data in openai.Embedding.create(input=texts, model=model)['data']]

# Generate embeddings
df['ada_similarity'] = df['cleaned_content_chunk'].apply(lambda x: embedding_function(x, model='text-embedding-ada-002'))

# Save the DataFrame to a new CSV file
df.to_csv('/Users/matthewsimon/Documents/GitHub/acdc.tkinterChat/tk-chatDev/source_ada/source_ada.csv', index=False)

# Read the new CSV file to verify
df_new = pd.read_csv('/Users/matthewsimon/Documents/GitHub/acdc.tkinterChat/tk-chatDev/source_ada/source_ada.csv')
print(df_new.columns)