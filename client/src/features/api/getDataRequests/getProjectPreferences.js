export async function getProjectPreferences() {
    const r = await fetch("http://localhost:5000/getProjectPreferences",{
        method:"GET",
        credentials:'include'
    });
    const response = await r.json()
    return response
}