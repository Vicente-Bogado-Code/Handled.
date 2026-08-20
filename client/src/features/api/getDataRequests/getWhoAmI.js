export async function getMyData() {
    const r = await fetch("http://localhost:5000/whoAmI",{
        method:"GET",
        credentials:"include"
    })
    const response = await r.json()
    return response
}