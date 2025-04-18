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

    # print(json.dumps(parsed_map, indent=4))
    return parsed_map

from datetime import datetime, timedelta
from tzlocal import get_localzone

def get_week_range_local():
    tz = get_localzone()
    now = datetime.now(tz)

    # Calculate days until Sunday (weekday() returns 0 for Monday, 6 for Sunday)
    days_until_sunday = 6 - now.weekday()
    end_of_week = now + timedelta(days=days_until_sunday)

    return now.isoformat(), end_of_week.isoformat(), str(tz)

def call_calendar_api(request_json, token):
    method = request_json.get("methods")
    url = request_json.get("URL")
    params = request_json.get("params")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    if method.upper() in ["POST", "PATCH"]:
        response = requests.request(method, url, headers=headers, json=params)
    else:
        response = requests.request(method, url, headers=headers, params=params)

    try:
        return response.json()
    except Exception as e:
        print("Failed to parse API response:", e)
        return {}


# Ask questions using data from Pinecone
def ask_questions(llm, question, token=None):
    start_time, end_time, user_timezone = get_week_range_local()
    current_time = datetime.now(get_localzone()).isoformat()

    # Define the context for the LLM
    context = (
        "You are an AI assistant designed to help people manage their day-to-day lives "
        "by keeping track of events in their calendar as well as modifying their calendar "
        "when asked. Your goal is to optimize the user's calendar and ensure it runs as efficiently "
        "as possible. You are tasked with answering questions regarding events and calendar management.\n\n"
        "Important context:\n"
        f"- The user's current time zone is: {user_timezone}\n"
        f"- Current system time is: {current_time}\n"
        f"- This week's time range is from {start_time} to {end_time}\n\n"
        "For each request, please provide the following information in your response:\n"
        "1. **formatted API request**: Only return a JSON object with keys: `methods`, `URL`, and `params`.\n"
        "Do not include any extra comments or explanations. Just provide the raw output as per the format below:\n"
        "REQUEST: <write the JSON object with keys method, URL, and params here>\n"
        "\n\n"
    )

    relevant_data = query_pinecone(question)
    prompt = f"{context}\n\n{relevant_data}\n\nQuestion: {question}"
    response = llm.invoke(prompt)

    # print(f"\nQuestion: {question}\n")
    api_request_json = format_response(response)

    api_response_data = call_calendar_api(api_request_json, token)

#    for question in questions:
#        relevant_data = query_pinecone(question)
#        prompt = f"{context}\n\n{relevant_data}\n\nQuestion: {question}"
#        response = llm.invoke(prompt)
        
        # Print the formatted JSON response
#        print(f"\nQuestion: {question}\n")
#        formatted_response = format_response(response)

    # Prompt the LLM to interpret the response using the original question
    interpret_prompt = (
        "You have received the following JSON data from the Google Calendar API "
        "in response to the request you just generated. Based on this data and the user's original question, "
        "provide a clear and helpful natural language response.\n\n"
        f"User's Time Zone: {user_timezone}\n"
        f"Current Time: {current_time}\n"
        f"User's Question: {question}\n\n"
        f"API Response JSON: {json.dumps(api_response_data, indent=4)}"
    )

    final_response = llm.invoke(interpret_prompt)
    result = final_response.content if hasattr(final_response, 'content') else final_response

    # print(result)
    return result


# Sample questions
# questions = [
#     "What day of the week am I most free?",
# ]

# ask_questions(llm, questions)

def chat_wrapper(userPrompt, token):
    # For now, just log the token to confirm it was passed correctly
    # print(f"Received token: {token}")
    ask_questions(llm, userPrompt, token)


# ----------------- WEEKLY NEWSLETTER ------------------------------

def get_weather_data(location="Dallas"):
    API_KEY = os.getenv("WEATHER_API_KEY")
    url = f"https://api.tomorrow.io/v4/weather/forecast?location={location}&apikey={API_KEY}&timesteps=1d"


    response = requests.get(url)
    try:
        return response.json()
    except Exception as e:
        print("Failed to parse weather response:", e)
        return {}

def create_newsletter(llm, token, location="Dallas"):
    # Step 1: Generate request for this week's events using the LLM
    start_time, end_time, user_timezone = get_week_range_local()
    question = "Get all calendar events from today to the upcoming Sunday"
    relevant_data = query_pinecone(question)

    calendar_prompt = (
    "You are an assistant generating JSON requests to the Google Calendar API.\n"
    "Generate but do not output a JSON request to retrieve all calendar events from today to the upcoming Sunday, "
    "based on the user's current time zone.\n"
    "Format the request with only the keys: `methods`, `URL`, and `params`.\n"
    f"Start Time: {start_time}\nEnd Time: {end_time}\nTime Zone: {user_timezone}"
    )

    response = llm.invoke(calendar_prompt)
    api_request_json = format_response(response)

    # Add start & end time manually if not included
    if "params" in api_request_json:
        api_request_json["params"]["timeMin"] = start_time
        api_request_json["params"]["timeMax"] = end_time

    # Step 2: Fetch calendar events
    calendar_data = call_calendar_api(api_request_json, token)

    # Step 3: Fetch weather data from Tomorrow.io
    weather_data = get_weather_data(location)

    # Step 4: Ask LLM to generate a newsletter
    newsletter_prompt = (
        "Create a friendly and helpful weekly newsletter for the user. "
        "Summarize calendar events from today through Sunday, and include daily weather forecasts. "
        "Write in an engaging and warm tone with emoji and formatting where appropriate.\n\n"
        f"Calendar Events JSON:\n{json.dumps(calendar_data, indent=4)}\n\n"
        f"Weather Forecast JSON:\n{json.dumps(weather_data, indent=4)}"
    )

    final_response = llm.invoke(newsletter_prompt)
    result = final_response.content if hasattr(final_response, 'content') else final_response

    # print("\nWeekly Newsletter:\n")
    # print(result)
    return result

def wrapper_for_newsletter(llm, token):
    newsletter = create_newsletter(llm, token)
    return newsletter
# ------------------------- KANBAN BOARD -------------------------------

def generate_weekly_todos(llm, token):
    # Get current week's start and end times using timezone-aware function
    start_time, end_time, timezone = get_week_range_local()

    # Prompt to get calendar events for the week
    calendar_prompt = (
        "You are a system assistant that formats JSON requests to the Google Calendar API. "
        "Generate a JSON request to fetch all events scheduled from today to the upcoming Sunday. "
        "Use these parameters:\n"
        f"timeMin: {start_time}\n"
        f"timeMax: {end_time}\n"
        f"Time Zone: {timezone}\n"
        "Return only a JSON with 'methods', 'URL', and 'params'."
    )

    response = llm.invoke(calendar_prompt)
    request_json = format_response(response)

    # Force time bounds if needed
    if "params" in request_json:
        request_json["params"]["timeMin"] = start_time
        request_json["params"]["timeMax"] = end_time

    calendar_events = call_calendar_api(request_json, token)

    # Ask LLM to generate to-do items based on events
    todo_prompt = (
        "You are helping the user build a Kanban to-do list based on their calendar. "
        "Only use events scheduled between today and the upcoming Sunday. "
        "For each calendar event, generate a small checklist of related tasks. "
        "Format it like a JSON list with one object per event, each containing:\n"
        "- 'event': the event title\n"
        "- 'todos': a list of tasks\n\n"
        f"Here is the JSON of upcoming events:\n{json.dumps(calendar_events, indent=4)}\n\n"
        "Output:"
    )


    final_response = llm.invoke(todo_prompt)
    todos = format_response(final_response)

    # print("\nGenerated To-Do Items:\n")
    # print(json.dumps(todos, indent=4))
    return todos

def wrapper_for_kanban(token):
    todos = generate_weekly_todos(llm, token)
    return todos
