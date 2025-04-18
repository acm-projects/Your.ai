import requests
from bs4 import BeautifulSoup
import json

# List of URLs to scrape
urls = [
    "https://developers.google.com/calendar/api/v3/reference/events",
    "https://developers.google.com/calendar/api/v3/reference/events/delete",
    "https://developers.google.com/calendar/api/v3/reference/events/get",
    "https://developers.google.com/calendar/api/v3/reference/events/import",
    "https://developers.google.com/calendar/api/v3/reference/events/insert",
    "https://developers.google.com/calendar/api/v3/reference/events/instances",
    "https://developers.google.com/calendar/v3/reference/events/list",
    "https://developers.google.com/calendar/v3/reference/events/move",
    "https://developers.google.com/calendar/v3/reference/events/patch",
    "https://developers.google.com/calendar/v3/reference/events/quickAdd",
    "https://developers.google.com/calendar/v3/reference/events/update",
    "https://developers.google.com/calendar/v3/reference/events/watch",
    "https://developers.google.com/calendar/api/v3/reference/calendars",
    "https://developers.google.com/calendar/v3/reference/calendars/clear",
    "https://developers.google.com/calendar/v3/reference/calendars/delete",
    "https://developers.google.com/calendar/v3/reference/calendars/get",
    "https://developers.google.com/calendar/v3/reference/calendars/insert",
    "https://developers.google.com/calendar/v3/reference/calendars/patch",
    "https://developers.google.com/calendar/v3/reference/calendars/update"
]

# Function to scrape and save content
def scrape_page(url, index):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the article container where the main content starts
    article = soup.find('article', class_='devsite-article')

    # Extract the entire content of the article
    if article:
        content = article.get_text(separator="\n", strip=True)
    else:
        content = "No content found."

    # Create a generic filename based on the index
    filename = f'file{index}.json'

    # Save content to a JSON file with pretty formatting
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump({"url": url, "content": content}, file, ensure_ascii=False, indent=4)

# Loop through the URLs and scrape each one
for index, url in enumerate(urls, start=1):
    scrape_page(url, index)
