export async function setCurrentProject(project_id) {
    const request = await fetch("http://localhost:5000/setCurrentProject", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"project_id":project_id})
    });
    const response = await request.json()
    return response
}
export async function clearSess() {
    const request = await fetch("http://localhost:5000/setCurrentProject", {
        method:"POST",
        credentials:"include",
    });
}