
export async function newSecondaryNote(noteName,content) {
    if (content === null){content = "not given"}
    const request = await fetch("http://localhost:5000/addSecondaryNote",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "noteName":noteName,
            "content":content
        })
    });
    const response = await request.json()
    return response
}