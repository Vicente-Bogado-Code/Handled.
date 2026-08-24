import { API_BASE } from "../../../../config";
export async function getSecondaryNotes() {
    const request = await fetch(`${API_BASE}/getSecondaryNotes`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        }
    });
    const response = await request.json()
    return response
}