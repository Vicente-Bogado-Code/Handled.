export async function changeStatus(project_id) {
    const request = await fetch("http://localhost:5000/changeStatus", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"projectId": project_id})
    });
    const response = await request.json()
    return response
}