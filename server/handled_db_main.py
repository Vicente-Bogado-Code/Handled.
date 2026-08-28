from flask import Flask, jsonify, request, session
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

from routes.auth_routes import auth_bp
from routes.notes_routes import notes_bp
from routes.projects_routes import projects_bp
from routes.integrations import integrations_bp


handled_server = Flask(__name__)

handled_server.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="None"
)

CORS(handled_server,supports_credentials=True,origins=[
    "http://localhost:5174", "https://handled-kappa.vercel.app"
    ])
handled_server.secret_key = os.environ.get("SECRET_KEY")

handled_server.register_blueprint(auth_bp)
handled_server.register_blueprint(projects_bp)
handled_server.register_blueprint(notes_bp)
handled_server.register_blueprint(integrations_bp)



print("Listening on routes: ")
print(handled_server.url_map)
if __name__ == "__main__": handled_server.run(debug=True)

