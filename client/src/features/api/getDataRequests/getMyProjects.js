export async function getMyProjects() {
    const request = await fetch("http://localhost:5000/getMyProjects", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        }
    });
    const response = await request.json()
    return response
}