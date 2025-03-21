import os
from langchain_community.chat_models import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

# Set up the DeepSeek LLM (using OpenAI compatibility)
llm = ChatOpenAI(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    openai_api_base=os.getenv("OPENAI_API_BASE"),
    model="deepseek-chat"  # Specify the DeepSeek model
)

# Test response
response = llm.invoke("Explain order of operations in simple terms.")
print(response)