export async function changeGhRepo(newRepoLink,onId) {
    const request = await fetch("http://localhost:5000/changeRepo", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "id": onId,
            "newLink":newRepoLink
        })
    });
    const response = await request.json()
    return response
}