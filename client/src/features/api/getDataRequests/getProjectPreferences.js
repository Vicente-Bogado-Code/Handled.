import { API_BASE } from "../../../../config";
export async function getProjectPreferences() {
    const r = await fetch(`${API_BASE}/getProjectPreferences`,{
        method:"GET",
        credentials:'include'
    });
    const response = await r.json()
    return response
}