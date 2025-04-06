from flask import Flask, request, jsonify
from googleapiclient.discovery import build
from google.oauth2 import service_account
from datetime import datetime

app = Flask(__name__)

# Path to your service account JSON file
SERVICE_ACCOUNT_FILE = "yourai-452203-92e5dc3d05ad.json"
SCOPES = ["https://www.googleapis.com/auth/calendar"]

def initialize_calendar_service():
    """Initialize and return the Google Calendar service."""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("calendar", "v3", credentials=credentials)
    print(":white_check_mark: Google Calendar API Authenticated Successfully!")
    return service

# Get all events
@app.route("/events", methods=["GET"])
def get_events():
    try:
        service = initialize_calendar_service()
        # Fetch events from Google Calendar
        events_result = service.events().list(
            calendarId="primary", 
            maxResults=10, 
            singleEvents=True, 
            orderBy="startTime"
        ).execute()
        
        # Parse and format the events
        events = events_result.get("items", [])
        event_list = []
        for event in events:
            event_list.append({
                "summary": event.get("summary"),
                "start": event["start"].get("dateTime", event["start"].get("date")),
                "end": event["end"].get("dateTime", event["end"].get("date")),
            })
        return jsonify(event_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create an event
@app.route("/events", methods=["POST"])
def create_event():
    try:
        service = initialize_calendar_service()
        data = request.json
        # Ensure all required fields are provided
        if not data.get("summary") or not data.get("start") or not data.get("end"):
            return jsonify({"error": "Missing required fields: 'summary', 'start', or 'end'."}), 400
        
        # Create event object
        event = {
            "summary": data.get("summary"),
            "start": {"dateTime": data.get("start"), "timeZone": "UTC"},
            "end": {"dateTime": data.get("end"), "timeZone": "UTC"},
        }
        
        # Insert event into calendar
        created_event = service.events().insert(calendarId="primary", body=event).execute()
        return jsonify(created_event), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update an event
@app.route("/events/<event_id>", methods=["PUT"])
def update_event(event_id):
    try:
        service = initialize_calendar_service()
        data = request.json
        
        # Get the existing event details
        event = service.events().get(calendarId="primary", eventId=event_id).execute()
        
        # Update fields with provided data, defaulting to existing values if missing
        event["summary"] = data.get("summary", event["summary"])
        event["start"] = {"dateTime": data.get("start", event["start"]["dateTime"]), "timeZone": "UTC"}
        event["end"] = {"dateTime": data.get("end", event["end"]["dateTime"]), "timeZone": "UTC"}
        
        # Update event in calendar
        updated_event = service.events().update(calendarId="primary", eventId=event_id, body=event).execute()
        return jsonify(updated_event)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete an event
@app.route("/events/<event_id>", methods=["DELETE"])
def delete_event(event_id):
    try:
        service = initialize_calendar_service()
        # Delete event from Google Calendar
        service.events().delete(calendarId="primary", eventId=event_id).execute()
        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to get current time (for testing purposes)
@app.route("/current_time", methods=["GET"])
def current_time():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return jsonify({"current_time": current_time})

if __name__ == "__main__":
    app.run(debug=True)
    