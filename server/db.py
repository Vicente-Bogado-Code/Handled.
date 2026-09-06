import psycopg2
import os
from functools import wraps
from flask import session,jsonify,redirect

def with_resolved_power(f):
    @wraps(f)
    def wrapper(*args,**kwargs):
        current_user_id = session.get("user_id")
        project_id = session.get("current_project_id")
        conn = get_conn()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT user_id FROM users_projects WHERE project_id = %s", (project_id,))
            row = cursor.fetchone()
            if row is None:
                return redirect("https://handled-kappa.vercel.app/"),404
            user_id = row[0]
            cursor.execute("SELECT public FROM project_preferences WHERE project_id = %s",(project_id,))
            row = cursor.fetchone()
            if row is None:
                return redirect("https://handled-kappa.vercel.app/"),404
            public = row[0]
        finally:
            cursor.close()
            conn.close()
        if user_id == current_user_id: role = "owner"
        elif public: role = "visitor"
        else: 
            return redirect("https://handled-kappa.vercel.app/"),404
        return f(*args,role=role,**kwargs)
    return wrapper


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