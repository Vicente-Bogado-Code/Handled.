import { API_BASE } from "../../../../config";

export async function getRepositories() {
    const r = await fetch(`${API_BASE}/getConRepositories`,{
        method:"POST",
        credentials:"include"
    });
    const response = await r.json()
    return response
}

export async function getLinkedRepositoryData() {
    const r = await fetch(`${API_BASE}/getLinkedRepoData`,{
        method:"GET",
        credentials:"include"
    });
    const response = await r.json()
    return response
}