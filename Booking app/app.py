from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)

UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def load_rooms():
    try:
        with open('rooms.json') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_reservations():
    try:
        with open('reservations.json') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_rooms(rooms):
    with open('rooms.json', 'w') as f:
        json.dump(rooms, f)

def save_reservations(reservations):
    with open('reservations.json', 'w') as f:
        json.dump(reservations, f)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_availability(room, check_in_date, check_out_date):
    reservations = load_reservations()
    for reservation in reservations:
        if reservation['room_type'] == room['type']:
            if not (check_out_date <= reservation['check_in_date'] or check_in_date >= reservation['check_out_date']):
                return False
    return True

@app.route('/')
def index():
    rooms = load_rooms()
    return render_template('index.html', rooms=rooms)

@app.route('/dashboard')
def dashboard():
    rooms = load_rooms()
    return render_template('dashboard.html', rooms=rooms)

@app.route('/dashboard/add-room', methods=['GET', 'POST'])
def add_room():
    if request.method == 'POST':
        try:
            room_type = request.form['room_type']
            price = float(request.form['price'])
            adults = int(request.form['adults'])
            children = int(request.form['children'])
            description = request.form['description']
            
            # Handle file upload
            image = request.files['image']
            if image and allowed_file(image.filename):
                filename = secure_filename(image.filename)
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                image.save(image_path)
            else:
                return "Invalid image file", 400
        except KeyError as e:
            return f"Missing form field: {e}", 400
        except ValueError as e:
            return f"Invalid value: {e}", 400
        
        # Load existing rooms
        rooms = load_rooms()
        
        # Create new room entry
        new_room = {
            "id": len(rooms) + 1,
            "type": room_type,
            "price": price,
            "capacity": {
                "adults": adults,
                "children": children
            },
            "description": description,
            "image": filename
        }
        
        # Save room to the list
        rooms.append(new_room)
        save_rooms(rooms)
        
        return redirect(url_for('dashboard'))
    
    return render_template('add_room.html')

@app.route('/dashboard/view-reservations')
def view_reservations():
    reservations = load_reservations()
    return render_template('reservations.html', reservations=reservations)

def load_reservations():
    try:
        with open('reservations.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_reservations(reservations):
    with open('reservations.json', 'w') as file:
        json.dump(reservations, file)

@app.route('/api/reserve', methods=['POST'])
def reserve():
    data = request.json
    reservations = load_reservations()
    reservations.append(data)
    save_reservations(reservations)
    return jsonify({"message": "Reservation successful"}), 200

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
