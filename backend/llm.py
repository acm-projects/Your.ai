import os
import json
from pinecone import Pinecone
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from dotenv import load_dotenv
import re

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

# llm = ChatOpenAI(
#    openai_api_key=os.getenv("OPENAI_API_KEY"),
#    model="gpt-4-turbo"
# )
embedder = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

# Query Pinecone for relevant information
def query_pinecone(query):
    query_embedding = embedder.embed_query(query)
    results = index.query(vector=query_embedding, top_k=5, include_metadata=True)
    
    retrieved_texts = [match["metadata"]["content"] for match in results["matches"]]
    return "\n\n".join(retrieved_texts)

def format_response(response):
    import json

    response_text = response.get('text', '') if hasattr(response, 'get') else str(response)

    # Clean escape sequences
    response_text = response_text.replace("\\n", "").replace("\\", "")

    # Extract the first complete JSON object
    def extract_first_json(text):
        brace_count = 0
        start = None
        for i, char in enumerate(text):
            if char == '{':
                if start is None:
                    start = i
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0 and start is not None:
                    return text[start:i+1]
        return None

    json_text = extract_first_json(response_text)
    if not json_text:
        print("No JSON found.")
        return

    try:
        parsed_map = json.loads(json_text)
    except json.JSONDecodeError as e:
        print("Failed to parse outer JSON:", e)
        return

    # Optional nested check
    if isinstance(parsed_map.get("data"), str):
        try:
            parsed_map["data"] = json.loads(parsed_map["data"])
        except json.JSONDecodeError as e:
            print("Failed to parse nested 'data':", e)

    print(json.dumps(parsed_map, indent=4))
    return parsed_map


# Ask questions using data from Pinecone
def ask_questions(llm, questions):
    # Define the context for the LLM
    context = (
        "You are an AI assistant designed to help people manage their day-to-day lives "
        "by keeping track of events in their calendar as well as modifying their calendar "
        "when asked. Your goal is to optimize the user's calendar and ensure it runs as efficiently "
        "as possible. You are tasked with answering questions regarding events and calendar management.\n\n"
        "For each request, please provide the following information in your response:\n"
        "1. **formatted API request**: Only return a JSON object with keys: `methods`, `URL`, and `params`.\n"
        "Do not include any extra comments or explanations. Just provide the raw output as per the format below:\n"
        "REQUEST: <write the JSON object with keys method, URL, and params here>\n"
        "\n\n"
    )


    for question in questions:
        relevant_data = query_pinecone(question)
        prompt = f"{context}\n\n{relevant_data}\n\nQuestion: {question}"
        response = llm.invoke(prompt)
        
        # Format the response before printing
        #formatted_response = format_response(response)
        
        # Print the formatted JSON response (this can be used in Flask API request)
        print(f"\nQuestion: {question}\n")
        formatted_response = format_response(response)
        #print(formatted_response)

# Sample questions
questions = [
    "What day of the week am I most free?",
    "I want to add an event called 'grocery shopping' to my calendar from 2 - 3 PM this friday.",
    "I need to reschedule grocery shopping to 4 - 5 PM this friday.",
    "Delete grocery shopping from my calendar for this friday.",
    "What do I have going on this week? Give me a weekly overview of my events.",
    "What events do I have going on this friday?",
    "Remind me that I am going grocery shopping this friday 30 minutes before the event.",
    "What events have I been invited to this week?",
    "How many events do I have going on today?",
    "How much free time do I have in between grocery shopping and dinner this friday?",
    "Do I have any doctor's appointments this week?",
    "Change the location for grocery shopping this friday."
]

ask_questions(llm, questions)
