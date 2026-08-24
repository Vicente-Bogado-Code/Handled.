import { API_BASE } from "../../../../config";
export async function createProject(name, desc, gh_repo,currentDate, projectPreferencesArray) {
    const gh_repository = gh_repo === "" ? null : gh_repo;
    const status = "active"
    console.log(projectPreferencesArray)
    const request = await fetch(`${API_BASE}/addProject`, {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "name": name,
            "desc": desc,
            "status":status,
            "gh_repo":gh_repository,
            "atDate": currentDate,
            "projectPreferences": projectPreferencesArray
        })
    });
    const response = await request.json()
    return response
}