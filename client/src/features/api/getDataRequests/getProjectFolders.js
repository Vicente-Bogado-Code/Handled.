import { API_BASE } from "../../../../config";
export async function getFolders() {
    const request = await fetch(`${API_BASE}/getFolders`,{
        method:"GET",
        credentials:"include"
    });
    const response = await request.json()
    return response
}