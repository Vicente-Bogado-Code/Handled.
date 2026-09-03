import { API_BASE } from "../../../../config";
export async function assingNoteToFolder(noteId,folderId) {
    const request = await fetch(`${API_BASE}/assingNoteToFolder`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "noteId":noteId,
            "folderId": folderId
        })
    });
    const response = await request.json()
    return response
}