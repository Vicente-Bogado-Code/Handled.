import psycopg2
import os

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