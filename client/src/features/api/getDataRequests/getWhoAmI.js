import { API_BASE } from "../../../../config"
export async function getMyData() {
    const r = await fetch(`${API_BASE}/whoAmI`,{
        method:"GET",
        credentials:"include"
    })
    const response = await r.json()
    return response
}