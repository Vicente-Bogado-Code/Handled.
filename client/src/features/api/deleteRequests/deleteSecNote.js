export async function deleteSecNote(id) {
    const request = await fetch("http://localhost:5000/deleteSnote", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "id": id
        })
    });
    const response = await request.json();
    return response;
}