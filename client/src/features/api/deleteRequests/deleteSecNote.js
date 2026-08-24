import { API_BASE } from "../../../../config";
export async function deleteSecNote(id) {
    const request = await fetch(`${API_BASE}/deleteSnote`, {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "id": id
        })
    });
    const response = await request.json();
    return response;
}