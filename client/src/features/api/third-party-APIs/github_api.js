import { API_BASE } from "../../../../config";

export async function getRepositories() {
    const r = await fetch(`${API_BASE}/getConRepositories`,{
        method:"POST",
        credentials:"include"
    });
    const response = await r.json()
    return response
}

export async function getLinkedRepositoryData(project_id) {
    const r = await fetch(`${API_BASE}/getLinkedRepoData`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "securityId": project_id
        })
    });
    const response = await r.json()
    return response
}

export async function assingRepoIdToProject(repoId) {
    const r = await fetch(`${API_BASE}/assingRepoIdToProject`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "repositoryId": repoId
        })
    });
    const response = await r.json()
    return response
}

export async function getAccesibleRepositories() {
    const r = await fetch(`${API_BASE}/getAccesibleRepositories`,{
        method:"GET",
        credentials:"include"
    });
    const response = await r.json()
    return response
}