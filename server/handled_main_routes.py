from flask import Flask, jsonify, request, session
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()
import bcrypt

handled_server = Flask(__name__)
CORS(handled_server,supports_credentials=True,origins=["http://localhost:5173"])
handled_server.secret_key = os.environ.get("SECRET_KEY")

def get_conn():
    return psycopg2.connect(
        host=os.environ.get("CONN_HOST"),
        database=os.environ.get("CONN_DB"),
        user=os.environ.get("CONN_USER"),
        password=os.environ.get("CONN_PASSWORD")
    )
def get_user_data(request):
    user_data = request.get_json()
    uname = user_data.get("username")
    pw = user_data.get("password")
    email = user_data.get("email")
    
    return uname, pw, email
"""
MAIN ROUTES IN THIS FILE (in order):
@/register,
@/login, 
@/logout, 
#
@/addProject, 
@/getMyProjects,
@/changeStatus 
@/setCurrentProject,
# 
@/addMainNote, 
@/getMainNotes, 
@/setCurrentMainNote
#
@/addSecondaryNote,
@/getSecondaryNotes
"""

@handled_server.route("/register",methods=["POST"])
def register_user():
    username, password, get_email = get_user_data(request)
    print(get_email)
    email = "not given" if get_email == "" else get_email
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM handled_users WHERE username = %s", (username,))
    db_response = cursor.fetchone()
    if db_response is None:
        cursor.execute("INSERT INTO handled_users (username,hsd_password,email) VALUES (%s,%s,%s) RETURNING id", (username,hashed_pw,email))
    else: 
        cursor.close()
        conn.close()
        return jsonify({"Status": "Conflict"}),409
    user_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    conn.close
    session["user_id"] = user_id
    return jsonify({"Status":"Created","username":username}),201

@handled_server.route("/login", methods=["POST"])
def log_user():
    username,password,email = get_user_data(request)
    password = password.encode('utf-8')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM handled_users WHERE username = %s", (username,))
    db_response = cursor.fetchone()
    if db_response is None:
        cursor.close()
        conn.close()
        return jsonify({"Status": "User doesn't exists"}),401
    user_id = db_response[0]
    user_hds_pw = db_response[2].encode('utf-8')
    cursor.close()
    conn.close()
    coincidence = bcrypt.checkpw(password,user_hds_pw)
    if coincidence:
        session["user_id"] = user_id
        return jsonify ({"Status": "Valid credentials", "username":username}),200
    else: return jsonify({"Status": "Invalid credentials"}),401

@handled_server.route("/logout", methods=["POST"])
def execute_logout():
    session.clear()
    return jsonify({"Status": "Logged out"}),200

     
@handled_server.route("/getMyProjects",methods=["POST"])
def get_projects():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT project_id,project_name,description,gh_repo,status,atDate FROM users_projects WHERE user_id = %s",(user_id,))
    db_response = cursor.fetchall()
    projects = []
    for row in db_response:
        projects.append({
            "project_id":row[0],
            "name":row[1],
            "description":row[2],
            "repoLink":row[3],
            "status":row[4],
            "atDate":row[5]
        })
    cursor.close()
    conn.close()
    return jsonify({"projects": projects,"Status": "Projects retrieved"}),200

@handled_server.route("/addProject", methods=["POST"])
def add_project():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"Status": "Not logged"}),401
    data = request.get_json()
    project_name = data.get("name")
    project_desc = data.get("desc")
    project_status = data.get("status")
    get_project_ghrepo = data.get("gh_repo")
    project_ghrepo = "not given"  if get_project_ghrepo is None else get_project_ghrepo
    project_atDate = data.get("atDate")
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT project_name FROM users_projects WHERE project_name = %s", (project_name,))
    db_response = cursor.fetchall()
    if db_response == []:
        cursor.execute(
        "INSERT INTO users_projects (project_name, user_id,description,gh_repo,status,atDate) VALUES (%s,%s,%s,%s,%s,%s) RETURNING project_id, project_name, description, gh_repo, status,atDate", 
       (project_name, user_id,project_desc,project_ghrepo,project_status,project_atDate))
        row = cursor.fetchone()
        conn.commit()
    else: 
        cursor.close()
        conn.close()
        return jsonify({"Status": "Project already exists"}),409
    cursor.execute("INSERT INTO secondary_notes (Snote_name,Snote_content,on_project_id,importance) VALUES (%s,%s,%s,%s)",("Commit history","<p>This is a note created by default.</p><p>This default note will track your commit history (only if your project have a github repository linked) and log it here, you can modify this note by clicking the 'turn on modifications' button in the project settings.</p>"+f"<h2>{project_name} commit history:</h2>",row[0],"D"))
    #
    cursor.execute("INSERT INTO secondary_notes (Snote_name,Snote_content,on_project_id,importance) VALUES (%s,%s,%s,%s)",(f"{project_name} main","<p>This is a note created by default.</p><p>This default note is meant to be your 'main' note, where you track important events of your project.</p>",row[0],"M"))
    #
    cursor.execute("INSERT INTO secondary_notes (Snote_name,Snote_content,on_project_id,importance) VALUES (%s,%s,%s,%s)",("README","<p>This is a note created by default.</p><h2 style='text-align: center;'><span style='color: rgb(153, 0, 255); font-size: 18px;'><strong>A README text acts as the front door and core guide to a software project</strong></span></h2><p>It tells visitors what the project <strong>does</strong>, why it is <strong>useful</strong> and how other people can help or contribute.</p>" f"<p>What is <strong>{project_name}</strong> about?",row[0],"D"))
    #
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"Status":"Project created",
    "projects": {
        "project_id": row[0],
        "name": row[1],
        "description": row[2],
        "repoLink": row[3],
        "status": row[4],
        "atDate": row[5]
    }}),200

@handled_server.route("/deleteProject",methods=["POST"])
def delete_project():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"Status": "Not logged"}),401
    data = request.get_json()
    if not data or "id" not in data:
        return jsonify({"Status": "Missing fields"}),400
    project_id = data.get("id")
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT user_id FROM users_projects WHERE project_id = %s",(project_id,))
        r = cursor.fetchone()
        if r is None:
            return jsonify({"Status": "Project doesn't exists"}),401
        if user_id == r[0]:
            cursor.execute("DELETE FROM secondary_notes WHERE on_project_id = %s", (project_id,))
            cursor.execute("DELETE FROM users_projects WHERE project_id = %s", (project_id,))
            conn.commit()
            return jsonify({"Status": "Project deleted"}),200
        else:
            return jsonify({"Status": "Project doesn't belong to you"}), 401
    finally:
        cursor.close()
        conn.close()

@handled_server.route("/changeDescription",methods=["POST"])
def change_desc():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    data = request.get_json()
    if not data or "id" not in data or "newDesc" not in data:
        return jsonify({"Status": "Missing fields"}),400
    project_id = data.get("id")
    new_desc = data.get("newDesc")
    try:
        cursor.execute("SELECT user_id FROM users_projects WHERE project_id = %s",(project_id,))
        r = cursor.fetchone()
        if r is None:
            return jsonify({"Status": "Project doesn't exists"}),401
        if r[0] == current_user_id:
            cursor.execute("UPDATE users_projects SET description = %s WHERE project_id = %s", (new_desc,project_id))
            conn.commit()
            return jsonify({"Status": "Description changed"}),200
        else:
            return jsonify({"Status": "Project doesn't belong to you"}), 403
    finally:
        cursor.close()
        conn.close()

@handled_server.route("/changeName",methods=["POST"])
def change_name():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    data = request.get_json()
    if not data or "id" not in data or "newName" not in data:
        return jsonify({"Status": "Missing fields"}),400
    project_id = data.get("id")
    new_name = data.get("newName")
    try:
        cursor.execute("SELECT user_id FROM users_projects WHERE project_id = %s",(project_id,))
        r = cursor.fetchone()
        if r is None:
            return jsonify({"Status": "Project doesn't exists"}),401
        if r[0] == current_user_id:
            cursor.execute("UPDATE users_projects SET project_name = %s WHERE project_id = %s", (new_name,project_id))
            conn.commit()
            return jsonify({"Status": "Name changed"}),200
        else:
            return jsonify({"Status": "Project doesn't belong to you"}), 403
    finally:
        cursor.close()
        conn.close()

@handled_server.route("/changeStatus", methods=["POST"])
def change_status():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    data = request.get_json()
    project_id = data.get("projectId")
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT status,user_id FROM users_projects WHERE project_id = %s", (project_id,))
    db_response = cursor.fetchone()
    if db_response is None:
        cursor.close()
        conn.close()
        return jsonify({"Status": "Project not found"}), 404
    project_current_status = db_response[0]
    project_user_id = db_response[1]
    change_status = "active" if project_current_status == "done" else "done"
    if current_user_id == project_user_id:
        cursor.execute("UPDATE users_projects SET status = %s WHERE project_id = %s", (change_status, project_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"Status": "Status changed", "new_status": change_status}),200
    else:
        cursor.close()
        conn.close()
        return jsonify({"Status": "Project doesn't belong to you"}),403

@handled_server.route("/changeRepo",methods=["POST"])
def change_repoLink():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    data = request.get_json()
    if not data or "id" not in data or "newLink" not in data:
        return jsonify({"Status": "Missing fields"}),400
    project_id = data.get("id")
    new_repo_link = data.get("newLink")
    if not new_repo_link.startswith("https://github.com/"):
        return jsonify({"Status": "Invalid GitHub link"}),400
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT user_id FROM users_projects WHERE project_id = %s", (project_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"Status": "Project not found"}), 404
        if row[0] != current_user_id:
            return jsonify({"Status": "Project doesn't belong to you"}), 403
        cursor.execute("UPDATE users_projects SET gh_repo = %s WHERE project_id = %s", (new_repo_link,project_id))
        conn.commit()
        return jsonify({"Status": "Link changed"}),200
    finally:
        cursor.close()       
        conn.close()
        


@handled_server.route("/setCurrentProject", methods=["POST"])
def set_current_project():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    data = request.get_json()
    current_pjt_id = data.get("project_id")
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT project_name,user_id FROM users_projects WHERE project_id = %s", (current_pjt_id,))
    db_response = cursor.fetchone()
    if db_response is None:
        cursor.close()
        conn.close()
        return jsonify({"Status": "Project doesn't exist"}),404
    project_name = db_response[0]
    belongs_to_user_id = db_response[1]
    if belongs_to_user_id == current_user_id:
        session["current_project_id"] = current_pjt_id
    else:
        cursor.close()
        conn.close()
        return jsonify({"Status": "Forbidden"}), 403
    cursor.close()
    conn.close()
    return jsonify({"Status": "Current project set", "projectName": project_name}),200


@handled_server.route("/addMainNote", methods=["POST"])
def add_main_note():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:
        return jsonify({"Status": "No project selected"}),400
    data = request.get_json()
    main_note_name = data.get("main_note_name")
    main_note_content = data.get("main_note_content")
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO main_notes (Mnote_name, Mnote_content, FKproject_id) VALUES (%s, %s,%s)", (main_note_name,main_note_content, current_project_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"Status": "Main note created"}),200

@handled_server.route("/getMainNotes", methods=["POST"])
def get_main_notes():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:
        return jsonify({"Status": "No project selected"}),400
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT Mnote_name FROM main_notes WHERE FKproject_id = %s", (current_project_id,))
    db_response = cursor.fetchall()
    if db_response == []:
        cursor.close()
        conn.close()
        return jsonify({"Status":"No main notes found"}),404
    main_notes_on_current_id = [note[0] for note in db_response]
    cursor.close()
    conn.close()
    return jsonify({"Main notes on current id": main_notes_on_current_id, "Status": "Main notes retrieved"}),200


@handled_server.route("/addSecondaryNote", methods=["POST"])
def add_secondary_note():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:return jsonify({"Status": "No project selected"}),400 
    data = request.get_json()
    Snote_name = data.get("noteName")
    Snote_content = data.get("content")
    imp = data.get("importance")
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO secondary_notes(Snote_name,Snote_content,on_project_id,importance) VALUES (%s,%s,%s,%s) RETURNING Snote_id,Snote_name, Snote_content,importance", (Snote_name,Snote_content,current_project_id,imp))
    db_response = cursor.fetchone()
    note = {
        "id": db_response[0],
        "name": db_response[1],
        "content": db_response[2],
        "importance": db_response[3]
    }
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"Status": "Secondary note created", "Snote":note}),200

@handled_server.route("/getSecondaryNotes",methods=["POST"])
def get_secondary_notes():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:return jsonify({"Status": "No project selected"}),400 
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT Snote_id,Snote_name,Snote_content,importance FROM secondary_notes WHERE on_project_id = %s", (current_project_id,))
    db_response = cursor.fetchall()
    retrieved_notes = [
        {
            "id": row[0],
            "name": row[1],
            "content": row[2],
            "importance": row[3]
        }
        for row in db_response
    ]
    cursor.close()
    conn.close()
    return jsonify({"Snotes": retrieved_notes, "Status": "Main notes retrieved"}),200

@handled_server.route("/deleteSnote",methods=["POST"])
def delete_Snote():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:return jsonify({"Status": "No project selected"}),400
    data = request.get_json()
    if not data or "id" not in data:
        return jsonify({"Status": "Missing note id"}), 400
    Snote_id = data.get("id")
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        SELECT users_projects.user_id 
        FROM secondary_notes
        JOIN users_projects ON secondary_notes.on_project_id = users_projects.project_id
        WHERE secondary_notes.Snote_id = %s
        """, (Snote_id,))
        row = cursor.fetchone()
        if row is None:
            cursor.close()
            conn.close()
            return jsonify({"Status": "Note not found"}), 404
        if row[0] != current_user_id:
            cursor.close()
            conn.close()
            return jsonify({"Status": "Forbidden"}), 403
        cursor.execute("DELETE FROM secondary_notes WHERE Snote_id = %s",(Snote_id,))
        conn.commit()
        return jsonify({"Status":"Note deleted"}),200
    finally:
        cursor.close()
        conn.close()


@handled_server.route("/saveSnoteContent",methods=["POST"])
def save_content():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:return jsonify({"Status": "No project selected"}),400 
    data = request.get_json()
    new_content = data.get("newContent")
    Snote_id = data.get("SnoteId")
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT users_projects.user_id 
    FROM secondary_notes
    JOIN users_projects ON secondary_notes.on_project_id = users_projects.project_id
    WHERE secondary_notes.Snote_id = %s
    """, (Snote_id,))
    row = cursor.fetchone()
    if row is None:
        cursor.close()
        conn.close()
        return jsonify({"Status": "Note not found"}), 404
    if row[0] != current_user_id:
        cursor.close()
        conn.close()
        return jsonify({"Status": "Forbidden"}), 403
    cursor.execute("UPDATE secondary_notes SET Snote_content = %s WHERE Snote_id = %s",(new_content,Snote_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"Status": "Note content updated"}), 200
    

    


print("Listening on routes: ")
print(handled_server.url_map)
if __name__ == "__main__": handled_server.run(debug=True)

