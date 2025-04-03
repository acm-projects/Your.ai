import os
import json
from pinecone import Pinecone
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone using the new API (Pinecone v3+)
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index_name = "rag-index"

# Connect to the existing index
index = pc.Index(index_name)

# Initialize LLM and Embeddings
llm = ChatOpenAI(
    openai_api_key=os.getenv("DEEPSEEK_API_KEY"),
    openai_api_base=os.getenv("DEEPSEEK_API_BASE"),
    model="deepseek-chat"
)
embedder = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

# Define the folder path where the JSON files are stored
json_folder_path = r"C:\Users\suhan\YourAI\RAG\Calendar Web Scrape JSON"

# Load and process JSON files, then store them in Pinecone
def store_json_in_pinecone(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "r", encoding="utf-8") as file:
                content = json.load(file)

            text_content = json.dumps(content, indent=2)  # Convert JSON to text
            embedding = embedder.embed_query(text_content)  # Convert text to embedding

            # Store in Pinecone
            index.upsert(vectors=[(filename, embedding, {"content": text_content})])

# Store JSON data in Pinecone
store_json_in_pinecone(json_folder_path)

# Query Pinecone for relevant information
def query_pinecone(query):
    query_embedding = embedder.embed_query(query)
    results = index.query(vector=query_embedding, top_k=5, include_metadata=True)
    
    retrieved_texts = [match["metadata"]["content"] for match in results["matches"]]
    return "\n\n".join(retrieved_texts)

# Ask questions using data from Pinecone
def ask_questions(llm, questions):
    for question in questions:
        relevant_data = query_pinecone(question)
        prompt = f"{relevant_data}\n\nQuestion: {question}"
        response = llm.invoke(prompt)
        print(f"Question: {question}")
        print(f"Response: {response}\n")

# Sample questions
questions = [
    "What is the purpose of the 'events' endpoint?",
    "Explain how to use the 'insert' method for events."
]

ask_questions(llm, questions)
