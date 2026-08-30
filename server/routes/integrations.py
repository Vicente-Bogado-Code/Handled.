from flask import Blueprint,session,request, jsonify, redirect
from db import get_conn
import hmac
import os
import hashlib
import time
import jwt
import requests

integrations_bp = Blueprint("integrations",__name__)

def get_gh_JWT():
    now_to_int = int(time.time())
    app_id = os.environ.get("GITHUB_APP_ID")
    payload = {
        "iat": now_to_int - 60,
        "exp": now_to_int + (10 * 60),
        "iss": app_id
    }
    with open ("/etc/secrets/private_key_pem", "r") as f:
        pem_key = f.read()
    jwebt = jwt.encode(
        payload,
        pem_key,
        algorithm="RS256"
    )
    return jwebt

def get_installation_token(jwebt,installation_id):
    r = requests.post(
    f"https://api.github.com/app/installations/{installation_id}/access_tokens", #gh endpoint
    headers={
        "Authorization": f"Bearer {jwebt}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10"
         }
    )
    r.raise_for_status()
    i_token = r.json()["token"]
    return i_token


@integrations_bp.route("/github/setup", methods=["GET"])
def github_setup():
    current_user_id = session.get("user_id")
    if not current_user_id: return jsonify({"Status": "Not logged"}),401
    installation_id = request.args.get("installation_id")
    if not installation_id: return jsonify({"Status": "Missing installation_id"}), 400
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE handled_users SET installation_id = %s WHERE id = %s", (installation_id,current_user_id))
        conn.commit()
        return redirect("https://handled-kappa.vercel.app/?github-status=connected")
    finally:
        cursor.close()
        conn.close()

@integrations_bp.route("/getConRepositories", methods=["POST"])
def assing_repositories():
    current_user_id = session.get("user_id")
    if not current_user_id: return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id: return jsonify({"Status": "No project selected"}),401
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT installation_id FROM handled_users WHERE id = %s", (current_user_id,))
        row = cursor.fetchone()
        cu_installation_id = row[0]
        if cu_installation_id is None:
            return jsonify({"Status": "This user doesn't an installation id"}), 401
        jwtoken = get_gh_JWT()
        installation_token = get_installation_token(jwtoken,cu_installation_id)
        response = requests.get(
            "https://api.github.com/installation/repositories",
            params={
                "per_page": 100,
                "page": 1
            },
            headers={
                "Authorization": f"Bearer {installation_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2026-03-10"
            }
        )
        response.raise_for_status()
        repositories = response.json()["repositories"]
        if len(repositories) == 0:
            return jsonify({"Status": "No repositories found"}),200
        if len(repositories) > 1:
            return jsonify({"Status":"Several repositories found", "repositories":[
                {
                "id": repo["id"],
                "name": repo["name"],
                "full_name": repo["full_name"],
                "html_url": repo["html_url"]
                }
                for repo in repositories
            ]}),200
        repository_id = repositories[0]["id"]
        cursor.execute("UPDATE users_projects SET github_repo_id = %s WHERE user_id = %s AND project_id = %s", (repository_id,current_user_id,current_project_id))
        conn.commit()
        return jsonify({"Status": f"Project {current_project_id} is now linked to github repository {repository_id}"})
    finally:
        cursor.close()
        conn.close()

@integrations_bp.route("/getLinkedRepoData", methods=["POST"])
def give_linked_repo_data():
    current_user_id = session.get("user_id")
    if not current_user_id: return jsonify({"Status": "Not logged"}),401
    data = request.get_json()
    if not data or "securityId" not in data:
        return jsonify({"Status":"Missing fields"}),401
    secure_project_id = data.get("securityId")
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT github_repo_id FROM users_projects WHERE user_id = %s AND project_id = %s", (current_user_id,secure_project_id))
        r = cursor.fetchone()
        if r is None:
            return jsonify({"Status":"This project doesn't have a repository id"}), 400
        cursor.execute("SELECT installation_id FROM handled_users WHERE id = %s", (current_user_id,))
        row = cursor.fetchone()
        if row is None:
                return jsonify({"Status": "Installation id not found"}), 400
        installation_id = row[0]
        jwtoken = get_gh_JWT()
        installation_token = get_installation_token(jwtoken,installation_id)
        linked_repository_id = r[0]
        resp = requests.get(
                f"https://api.github.com/repositories/{linked_repository_id}",
                headers={
                    "Authorization": f"Bearer {installation_token}",
                    "Accept": "application/vnd.github+json"
                })
        if resp.status_code != 200:
                return jsonify({"Status": "Failed to fetch repository data", "GithubStatus": resp.status_code}), 502
        repo_data = resp.json()
        return jsonify({"Status":"Repository id retrieved", "repoData":repo_data })
    finally:
        cursor.close()
        conn.close()

@integrations_bp.route("/assingRepoIdToProject", methods=["POST"])
def assing_repository_id():
    current_user_id = session.get("user_id")
    if not current_user_id: return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id: return jsonify({"Status": "No project selected"}),401
    data = request.get_json()
    if not data or "repositoryId" not in data:
        return jsonify({"Status": "Missing fields"}),400
    repository_id = data.get("repositoryId")
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE users_projects SET github_repo_id = %s WHERE user_id = %s AND project_id = %s", (repository_id,current_user_id,current_project_id))
        conn.commit()
        return jsonify({"Status": "Repository id set correctly"}), 200
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
    if event != "push":
        return jsonify({"Status":"Ignored"}), 200
    repository_name = data["repository"]["name"]
    repository_id = data["repository"]["id"]
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT project_id FROM users_projects WHERE github_repo_id = %s", (repository_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"Status":"Repository isn't connected to any handled project"}), 401
        project_id = row[0]
        for commit in data["commits"]:
            commit_sha = commit["id"]
            commit_message = commit["message"]
            commit_timestamp = commit["timestamp"]
            commit_sender = commit["sender"]["login"]
            cursor.execute(
                """
                INSERT INTO webhook_deliveries
                (project_id, repository_id, repository_name,
                 commit_sha, payload_message, payload_timestamp,
                 payload_sender)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (project_id,repository_id,repository_name,commit_sha,commit_message,commit_timestamp,commit_sender))
        conn.commit()
        return jsonify({"Status":"Webhook processed"}), 200
    finally:
        cursor.close()
        conn.close()
