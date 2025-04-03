import os
import json
from pinecone import Pinecone
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

# Initialize and Connect to Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "llm-embeddings"
index = pc.Index(index_name)

# Initialize LLM and Embeddings
llm = ChatOpenAI(
    openai_api_key=os.getenv("DEEPSEEK_API_KEY"),
    openai_api_base=os.getenv("DEEPSEEK_API_BASE"),
    model="deepseek-chat"
)
embedder = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))


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
    "Explain how to use the 'insert' method for events.",
    "What is the HTTP request for patch in Calendars and what authorizations does it require?"
]

ask_questions(llm, questions)
