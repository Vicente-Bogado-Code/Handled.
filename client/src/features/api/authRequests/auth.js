import { API_BASE } from "../../../../config";
export async function registerUser(username, password, email) {
    const request = await fetch((`${API_BASE}/register`), {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "username":username,
            "password":password,
            "email":email
            })
    });
    const response = await request.json()
    return response
}
export async function loginUser(username, password) {
    const request = await fetch(`${API_BASE}/login`,{
    method:"POST",
    credentials:"include",
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify({
        "username":username,
        "password":password
        })
    });
    const response = await request.json()
    return response
}
export async function logout() {
    const request = await fetch(`${API_BASE}/logout`,{
        method:"POST",
        credentials:"include",
    })
}