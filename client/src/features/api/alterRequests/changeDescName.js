import { API_BASE } from "../../../../config";
export async function changeProjectDesc(id,newDesc){
    const request = await fetch(`${API_BASE}/changeDescription`, {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "newDesc":newDesc,
            "id":id
        })
    });
    const response = await request.json()
    return response
}
export async function changeProjectName(id,newName) {
    const request = await fetch(`${API_BASE}/changeName`,{
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
    const response = await request.json()
    return response
}