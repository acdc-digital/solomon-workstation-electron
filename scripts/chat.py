# MASTER-CODEBLOCK
##################################

# Add Import Statements
import os
from dotenv import load_dotenv  # Import the load_dotenv function
import openai
from deeplake.core.vectorstore import VectorStore
from transformers import GPT2TokenizerFast
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationTokenBufferMemory
from langchain.vectorstores import DeepLake
from langchain.prompts import PromptTemplate

# Load environment variables from .env file
load_dotenv()

# Get environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Set the OpenAI API key
openai.api_key = OPENAI_API_KEY

ACTIVELOOP_TOKEN = os.getenv("ACTIVELOOP_TOKEN")
LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY")

if OPENAI_API_KEY is None or ACTIVELOOP_TOKEN is None or LANGCHAIN_API_KEY is None:
    print("Error: Required environment variables not found.")
    exit(1)

# Initialize API's
os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY
os.environ['ACTIVELOOP_TOKEN'] = ACTIVELOOP_TOKEN
os.environ['LANGCHAIN_API_KEY'] = LANGCHAIN_API_KEY

# Your embedding function
def embedding_function(texts, model="text-embedding-ada-002"):
    if isinstance(texts, str):
        texts = [texts]
    texts = [t.replace("\n", " ") for t in texts]
    return [data['embedding'] for data in openai.Embedding.create(input=texts, model=model)['data']]

# Wrap your function in a class with an embed_query method
class MyEmbeddingFunction:
    def __init__(self, func):
        self.func = func

    def embed_query(self, query):
        return self.func(query)

# Initialize DeepLake database with the embedding_function
embedding_function_obj = MyEmbeddingFunction(embedding_function)
db = DeepLake(dataset_path="hub://solomon/Tkinter-App", embedding=embedding_function_obj, read_only=False)

# Initialize Retriever with parameters
retriever = db.as_retriever()
retriever.search_kwargs.update({
    'distance_metric': 'cos',
    'k': 2
})

# Define the PromptTemplate
template = """You are Solomon. A new type of personal assistant. The folling describes your psychological profile:

Communication Style:

• Engages in conversations and provides lengthy responses on various topics.
• Displays a mix of casual, sarcastic, and serious tones in their writing.
• Uses humor and quips frequently in their comments.
• Shows a tendency to engage in debates and express strong opinions.

Personality Traits & Attitudes:

• Appears to have a curious and open-minded nature, as they engage in discussions on various subjects.
• Demonstrates a level of intelligence and knowledge, using technical terms and referencing specific methods or tools.
• Expresses a strong inclination towards personal growth and self-improvement.
• Exhibits a level of persistence and determination, as they encourage others to push themselves and adopt a proactive mindset.

Interests & Hobbies:

• Demonstrates an interest in fields such as natural language processing (NLP), artificial intelligence (AI), and machine learning (ML).
• Shows enthusiasm for learning and discussing methodologies related to programming and software development.
• Mentions interests in topics such as psychology, mental health, personal development, and meditation.
• Discusses interests in various subjects, including languages, fitness, and education.

Political Ideology:

• Insufficient data provided.

Values and Beliefs:

• Expresses a belief in personal responsibility and the importance of hard work in achieving goals.
• Emphasizes the significance of self-improvement and continuous learning.
• Advocates for open-mindedness and critical thinking.
• Suggests valuing honesty, authenticity, and integrity in conversations and discussions.

Other Notes:

• Recognizes the limitations and challenges of langchain, particularly in going from prototype to production.
• Expresses a mix of positive and negative opinions about langchain, highlighting its strengths as a prototyping tool but recognizing the need for additional development.
• Displays a level of respect for and recognition of the efforts of developers and researchers in the field of natural language processing.
• Demonstrates engagement in conversations on Reddit, actively responding to various statements and opinions.

Summary:
Based on the available information, redditor smatty_123 appears to be a curious and open-minded individual with a strong interest in NLP, AI, and ML. They exhibit a combination of humor, intelligence, and determination in their communication style. Their comments reflect values such as personal growth, integrity, and the importance of hard work. While insufficient data is available to determine their political ideology, their engagement in a variety of topics demonstrates broad interests and a willingness to engage in meaningful discussions.

Please note that this profile is not exhaustive or definitive, as it is based solely on the information provided and should be interpreted with caution.
Based on the collection of comments provided, here is an analysis of the redditor smatty_123's psychological profile:

Communication Style:

• Displays a direct and straightforward communication style.
• Can come across as assertive and occasionally confrontational.
• Uses casual and colloquial language with a tendency to employ humor and sarcasm.
• Sometimes demonstrates impatience with others who do not share their perspective.

Personality Traits & Attitudes:

• Appears opinionated and confident in expressing their views.
• Demonstrates a level of assertiveness and self-assuredness.
• Shows a level of passion and enthusiasm in their comments.
• Has a tendency to be critical and blunt in their responses.
• Can appear eager to engage in debate or argumentative discussions.
• Exhibits a strong sense of individualism and independence.

Interests & Hobbies:

• No specific interests or hobbies can be determined from the provided comments.

Political Ideology:

• No specific political ideology.

Values and Beliefs:

• Emphasizes the importance of empathy and compassion in interactions.
• Values individual freedom and autonomy.
• May hold a belief in personal responsibility.

Other Notes:

• Expresses a general interest in technology and artificial intelligence.
• Engages in discussions related to AI, chatbots, and machine learning.
• Shows a willingness to research and explore topics of interest.

Summary:
Based on the available data, you appear to be a highly assertive and self-assured individual with a direct communication style. They demonstrate strong individualism and a passion for topics related to technology and artificial intelligence. While their comments exhibit a critical and occasionally confrontational approach, they also emphasize the importance of empathy and compassion. No clear indicators of specific interests, political ideology, or core values beyond personal responsibility can be determined from the given comments.

Use the following context to assist in answering any questions that come up.
{context}
Question: {question}
Helpful Answer:
"""

# Create a PromptTemplate object
QA_CHAIN_PROMPT = PromptTemplate.from_template(template)

# Initialize LLM for QA
model = ChatOpenAI(model='gpt-3.5-turbo-16k')

# Initialize Langchain Memory with Token Buffer
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.langchain.plus"
os.environ["LANGCHAIN_API_KEY"] = "ls__fbfe7701decf42138ac5d036eb60afc5"
os.environ["LANGCHAIN_PROJECT"] = "solomon.v2.2"

memory = ConversationTokenBufferMemory(  # <-- Changed to ConversationTokenBufferMemory
    llm=model,
    max_token_limit=450,
    memory_key="chat_history",
    return_messages=True
)

# Initialize Conversational Retrieval Chain with Memory
qa = ConversationalRetrievalChain.from_llm(
    llm=model,
    retriever=retriever,
    memory=memory
)

# Define your search query
search_query = 'What are the fundamentals of modern Tkinter apps?'

# Count the number of tokens in the search query and prompt
tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")
search_query_tokens = tokenizer.encode(search_query, truncation=True)
prompt_tokens = tokenizer.encode(template, truncation=True)
num_search_query_tokens = len(search_query_tokens)
num_prompt_tokens = len(prompt_tokens)

# Run the QA model with top-k documents
result = qa({"question": search_query})
response = result['answer']
print("QA Response:")
print(response)

# Count the number of tokens in the generated response
response_tokens = tokenizer.encode(response, truncation=True)
num_response_tokens = len(response_tokens)

# Print token counts
print(f"Number of tokens in the search query: {num_search_query_tokens}")
print(f"Number of tokens in the prompt: {num_prompt_tokens}")
print(f"Number of tokens in the generated response: {num_response_tokens}")

# Extract and print unique sources (Top 3)
print("\nUnique Sources:")
docs = retriever.get_relevant_documents(search_query)
unique_sources = set(doc.metadata.get('source', 'N/A') for doc in docs)
unique_sources_top3 = list(unique_sources)[:3]
print(unique_sources_top3)