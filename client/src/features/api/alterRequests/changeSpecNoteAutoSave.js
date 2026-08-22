export async function changeAutoSave(boolean,id) {
    const request = await fetch("http://localhost:5000/changeNoteAutoSave",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "boolean":boolean,
            "id":id
        })
    });
    const r = await request.json()
    return r 
}