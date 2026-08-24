import { API_BASE } from "../../../../config";
export async function changeNoteName(newName,id) {
    const request = await fetch(`${API_BASE}/changeNoteName`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "newName":newName,
            "id":id
        })
    });
    const r = await request.json()
    return r 
}