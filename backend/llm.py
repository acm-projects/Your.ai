import os
import json
from pinecone import Pinecone
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from dotenv import load_dotenv
import re
import requests

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
    #import json

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


def call_calendar_api(request_json, token):
    method = request_json.get("methods")
    url = request_json.get("URL")
    params = request_json.get("params")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.request(method, url, headers=headers, params=params)
    try:
        return response.json()
    except Exception as e:
        print("Failed to parse API response:", e)
        return {}


# Ask questions using data from Pinecone
def ask_questions(llm, question, token=None):
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

    relevant_data = query_pinecone(question)
    prompt = f"{context}\n\n{relevant_data}\n\nQuestion: {question}"
    response = llm.invoke(prompt)

    print(f"\nQuestion: {question}\n")
    api_request_json = format_response(response)

    api_response_data = call_calendar_api(api_request_json, token)

#    for question in questions:
#        relevant_data = query_pinecone(question)
#        prompt = f"{context}\n\n{relevant_data}\n\nQuestion: {question}"
#        response = llm.invoke(prompt)
        
        # Print the formatted JSON response
#        print(f"\nQuestion: {question}\n")
#        formatted_response = format_response(response)

        

    # Prompt the LLM to interpret the dummy response using the original question
    interpret_prompt = (
        "You have received the following JSON data from the Google Calendar API "
        "in response to the request you just generated. Based on this data and the user's original question, "
        "provide a clear and helpful natural language response.\n\n"
        f"User's Question: {question}\n\n"
        f"API Response JSON: {json.dumps(api_response_data, indent=4)}"
    )

    final_response = llm.invoke(interpret_prompt)
 #   print("\nLLM's Interpretation of Calendar Data:\n")
    print(final_response.content if hasattr(final_response, 'content') else final_response)


# Sample questions
# questions = [
#     "What day of the week am I most free?",
# ]

# ask_questions(llm, questions)

def wrapper(arg2, token):
    # For now, just log the token to confirm it was passed correctly
    # print(f"Received token: {token}")
    ask_questions(llm, arg2, token)

# ----------------- WEEKLY NEWSLETTER ------------------------------

def get_weather_data(location="Dallas,TX"):
    API_KEY = os.getenv("WEATHER_API_KEY")
    url = f"https://api.tomorrow.io/v4/weather/forecast?location={location}&apikey={API_KEY}&timesteps=1d"


    response = requests.get(url)
    try:
        return response.json()
    except Exception as e:
        print("Failed to parse weather response:", e)
        return {}