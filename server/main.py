import os
import json
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory, send_file
from werkzeug.exceptions import BadRequest, NotFound

# Get the base directory
BASE_DIR = Path(__file__).parent.parent
app = Flask(__name__, static_folder=str(BASE_DIR / "editor" / "dist"), static_url_path="")

# Configuration
DATA_DIR = Path("./data")
DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_data_path(year, day):
    """Get the file path for a given year and day."""
    year_dir = DATA_DIR / str(year)
    year_dir.mkdir(parents=True, exist_ok=True)
    return year_dir / f"{day}.json"


def load_day_data(year, day):
    """Load JSON data for a specific day."""
    filepath = get_data_path(year, day)
    if not filepath.exists():
        return None
    
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def save_day_data(year, day, data):
    """Save JSON data for a specific day."""
    filepath = get_data_path(year, day)
    try:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except IOError:
        return False


@app.route('/', methods=['GET'])
@app.route('/today', methods=['GET'])
def get_today():
    """Get today's schedule."""
    today = datetime.now()
    year = today.year
    day = today.strftime("%Y-%m-%d")
    
    data = load_day_data(year, day)
    if data is None:
        return jsonify({"error": "No data for today", "date": day}), 404
    
    return jsonify({"date": day, "data": data}), 200


@app.route('/day/<path:date>', methods=['GET'])
def get_day(date):
    """Get schedule for a specific day.
    
    Args:
        date: The day in YYYY-MM-DD format
    """
    try:
        year = int(date.split('-')[0])
    except (ValueError, IndexError):
        return jsonify({"error": "Date must be in YYYY-MM-DD format"}), 400
    
    data = load_day_data(year, date)
    if data is None:
        return jsonify({"error": f"No data found for {date}"}), 404
    
    return jsonify({"date": date, "data": data}), 200


@app.route('/day/<path:date>', methods=['POST', 'PUT'])
def edit_day(date):
    """Create or update schedule for a specific day.
    
    Args:
        date: The day in YYYY-MM-DD format
    
    Expected JSON body: The schedule data to save
    """
    try:
        year = int(date.split('-')[0])
    except (ValueError, IndexError):
        return jsonify({"error": "Date must be in YYYY-MM-DD format"}), 400
    
    try:
        data = request.get_json()
    except BadRequest:
        return jsonify({"error": "Invalid JSON in request body"}), 400
    
    if data is None:
        return jsonify({"error": "Request body must contain JSON"}), 400
    
    success = save_day_data(year, date, data)
    if not success:
        return jsonify({"error": "Failed to save data"}), 500
    
    return jsonify({"message": "Data saved successfully", "date": date, "data": data}), 201


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok"}), 200


@app.route('/editor')
@app.route('/editor/')
def editor_index():
    """Serve the React editor app."""
    return send_file(BASE_DIR / "editor" / "dist" / "index.html")


@app.route('/editor/<path:path>')
def editor_static(path):
    """Serve static files for the React editor app."""
    try:
        return send_from_directory(BASE_DIR / "editor" / "dist", path)
    except NotFound:
        # For client-side routing, serve index.html
        return send_file(BASE_DIR / "editor" / "dist" / "index.html")


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
