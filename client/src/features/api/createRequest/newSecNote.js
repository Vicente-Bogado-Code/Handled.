import { API_BASE } from "../../../../config";
export async function newSecondaryNote(noteName,content,imp) {
    const request = await fetch(`${API_BASE}/addSecondaryNote`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "noteName":noteName,
            "content":content,
            "importance": imp
        })
    });
    const response = await request.json()
    return response
}