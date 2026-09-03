import { API_BASE } from "../../../../config";

export async function createFolder(folderName) {
    const request = await fetch(`${API_BASE}/createFolder`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "folderName":folderName
        })
    });
    const response = await request.json()
    return response
}