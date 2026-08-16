
export async function saveNoteContent(Snote_id,content) {
    const request = await fetch("http://localhost:5000/saveSnoteContent",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "SnoteId": Snote_id,
            "newContent": content
        })
    });
    const response = await request.json()
    return response
}