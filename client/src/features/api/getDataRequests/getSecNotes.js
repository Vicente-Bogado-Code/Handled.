
export async function getSecondaryNotes() {
    const request = await fetch("http://localhost:5000/getSecondaryNotes",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        }
    });
    const response = await request.json()
    return response
}