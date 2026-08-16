
export async function newSecondaryNote(noteName,content,imp) {
    if (content === ""){content = "not given"}
    else (content = `<h2 style="text-align:center;">${content}</h2>`)
    const request = await fetch("http://localhost:5000/addSecondaryNote",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "noteName":noteName,
            "content":content,
            "importance": imp
        })
    });
    const response = await request.json()
    return response
}