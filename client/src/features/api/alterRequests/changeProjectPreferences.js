import { API_BASE } from "../../../../config";
export async function changeProjectPreferences(commitH,ispublic,autoS,autoSinterval,theme) {
    const request = await fetch(`${API_BASE}/changeProjectPreferences`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "newCommitH":commitH,
            "newPublic":ispublic,
            "newAutoS":autoS,
            "newAutoSInterval":autoSinterval,
            "newTheme":theme

        })
    });
    const r = await request.json()
    return r
}