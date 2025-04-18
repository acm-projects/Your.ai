from flask import Flask, request, jsonify, abort
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from datetime import datetime

app = Flask(__name__)

SCOPES = ["https://www.googleapis.com/auth/calendar"]

<<<<<<< HEAD
def calendar_service():
    """Helper: Build calendar API using the user's OAuth token from the Authorization header."""
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401, description='Missing or invalid Authorization header')

    access_token = auth_header.split(" ")[1]

    # Create Credentials object from token
    creds = Credentials(token=access_token, scopes=SCOPES)

    # Build the Google Calendar service
    service = build("calendar", "v3", credentials=creds)
    return service


@app.route('/hello')
def hello():
    return "Hello from Flask!", 200
=======
# Authenticate and initialize Google Calendar API
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
service = build("calendar", "v3", credentials=credentials)
print(":white_check_mark: Google Calendar API Authenticated Successfully!")
>>>>>>> 951d1055af40c1653d2b9e2aa9aae95e96042345

# Get all events
@app.route("/events", methods=["GET"])
def get_events():
    try:
<<<<<<< HEAD
        service = calendar_service()

=======
        # Fetch events from Google Calendar
>>>>>>> 951d1055af40c1653d2b9e2aa9aae95e96042345
        events_result = service.events().list(
            calendarId="primary",
            maxResults=10,
            singleEvents=True,
            orderBy="startTime"
        ).execute()

        events = events_result.get("items", [])
        event_list = [{
            "summary": event.get("summary"),
            "start": event["start"].get("dateTime", event["start"].get("date")),
            "end": event["end"].get("dateTime", event["end"].get("date")),
        } for event in events]

        return jsonify(event_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create an event
@app.route("/events", methods=["POST"])
def create_event():
    try:
<<<<<<< HEAD
        service = calendar_service()
        data = request.json

=======
        data = request.json
        # Ensure all required fields are provided
>>>>>>> 951d1055af40c1653d2b9e2aa9aae95e96042345
        if not data.get("summary") or not data.get("start") or not data.get("end"):
            return jsonify({"error": "Missing required fields: 'summary', 'start', or 'end'."}), 400

        event = {
            "summary": data.get("summary"),
<<<<<<< HEAD
            "start": data.get("start"),
            "end": data.get("end")
=======
            "start": {"dateTime": data.get("start"), "timeZone": "UTC"},
            "end": {"dateTime": data.get("end"), "timeZone": "UTC"},
>>>>>>> 951d1055af40c1653d2b9e2aa9aae95e96042345
        }

        created_event = service.events().insert(calendarId="primary", body=event).execute()
        return jsonify(created_event), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update an event
@app.route("/events/<event_id>", methods=["PUT"])
def update_event(event_id):
    try:
<<<<<<< HEAD
        service = calendar_service()
=======
>>>>>>> 951d1055af40c1653d2b9e2aa9aae95e96042345
        data = request.json

        event = service.events().get(calendarId="primary", eventId=event_id).execute()

        event["summary"] = data.get("summary", event["summary"])
        event["start"] = data.get("start", event["start"])
        event["end"] = data.get("end", event["end"])

        updated_event = service.events().update(calendarId="primary", eventId=event_id, body=event).execute()
        return jsonify(updated_event)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete an event
@app.route("/events/<event_id>", methods=["DELETE"])
def delete_event(event_id):
    try:
<<<<<<< HEAD
        service = calendar_service()
=======
        # Delete event from Google Calendar
>>>>>>> 951d1055af40c1653d2b9e2aa9aae95e96042345
        service.events().delete(calendarId="primary", eventId=event_id).execute()
        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/current_time", methods=["GET"])
def current_time():
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return jsonify({"current_time": now})


if __name__ == "__main__":
    app.run(debug=True)
