from flask import Blueprint,session,request, jsonify
import bcrypt
from db import get_conn, get_user_data


auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register",methods=["POST"])
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
        user_id = cursor.fetchone()[0]
        cursor.execute("INSERT INTO preferences(default_auto_save,default_time_auto_save,default_include_mnote,default_include_readme,default_be_public,user_id) VALUES (%s,%s,%s,%s,%s,%s)",(True,10,True,True,False,user_id))
    else: 
        cursor.close()
        conn.close()
        return jsonify({"Status": "Conflict"}),409
    conn.commit()
    cursor.close()
    conn.close
    session["user_id"] = user_id
    return jsonify({"Status":"Created","username":username, "email":email}),201

@auth_bp.route("/login", methods=["POST"])
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
        return jsonify ({"Status": "Valid credentials", "username":username, "email": email}),200
    else: return jsonify({"Status": "Invalid credentials"}),401

@auth_bp.route("/logout", methods=["POST"])
def execute_logout():
    session.clear()
    return jsonify({"Status": "Logged out"}),200

@auth_bp.route("/changeAccData",methods=["POST"])
def change_acc_data():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    data = request.get_json()
    if not data or "newName" not in data or "newEmail" not in data:
        return jsonify({"Status": "Missing fields"}),400
    new_username = data.get("newName")
    new_email = data.get("newEmail")
    new_description = data.get("newDesc")
    try:
       cursor.execute("SELECT id FROM handled_users WHERE username = %s AND id != %s", (new_username, current_user_id))
       r = cursor.fetchone()
       if r is None:
           cursor.execute("UPDATE handled_users SET username = %s, email = %s, description = %s WHERE id = %s", (new_username, new_email, new_description, current_user_id))
           conn.commit()
           return jsonify({"Status": "Data changed"}), 200
       else: return jsonify({"Status": "Username already taken"}), 409
    finally:
        cursor.close()
        conn.close()

@auth_bp.route("/deleteMyAccount",methods=["POST"])
def delete_account():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM handled_users WHERE id = %s", (current_user_id,))
        r = cursor.fetchone()
        if r is None:
            return jsonify({"Status":"Account doesn't exist"}),404
        cursor.execute("DELETE FROM secondary_notes WHERE on_project_id IN (SELECT project_id FROM users_projects WHERE user_id = %s)", (current_user_id,))
        cursor.execute("DELETE FROM users_projects WHERE user_id = %s", (current_user_id,))
        cursor.execute("DELETE FROM handled_users WHERE id = %s", (current_user_id,))
        session.clear()
        conn.commit()
        return jsonify({"Status": "Account deleted"}),200
    finally:
        cursor.close()
        conn.close()

@auth_bp.route("/whoAmI", methods=["GET"])
def give_data():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT username,email,description FROM handled_users WHERE id = %s", (current_user_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"Status": "User not found"}), 404
        response = {
            "id": current_user_id,
            "username": row[0],
            "email": row[1],
            "description": row[2]
        }
        return jsonify({"Status": "Data retrieved", "Me": response}), 200
    finally:
        cursor.close()
        conn.close()

@auth_bp.route("/getPreferences", methods=["GET"])
def give_preferences():
    current_user_id = session.get("user_id")
    if not current_user_id: return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM preferences WHERE user_id = %s", (current_user_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"Status": "User not found"}), 404
        response = {
            "defaultAutoSave": row[0],
            "defaultTimeAutoSave": row[1],
            "defaultIncludeMnote": row[2],
            "defaultIncludeReadme": row[3],
            "defaultBePublic":row[4],
            "userId":row[5]
        }
        return jsonify({"Status": "Data retrieved", "userPreferences": response}), 200
    finally:
        cursor.close()
        conn.close()

@auth_bp.route("/savePreferences",methods=["POST"])
def save_preferences():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    data = request.get_json()
    required = ["defaultAutoSave","defaultTimeAutoSave", "defaultIncludeMnote", "defaultIncludeReadme", "defaultBePublic"]
    if not data or not all(field in data for field in required):
        return jsonify({"Status": "Missing fields"}),400
    das = data.get(required[0])
    dtas = data.get(required[1])
    dimn = data.get(required[2])
    dirm = data.get(required[3])
    dbp = data.get(required[4])
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
        """
        UPDATE preferences 
        SET default_auto_save = %s, 
        default_time_auto_save = %s, 
        default_include_mnote = %s, 
        default_include_readme = %s, 
        default_be_public = %s
        WHERE user_id = %s
        """, (das,dtas,dimn,dirm,dbp,current_user_id))
        conn.commit()
        return jsonify({"Status": "Preferences updated"}),200
    finally:
        cursor.close()
        conn.close()
