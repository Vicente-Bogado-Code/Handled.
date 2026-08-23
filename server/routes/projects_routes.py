from flask import Blueprint, jsonify, request, session
from db import get_conn

projects_bp = Blueprint("projects",__name__)

@projects_bp.route("/getMyProjects",methods=["POST"])
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

@projects_bp.route("/addProject", methods=["POST"])
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
    project_preferences = data.get("projectPreferences")
    prefers_mnote = project_preferences[0]
    prefers_rmnote = project_preferences[1]
    prefers_Bpublic = project_preferences[2]
    prefers_track_commitH = project_preferences[3]
    project_auto_save = project_preferences[4]
    project_auto_save_interval = project_preferences[5]
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT project_name FROM users_projects WHERE project_name = %s AND user_id = %s", (project_name, user_id))
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
    if prefers_track_commitH:
        cursor.execute("INSERT INTO secondary_notes (Snote_name,Snote_content,on_project_id,importance,auto_save) VALUES (%s,%s,%s,%s,%s)",("Commit history","<p>This is a note created by default.</p><p>This default note will track your commit history (only if your project have a github repository linked) and log it here, you can modify this note by clicking the 'turn on modifications' button in the project settings.</p>"+f"<h2>{project_name} commit history:</h2>",row[0],"D",True))
    #
    if prefers_mnote:
        cursor.execute("INSERT INTO secondary_notes (Snote_name,Snote_content,on_project_id,importance,auto_save) VALUES (%s,%s,%s,%s,%s)",(f"{project_name} main","<p>This is a note created by default.</p><p>This default note is meant to be your 'main' note, where you track important events of your project.</p>",row[0],"M",True))
    #
    if prefers_rmnote:
        cursor.execute("INSERT INTO secondary_notes (Snote_name,Snote_content,on_project_id,importance,auto_save) VALUES (%s,%s,%s,%s,%s)",("README","<p>This is a note created by default.</p><h2 style='text-align: center;'><span style='color: rgb(153, 0, 255); font-size: 18px;'><strong>A README text acts as the front door and core guide to a software project</strong></span></h2><p>It tells visitors what the project <strong>does</strong>, why it is <strong>useful</strong> and how other people can help or contribute.</p>" f"<p>What is <strong>{project_name}</strong> about?",row[0],"D",True))
    #
    cursor.execute("INSERT INTO project_preferences VALUES(%s,%s,%s,%s,%s,%s,%s,%s)", (row[0],prefers_mnote,prefers_rmnote,prefers_track_commitH,prefers_Bpublic,project_auto_save,project_auto_save_interval,0))
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

@projects_bp.route("/deleteProject",methods=["POST"])
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
            cursor.execute("DELETE FROM project_preferences WHERE project_id = %s", (project_id,))
            cursor.execute("DELETE FROM users_projects WHERE project_id = %s", (project_id,))
            conn.commit()
            return jsonify({"Status": "Project deleted"}),200
        else:
            return jsonify({"Status": "Project doesn't belong to you"}), 401
    finally:
        cursor.close()
        conn.close()

@projects_bp.route("/changeDescription",methods=["POST"])
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

@projects_bp.route("/changeName",methods=["POST"])
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

@projects_bp.route("/changeStatus", methods=["POST"])
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

@projects_bp.route("/changeRepo",methods=["POST"])
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
        


@projects_bp.route("/setCurrentProject", methods=["POST"])
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

@projects_bp.route("/getProjectPreferences",methods=["GET"])
def give_Ppreferences():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:return jsonify({"Status": "No project selected"}),400 
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM project_preferences WHERE project_id = %s", (current_project_id,))
        row = cursor.fetchone()
        current_project_preferences = [{
            "projectId": row[0],
            "includeMnote": row[1],
            "includeReadmeNote": row[2],
            "trackCommitHistory": row[3],
            "isPublic": row[4],
            "hasAutoSave": row[5],
            "autoSaveInterval": row[6],
            "theme": row[7]
        }]
        return jsonify({"Status": "Data retrieved", "projectPreferences": current_project_preferences}), 200
    finally:
            cursor.close()
            conn.close()

@projects_bp.route("/changeProjectPreferences", methods=["POST"])
def change_p_preferences():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}), 401
    current_project_id = session.get("current_project_id")
    if not current_project_id:
        return jsonify({"Status": "No project selected"}), 400
    data = request.get_json()
    new_mn = data.get("newMN")
    new_rm = data.get("newRM")
    new_commit_h = data.get("newCommitH")
    new_public = data.get("newPublic")
    new_auto_s = data.get("newAutoS")
    new_auto_s_interval = data.get("newAutoSInterval")
    new_theme = data.get("newTheme")
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE project_preferences
            SET
                include_main_note = %s,
                include_readme_note = %s,
                track_commit_history = %s,
                public = %s,
                auto_save = %s,
                auto_save_interval = %s,
                theme = %s
            WHERE project_id = %s
        """, (new_mn,new_rm,new_commit_h,new_public,new_auto_s,new_auto_s_interval,new_theme,current_project_id))
        conn.commit()
        return jsonify({"Status": "Preferences updated"}), 200
    finally:
        cursor.close()
        conn.close()