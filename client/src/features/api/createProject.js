export async function createProject(name, desc, gh_repo,currentDate) {
    const gh_repository = gh_repo === "" ? null : gh_repo;
    const status = "active"
    const request = await fetch("http://localhost:5000/addProject", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "name": name,
            "desc": desc,
            "status":status,
            "gh_repo":gh_repository,
            "atDate": currentDate
        })
    });
    const response = await request.json()
    return response
}