from flask import Blueprint,session,request, jsonify, redirect
from db import get_conn
import hmac
import os
import hashlib

integrations_bp = Blueprint("integrations",__name__)

@integrations_bp.route("/github/setup", methods=["GET"])
def get_queryPs():
    current_user_id = session.get("user_id")
    if not current_user_id: return jsonify({"Status": "Not logged"}),401
    installation_id = request.args.get("installation_id")
    if not installation_id: return jsonify({"Status": "Missing installation_id"}), 400
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE handled_users SET installation_id = %s WHERE id = %s", (installation_id,current_user_id))
        conn.commit()
        return redirect("https://handled-kappa.vercel.app/")
    finally:
        cursor.close()
        conn.close()

@integrations_bp.route("/github/webhook", methods=["POST"])
def webhook():
    signature = request.headers.get("X-Hub-Signature-256")
    if not signature:
        return jsonify({"error": "Missing signature"}), 401
    payload = request.get_data()
    srd_secret = os.environ.get("GITHUB_WH_SHARED_SECRET").encode()
    expct_signature = "sha256=" + hmac.new(srd_secret, payload, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature,expct_signature):
        return jsonify({"error": "Invalid signature"}), 401
    data = request.get_json()
    event = request.headers.get("X-Github-Event")
    if event == "push":
        repository = data["repository"]["full_name"]
        for commit in data["commits"]:
            print("Repository", repository)
            print("SHA:", commit["id"])
            print("Message", commit["message"])
    return jsonify({"status": "received"}), 200
