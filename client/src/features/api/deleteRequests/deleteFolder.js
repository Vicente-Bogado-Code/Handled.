import { API_BASE } from "../../../../config";
export async function deleteFolder(folderId, alsoNotes) {
    const request = await fetch(`${API_BASE}/deleteFolder`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "folderId":folderId,
            "alsoNotes":alsoNotes
        })
    });
    const response = await request.json()
    return response
}