import { API_BASE } from "../../../../config";
export async function getPreferences() {
    const request = await fetch(`${API_BASE}/getPreferences`,{
        method:"GET",
        credentials:"include"
    });
    const response = await request.json()
    return response
}
export async function savePreferences(das,dtas,dimn,dirm,dbp){
    const request = await fetch(`${API_BASE}/savePreferences`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "defaultAutoSave":das,
            "defaultTimeAutoSave":dtas,
            "defaultIncludeMnote":dimn,
            "defaultIncludeReadme":dirm,
            "defaultBePublic":dbp
        })
    })
}