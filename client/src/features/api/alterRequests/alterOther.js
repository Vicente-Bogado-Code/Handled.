import { API_BASE } from "../../../../config";
export async function changeGhRepo(newRepoLink,onId) {
    const request = await fetch(`${API_BASE}/changeRepo`, { 
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "id": onId,
            "newLink":newRepoLink
        })
    });
    const response = await request.json()
    return response
}