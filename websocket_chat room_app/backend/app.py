from flask import Flask, send_from_directory
from flask_socketio import SocketIO, send
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    send(msg, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
