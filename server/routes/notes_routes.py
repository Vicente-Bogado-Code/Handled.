from flask import Blueprint,session,request, jsonify
import bcrypt
from db import get_conn

notes_bp = Blueprint('Notes',__name__)

@notes_bp.route("/addMainNote", methods=["POST"])
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

@notes_bp.route("/getMainNotes", methods=["POST"])
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


@notes_bp.route("/addSecondaryNote", methods=["POST"])
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
    cursor.execute("INSERT INTO secondary_notes(Snote_name,Snote_content,on_project_id,importance,auto_save) VALUES (%s,%s,%s,%s,%s) RETURNING Snote_id,Snote_name, Snote_content,importance,auto_save", (Snote_name,Snote_content,current_project_id,imp,True))
    db_response = cursor.fetchone()
    note = {
        "id": db_response[0],
        "name": db_response[1],
        "content": db_response[2],
        "importance": db_response[3],
        "auto_save": db_response[4]
    }
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"Status": "Secondary note created", "Snote":note}),200

@notes_bp.route("/getSecondaryNotes",methods=["POST"])
def get_secondary_notes():
    current_user_id = session.get("user_id")
    if not current_user_id:return jsonify({"Status": "Not logged"}),401
    current_project_id = session.get("current_project_id")
    if not current_project_id:return jsonify({"Status": "No project selected"}),400 
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT Snote_id,Snote_name,Snote_content,importance,auto_save FROM secondary_notes WHERE on_project_id = %s", (current_project_id,))
    db_response = cursor.fetchall()
    retrieved_notes = [
        {
            "id": row[0],
            "name": row[1],
            "content": row[2],
            "importance": row[3],
            "auto_save": row[4]
        }
        for row in db_response
    ]
    cursor.close()
    conn.close()
    return jsonify({"Snotes": retrieved_notes, "Status": "Main notes retrieved"}),200

@notes_bp.route("/deleteSnote",methods=["POST"])
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


@notes_bp.route("/saveSnoteContent",methods=["POST"])
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

@notes_bp.route("/changeNoteName",methods=["POST"])
def change_name():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    data = request.get_json()
    if not data or "id" not in data or "newName" not in data:
        return jsonify({"Status": "Missing fields"}),400
    note_id = data.get("id")
    new_name = data.get("newName")
    try:
        cursor.execute(
            """
            SELECT user_id
            FROM secondary_notes
            JOIN users_projects ON secondary_notes.on_project_id = users_projects.project_id
            WHERE snote_id = %s
            """, (note_id,))
        r = cursor.fetchone()
        if r is None:
            return jsonify({"Status": "Note doesn't exists"}),401
        if r[0] == current_user_id:
            cursor.execute("UPDATE secondary_notes SET snote_name = %s WHERE snote_id = %s", (new_name,note_id))
            conn.commit()
            return jsonify({"Status": "Name changed"}),200
        else:
            return jsonify({"Status": "Note doesn't belong to you"}), 403
    finally:
        cursor.close()
        conn.close()

@notes_bp.route("/changeNoteAutoSave",methods=["POST"])
def change_note_auto_save():
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"Status": "Not logged"}),401
    conn = get_conn()
    cursor = conn.cursor()
    data = request.get_json()
    if not data or "id" not in data or "boolean" not in data:
        return jsonify({"Status": "Missing fields"}),400
    note_id = data.get("id")
    boolean = data.get("boolean")
    print(boolean)
    try:
        cursor.execute(
            """
            SELECT user_id
            FROM secondary_notes
            JOIN users_projects ON secondary_notes.on_project_id = users_projects.project_id
            WHERE snote_id = %s
            """, (note_id,))
        r = cursor.fetchone()
        if r is None:
            return jsonify({"Status": "Note doesn't exists"}),401
        if r[0] == current_user_id:
            cursor.execute("UPDATE secondary_notes SET auto_save = %s WHERE snote_id = %s", (boolean,note_id))
            conn.commit()
            return jsonify({"Status": "Auto save changed"}),200
        else:
            return jsonify({"Status": "Note doesn't belong to you"}), 403
    finally:
        cursor.close()
        conn.close()