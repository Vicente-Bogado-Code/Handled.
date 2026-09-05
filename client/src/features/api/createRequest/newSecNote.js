import { API_BASE } from "../../../../config";
export async function newSecondaryNote(noteName,content,imp,on_folder) {
    const request = await fetch(`${API_BASE}/addSecondaryNote`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "noteName":noteName,
            "content":content,
            "importance": imp,
            "on_folder":on_folder
        })
    });
    const response = await request.json()
    return response
}