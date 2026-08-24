import { API_BASE } from "../../../../config";
export async function getMyProjects() {
    const request = await fetch(`${API_BASE}/getMyProjects`, {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        }
    });
    const response = await request.json()
    return response
}