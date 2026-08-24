import { API_BASE } from "../../../../config";
export async function deleteMyAccount() {
    const request = await fetch(`${API_BASE}/deleteMyAccount`,{
        method:"POST",
        credentials:"include",
    });
}