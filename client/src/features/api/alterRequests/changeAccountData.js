import { API_BASE } from "../../../../config";
export async function changeAccountData(newName, newEmail, newDesc) {
    const request = await fetch(`${API_BASE}/changeAccData`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "newName":newName,
            "newEmail":newEmail,
            "newDesc": newDesc
        })
    });
    const response = await request.json()
    return response
}