import { API_BASE } from "../../../../config";
export async function changeNoteImportantStatus(noteId,boolean) {
    const request = await fetch(`${API_BASE}/changeImportantStatus`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "id":noteId,
            "boolean": boolean
        })
    });
    const response = await request.json()
    return response
}