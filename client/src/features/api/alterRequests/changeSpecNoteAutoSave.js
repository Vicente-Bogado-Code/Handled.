import { API_BASE } from "../../../../config";
export async function changeAutoSave(boolean,id) {
    const request = await fetch(`${API_BASE}/changeNoteAutoSave`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "boolean":boolean,
            "id":id
        })
    });
    const r = await request.json()
    return r 
}